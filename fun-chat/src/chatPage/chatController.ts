import { api } from "../API/API";
import { isNotNullable } from "../utilities/common";
import { eventBus } from "../utilities/eventBus";
import {
    deleteUserFromSessionStorage,
    getLoginData,
} from "../utilities/sessionStorageTools";
import {
    UserData,
    MessageData,
    NewDeliveredMessage,
    ReadNotification,
    DeletedMessage,
    MessageForEditing,
} from "../utilities/types";
import { MessageDataModel } from "./chatModels/messageData";
import { ParnterModel } from "./chatModels/partner";
import { User } from "./chatModels/user";
import { ChatView } from "./chatView";

export class ChatController {
    private chatView: ChatView;
    private sortOrder: string = "";
    private userModels: Map<string, UserData> = new Map();
    private currentMessagesModels: Map<string, MessageDataModel> = new Map();
    private partnerModel: ParnterModel;
    private isAutoScroll: boolean = false;
    private isEditingMode: boolean = false;
    private currentEditingMessageId: string = "";

    constructor(chatView: ChatView) {
        this.chatView = chatView;
        eventBus.on("activeUsers", (data) => {
            this.addActiveUsers(data, this.sortOrder);
        });
        eventBus.on("inactiveUsers", (data) => {
            this.addInactiveUsers(data, this.sortOrder);
        });
        this.partnerModel = new ParnterModel("", false);
        this.handelUserStatusChanges();
        this.handlePartnerChanges();
        this.handleMessageSending();
        this.handleMessagesFetch();
        this.handelMessageDelivered();
        this.handleMessageRead();
        this.setMessagesReadListeners();
        this.handleAutoScroll();
        this.handleMessageDelete();
        this.handleMessageEditingData();
        this.handleMessageEditing();
    }

    public drawChatView = (): void => {
        this.chatView.draw();
        this.chatView.aboutButton.addListener(
            "click",
            this.aboutButtonListener
        );
        this.chatView.loginOutButton.addListener(
            "click",
            this.loginOutListener
        );
        this.chatView.sendButton.getNode().addEventListener("click", (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        this.chatView.sortInput.addListener("input", this.sortInputlistener);
        this.updateUsersBlock();
    };

    private aboutButtonListener = (): void => {
        this.chatView.destroy();
        this.partnerModel.login = "";
        window.location.hash = "#About";
    };

    private loginOutListener = (): void => {
        const loginData = getLoginData();
        if (isNotNullable(loginData)) {
            api.loginOut(loginData);
            this.chatView.parent.innerHTML = "";
            this.chatView.destroy();
            this.chatView.getNode().innerHTML = "";
            deleteUserFromSessionStorage();
            this.partnerModel.login = "";
            window.location.hash = "#Login";
        }
    };

    private sortInputlistener = (): void => {
        const value = this.chatView.getSortInputValue();
        this.sortOrder = value;
        this.updateUsersBlock();
    };

    private updateUsersBlock = (): void => {
        this.chatView.cleanUsersBlock();
        api.getActiveUsers();
        api.getInactiveUsers();
        this.userModels.forEach((user) => {
            const myData = getLoginData();
            const myName = myData?.userName;
            if (user.login !== myName) {
                api.fetchMessagesWithUser(user.login);
            }
            eventBus.on("messagesFetched", (messages) => {
                const unreadedMessages = [...messages].filter(
                    (message) => message.status.isReaded === false
                );
                const sender = this.userModels.get(messages[0].from);
                if (sender && typeof sender.newMessages === "number") {
                    sender.newMessages = unreadedMessages.length;
                }
            });
        });
    };

    private addActiveUsers = (
        users: Array<UserData>,
        sortOrder: string
    ): void => {
        const loginData = getLoginData();
        const userName = loginData?.userName;
        const usersFiltered = [...users].filter((user) => {
            return user.login.includes(sortOrder);
        });
        const modelsForDraw: Array<UserData> = [];
        [...usersFiltered].forEach((u) => {
            const newUser = new User(u.login, u.isLogined);
            this.userModels.set(u.login, newUser);
            modelsForDraw.push(newUser);
        });
        this.chatView.drawUsers(
            modelsForDraw
                .concat()
                .filter((userModel) => userModel.login !== userName),
            true
        );
    };

    private addInactiveUsers = (
        users: Array<UserData>,
        sortOrder: string
    ): void => {
        const usersFiltered = [...users].filter((user) => {
            return user.login.includes(sortOrder);
        });
        const modelsForDraw: Array<UserData> = [];
        [...usersFiltered].forEach((u) => {
            const newUser = new User(u.login, u.isLogined);
            this.userModels.set(u.login, newUser);
            modelsForDraw.push(newUser);
        });
        this.chatView.drawUsers(modelsForDraw, false);
    };

    private handelUserStatusChanges = (): void => {
        eventBus.on("userStatusChanged", (apiUser: UserData) => {
            const uzer = this.userModels.get(apiUser.login);
            if (uzer) {
                uzer.isLogined = apiUser.isLogined;
            } else {
                this.updateUsersBlock();
            }
            if (this.partnerModel.login === apiUser.login) {
                this.partnerModel.setNewData(apiUser.login, apiUser.isLogined);
            }
        });
    };

    private handelMessageDelivered = (): void => {
        eventBus.on("messagesDelivered", (apiMessage: NewDeliveredMessage) => {
            const changingMessageModal = this.currentMessagesModels.get(
                apiMessage.id
            );
            if (changingMessageModal) {
                changingMessageModal.isDelivered = true;
            }
        });
    };

    private handleMessageRead = (): void => {
        eventBus.on("messageRead", (apiMessage: ReadNotification) => {
            const changinMessageModal = this.currentMessagesModels.get(
                apiMessage.id
            );
            if (changinMessageModal) {
                changinMessageModal.isReaded = true;
            }
        });
    };

    private handlePartnerChanges = (): void => {
        eventBus.on("partnerChanged", (newName) => {
            this.chatView.messageInput.getNode().value = "";
            this.chatView.cleanMessagesConteiner();
            const userStatus = this.userModels.get(newName);
            if (userStatus) {
                userStatus.newMessages = 0;
                this.partnerModel.setNewData(newName, userStatus.isLogined);
                this.currentMessagesModels.clear();
                this.chatView.unblockMessangerAbility();
                api.fetchMessagesWithUser(this.partnerModel.login);
            }
        });
        eventBus.on("parnetnerUpdate", (newPartner) => {
            this.chatView.updatePartnerConteiner(newPartner);
        });
    };

    private handleMessageSending = (): void => {
        eventBus.on("messageSended", (response: MessageData) => {
            if (response.from !== this.partnerModel.login) {
                const sender = this.userModels.get(response.from);
                if (sender && typeof sender.newMessages === "number") {
                    sender.newMessages += 1;
                }
            }
            const messageDataModel = new MessageDataModel(response);
            if (this.isCurrentPartner(response)) {
                this.currentMessagesModels.set(
                    messageDataModel.id,
                    messageDataModel
                );
                this.chatView.drawMessage(response);
            }
            this.chatView.scrollMessages();
        });
    };

    private handleMessagesFetch = (): void => {
        eventBus.on("messagesFetched", (messages: Array<MessageData>) => {
            if (this.partnerModel.login !== "") {
                messages.forEach((message) => {
                    const messageDataModel = new MessageDataModel(message);
                    this.currentMessagesModels.set(
                        messageDataModel.id,
                        messageDataModel
                    );
                    this.chatView.drawMessage(message);
                });
                const sender = this.userModels.get(messages[0].from);
                if (sender && typeof sender.newMessages === "number") {
                    sender.newMessages = 0;
                }
                this.chatView.scrollMessages();
            }
        });
    };

    private handleMessageDelete = (): void => {
        eventBus.on("messageDeleted", (deletedMessage: DeletedMessage) => {
            const deletingModel = this.currentMessagesModels.get(
                deletedMessage.id
            );
            if (deletingModel) {
                console.log("delete");
                this.currentMessagesModels.delete(deletedMessage.id);
            } else {
                this.updateUsersBlock();
            }
            const deletingMessageView = this.chatView.currentMessagesDivMap.get(
                deletedMessage.id
            );
            if (deletingMessageView) {
                deletingMessageView.destroy();
                this.chatView.currentMessagesDivMap.delete(deletedMessage.id);
            }
        });
    };

    private setMessagesReadListeners = (): void => {
        this.chatView.messangesConteiner.addListener(
            "click",
            this.readMessages
        );
        this.chatView.messangesConteiner.addListener(
            "scroll",
            this.readMessages
        );
    };

    private readMessages = (): void => {
        if (this.isAutoScroll === false) {
            this.currentMessagesModels.forEach((message: MessageData) => {
                if (
                    message.from === this.partnerModel.login &&
                    message.status.isReaded === false
                ) {
                    this.chatView.removeNewMessagesLine(message);
                    api.readMessage(message.id);
                }
            });
        }
    };

    private handleAutoScroll = (): void => {
        eventBus.on("autoScroll", (value: boolean) => {
            this.isAutoScroll = value;
        });
    };

    private handleMessageEditingData = (): void => {
        eventBus.on(
            "setEditingMode",
            (editingMessageData: MessageForEditing) => {
                this.isEditingMode = editingMessageData.isEditingMode;
                this.currentEditingMessageId = editingMessageData.id;
            }
        );
    };

    private isCurrentPartner(messageData: MessageData): boolean {
        if (
            this.partnerModel.login === messageData.from ||
            this.partnerModel.login === messageData.to
        ) {
            return true;
        }
        return false;
    }

    private handleMessageEditing = (): void => {
        eventBus.on("messageEditedOnServer", (editedData) => {
            const editingModel = this.currentMessagesModels.get(editedData.id);
            if (editingModel) {
                editingModel.isEdited = editedData.status.isEdited;
                editingModel.newText = editedData.text;
            }
        });
    };

    private sendMessage = (): void => {
        const message = this.chatView.getMessage();
        if (message.trim() !== "") {
            if (this.isEditingMode === false) {
                api.sendMessage(this.partnerModel.login, message);
                this.readMessages();
            } else {
                api.editMessage(this.currentEditingMessageId, message);
                this.isEditingMode = false;
                this.currentEditingMessageId = "";
            }
        }
    };
}
