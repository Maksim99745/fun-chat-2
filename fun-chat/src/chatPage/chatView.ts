import { api } from "../API/API";
import { Component } from "../components/baseComponents";
import {
    getTimeFromUnix,
    isHTMLElement,
    isNotNullable,
} from "../utilities/common";
import { eventBus } from "../utilities/eventBus";
import { getLoginData } from "../utilities/sessionStorageTools";
import { MessageData, UserData } from "../utilities/types";

export class ChatView extends Component<"div"> {
    public parent: HTMLElement;
    public aboutButton: Component<"div">;
    public loginOutButton: Component<"div">;
    public sortInput: Component<"input">;
    public usersConteiner: Component<"div">;
    public partnerConteiner: Component<"div">;
    public messangesConteiner: Component<"div">;
    public messageInput: Component<"input">;
    public sendButton: Component<"button">;
    private userToStatusMap: Map<string, Component<"div">> = new Map();
    public currentMessagesDivMap: Map<string, Component<"div">> = new Map();

    constructor(parent: HTMLElement) {
        super({ tag: "div", className: "chat-page" });
        this.parent = parent;
        this.aboutButton = this.addAboutButton();
        this.loginOutButton = this.addLogitOutButton();
        this.sortInput = this.addSortInput();
        this.usersConteiner = this.addUserConteiner();
        this.partnerConteiner = this.addPartnerConteiner();
        this.messangesConteiner = this.addMessangeConteiner();
        this.messageInput = this.addMessageInput();
        this.sendButton = this.addSendButton();
        this.handleUserStatusChange();
        this.handleNewMessageFromUser();
        this.handlePartnerChange();
        this.handleMessageDeliveryChange();
        this.handleMessageReadChange();
        this.handleEditeStatusChange();
        this.handleTeextChange();
    }

    public draw(): void {
        this.parent.innerHTML = "";
        this.getNode().innerHTML = "";
        this.messangesConteiner.getNode().innerHTML = "";
        console.log("draw chat");
        this.appendChildren([
            this.addHeader(),
            this.addMain(),
            this.addFooter(),
        ]);
        const nodeElement = this.getNode();
        this.parent.appendChild(nodeElement);
    }

    public addHeader = (): Component<"section"> => {
        const header = new Component<"section">({
            tag: "section",
            className: "chat-header",
        });
        const loginData = getLoginData();
        const userName = loginData ? loginData.userName : "Guest";
        const nameBlock = new Component<"div">({
            tag: "div",
            className: "user-name",
            text: `User: ${userName}`,
        });
        const appName = new Component<"div">({
            tag: "div",
            className: "app-name",
            text: "Fun-chat",
        });
        const headerButtons = new Component<"div">({
            tag: "div",
            className: "header-buttons",
        });
        headerButtons.appendChildren([this.aboutButton, this.loginOutButton]);
        header.appendChildren([nameBlock, appName, headerButtons]);
        return header;
    };

    private addAboutButton(): Component<"div"> {
        const aboutButton = new Component<"div">({
            tag: "div",
            className: "chat_about-button",
            text: "About",
        });

        aboutButton.getNode().classList.add("button-element");
        return aboutButton;
    }

    private addLogitOutButton(): Component<"div"> {
        const aboutButton = new Component<"div">({
            tag: "div",
            className: "login-out-button",
            text: "Login out",
        });
        aboutButton.getNode().classList.add("button-element");
        return aboutButton;
    }

    private addMain = (): Component<"section"> => {
        const chatMain = new Component<"section">({
            tag: "section",
            className: "chat-main",
        });
        chatMain.appendChildren([
            this.addUsersConteiner(),
            this.addMessangerSide(),
        ]);
        return chatMain;
    };

    private addUsersConteiner = (): Component<"div"> => {
        const usersSide = new Component<"div">({
            tag: "div",
            className: "users-side",
        });
        usersSide.appendChildren([this.sortInput, this.usersConteiner]);
        return usersSide;
    };

    private addUserConteiner = (): Component<"div"> => {
        const usersConteiner = new Component<"div">({
            tag: "div",
            className: "users-conteiner",
        });
        return usersConteiner;
    };

    private addSortInput = (): Component<"input"> => {
        const sortInput = new Component<"input">({
            tag: "input",
            className: "sort-input",
        });
        sortInput.setInputAttributes({
            type: "text",
            placeholder: "Search...",
        });
        return sortInput;
    };

    public getSortInputValue = (): string => {
        const { value } = this.sortInput.getNode();
        return value;
    };

    private addMessangerSide = (): Component<"div"> => {
        const messangerSide = new Component<"div">({
            tag: "div",
            className: "messanger-side",
        });
        const initialText = new Component<"div">({
            tag: "div",
            className: "messange-conteiner__initial-text",
            text: "Choose user in order to send message...",
        });
        this.messangesConteiner.append(initialText);
        messangerSide.appendChildren([
            this.partnerConteiner,
            this.messangesConteiner,
            this.addMessangeInputBLock(),
        ]);
        return messangerSide;
    };

    private addMessangeConteiner = (): Component<"div"> => {
        const messangerConteiner = new Component<"div">({
            tag: "div",
            className: "messange-conteiner",
        });
        return messangerConteiner;
    };

    private addMessangeInputBLock = (): Component<"form"> => {
        const messangeInputBlock = new Component<"form">({
            tag: "form",
            className: "messange-input-block",
        });
        messangeInputBlock.appendChildren([this.messageInput, this.sendButton]);
        return messangeInputBlock;
    };

    private addMessageInput = (): Component<"input"> => {
        const messageInput = new Component<"input">({
            tag: "input",
            className: "message-input",
        });
        messageInput.setInputAttributes({
            type: "text",
            placeholder: "Message...",
            disabled: "",
        });
        return messageInput;
    };

    private addSendButton = (): Component<"button"> => {
        const sendButton = new Component<"button">({
            tag: "button",
            className: "button-element",
            text: "Send",
        });
        sendButton.addClass("send-button");
        sendButton.setAttribute("disabled", "");
        sendButton.setAttribute("type", "submit");
        return sendButton;
    };

    public unblockMessangerAbility = (): void => {
        this.messageInput.getNode().disabled = false;
        this.sendButton.getNode().disabled = false;
    };

    private addPartnerConteiner = (): Component<"div"> => {
        const partnerConteiner = new Component<"div">({
            tag: "div",
            className: "partner-conteiner",
        });
        return partnerConteiner;
    };

    public updatePartnerConteiner = (userData: UserData): void => {
        this.partnerConteiner.getNode().innerHTML = "";
        const partnerName = new Component<"div">({
            tag: "div",
            className: "partner-name",
            text: userData.login,
        });
        const partnerStatus = new Component<"div">({
            tag: "div",
            className: "partner-status",
        });
        if (userData.isLogined === true) {
            partnerStatus.setTextContent("online");
            partnerStatus.addClass("online");
        } else {
            partnerStatus.addClass("offline");
            partnerStatus.setTextContent("offline");
        }
        this.partnerConteiner.appendChildren([partnerName, partnerStatus]);
    };

    public drawUsers = (
        usersData: Array<UserData>,
        isActive: boolean
    ): void => {
        if (isActive === true) {
            this.usersConteiner.destroyChildren();
        }
        const myData = getLoginData();
        const myName = myData?.userName;
        usersData.forEach((user) => {
            if (user.login !== myName) {
                this.drawUser(user);
            }
        });
    };

    private drawUser = (userData: UserData): void => {
        const userView = new Component<"div">({
            tag: "div",
            className: "user",
            id: userData.login,
        });
        const name = new Component<"div">({
            tag: "div",
            className: "user-name",
            text: userData.login,
        });
        const status = new Component<"div">({
            tag: "div",
            className: "user-status",
        });

        this.userToStatusMap.set(userData.login, status);
        if (userData.isLogined === false) {
            status.addClass("offline");
        } else {
            status.addClass("online");
        }
        userView.appendChildren([name, status]);
        userView.addListener("click", (e) => {
            const userBlock = e.target;
            if (userBlock instanceof HTMLElement) {
                const userName = userBlock.id;
                eventBus.emit("partnerChanged", userName);
            }
        });
        this.usersConteiner.append(userView);
    };

    public cleanUsersBlock = (): void => {
        this.usersConteiner.destroyChildren();
    };

    public drawMessage = (messageData: MessageData): void => {
        const messageDiv = new Component<"div">({
            tag: "div",
            className: "message-div",
        });
        const myData = getLoginData();
        const messageTopDiv = this.drawTopDiv(messageData);
        const messageBlock = new Component<"div">({
            tag: "div",
            className: "message-block",
            text: messageData.text,
        });
        const messageBottomDiv = this.drawBottomDiv(messageData);
        if (myData?.userName === messageData.from) {
            messageDiv.addClass("my-message");
            messageDiv.append(this.drawMessameTools(messageData));
            messageDiv.addListener("contextmenu", (event: Event) => {
                event.preventDefault();
                this.messageListener(event);
            });
        } else {
            messageDiv.addClass("others-message");
            if (this.isUnreaden(messageData)) {
                const allUnread = document.querySelectorAll(".unread");
                if (allUnread.length === 0) {
                    const newLineDiv = this.addNewMessagesLine();
                    this.messangesConteiner.append(newLineDiv);
                    messageDiv.addClass("unread");
                }
            }
        }
        this.currentMessagesDivMap.set(messageData.id, messageDiv);
        messageDiv.appendChildren([
            messageTopDiv,
            messageBlock,
            messageBottomDiv,
        ]);
        this.messangesConteiner.append(messageDiv);
    };

    private isUnreaden = (messageData: MessageData): boolean => {
        let result = false;
        if (
            messageData.status.isReaded === false &&
            messageData.status.isDelivered === true
        ) {
            result = true;
        }
        return result;
    };

    private addNewMessagesLine = (): Component<"div"> => {
        const newMessagesLine = new Component<"div">({
            tag: "div",
            className: "new-messages-line",
            text: "new-messages",
        });
        return newMessagesLine;
    };

    private messageListener = (event: Event): void => {
        const messageDiv = event.target;
        if (isHTMLElement(messageDiv)) {
            const toolsDiv = messageDiv.querySelector(".message-tools");
            if (isHTMLElement(toolsDiv)) {
                toolsDiv.classList.add("message-tools_oppened");
                const handleClick = (clickEvent: Event): void => {
                    if (clickEvent.target !== toolsDiv) {
                        toolsDiv.classList.toggle("message-tools_oppened");
                        document.removeEventListener("click", handleClick);
                    }
                };
                document.addEventListener("click", handleClick);
            }
        }
    };

    private drawMessameTools = (messageData: MessageData): Component<"div"> => {
        const toolsDiv = new Component<"div">({
            tag: "div",
            className: "message-tools",
        });
        const editTool = new Component<"div">({
            tag: "div",
            className: "edit-tool",
            text: "edit",
        });
        editTool.addListener("click", () => {
            const messageDiv = editTool.getNode().closest(".message-div");
            if (messageDiv) {
                const message = messageDiv.querySelector(".message-block");
                if (isHTMLElement(message) && message.textContent) {
                    this.messageInput.getNode().value = message.textContent;
                    eventBus.emit("setEditingMode", {
                        id: messageData.id,
                        isEditingMode: true,
                    });
                }
            }
        });
        const deleteTool = new Component<"div">({
            tag: "div",
            className: "delete-tool",
            text: "delete",
        });
        deleteTool.addListener("click", () => {
            api.deleteMessage(messageData.id);
        });
        toolsDiv.appendChildren([editTool, deleteTool]);
        return toolsDiv;
    };

    private drawTopDiv = (messageData: MessageData): Component<"div"> => {
        const messageTopDiv = new Component<"div">({
            tag: "div",
            className: "top-div",
        });
        const myData = getLoginData();
        let myName = messageData.from;
        if (myData?.userName === messageData.from) {
            myName = "You";
        }
        const sender = new Component<"div">({
            tag: "div",
            className: "sender",
            text: myName,
        });
        const time = new Component<"div">({
            tag: "div",
            className: "sender",
            text: getTimeFromUnix(messageData.datetime),
        });
        messageTopDiv.appendChildren([sender, time]);
        return messageTopDiv;
    };

    private drawBottomDiv = (messageData: MessageData): Component<"div"> => {
        const messageBottomDiv = new Component<"div">({
            tag: "div",
            className: "bottom-div",
        });
        let editedText = "";
        if (messageData.status.isEdited === true) {
            editedText = "Edited";
        }
        const edited = new Component<"div">({
            tag: "div",
            className: "edited-div",
            text: editedText,
        });
        let interactionStatusText = "";
        const myData = getLoginData();
        const myName = myData?.userName;
        if (myName === messageData.from) {
            if (
                messageData.status.isReaded === false &&
                messageData.status.isDelivered === true
            ) {
                interactionStatusText = "Delivered";
            } else if (messageData.status.isReaded === true) {
                interactionStatusText = "Read";
            }
        }
        const interactionStatus = new Component<"div">({
            tag: "div",
            className: "delivered-read-div",
            text: interactionStatusText,
        });
        messageBottomDiv.appendChildren([edited, interactionStatus]);
        return messageBottomDiv;
    };

    public cleanMessagesConteiner = (): void => {
        this.messangesConteiner.getNode().innerHTML = "";
    };

    private addFooter = (): Component<"section"> => {
        const chatFooter = new Component<"section">({
            tag: "section",
            className: "chat-footer",
        });
        const RSSchool = new Component<"a">({
            tag: "a",
            className: "footer-link",
            text: "RSSchool",
        });
        const schoolLogo = new Component<"div">({
            tag: "div",
            className: "school-logo",
        });
        RSSchool.append(schoolLogo);
        RSSchool.setInputAttributes({
            href: "https://rs.school/",
            target: "_blank",
        });
        const studentGit = new Component<"a">({
            tag: "a",
            className: "footer-link",
            text: "@Maksim99745",
        });
        studentGit.setInputAttributes({
            href: "https://github.com/Maksim99745?tab=repositories",
            target: "_blank",
        });
        const year = new Component<"div">({
            tag: "div",
            className: "footer-year",
            text: "2024",
        });
        chatFooter.appendChildren([RSSchool, studentGit, year]);
        return chatFooter;
    };

    public getMessage = (): string => {
        const message = this.messageInput.getNode().value;
        this.messageInput.getNode().value = "";
        return message;
    };

    public scrollMessages = (): void => {
        eventBus.emit("autoScroll", true);
        this.messangesConteiner.getNode().scrollTop =
            this.messangesConteiner.getNode().scrollHeight;
        setTimeout(() => {
            eventBus.emit("autoScroll", false);
        }, 1000);
    };

    private handleUserStatusChange = (): void => {
        eventBus.on("userStatusChanged", (uzer) => {
            const status = this.userToStatusMap.get(uzer.login);
            if (status) {
                if (uzer.isLogined === false) {
                    status.addClass("offline");
                    status.removeClass("online");
                } else if (uzer.isLogined === true) {
                    status.removeClass("offline");
                    status.addClass("online");
                }
            }
        });
    };

    private handleNewMessageFromUser = (): void => {
        eventBus.on("newMessageFromUser", (uzerData) => {
            const status = this.userToStatusMap.get(uzerData.login);
            if (status && isNotNullable(uzerData.newMessages)) {
                if (uzerData.newMessages > 0) {
                    status.getNode().textContent = String(uzerData.newMessages);
                } else {
                    status.getNode().textContent = "";
                }
            }
        });
    };

    private handlePartnerChange = (): void => {
        eventBus.on("partnerChanged", (userName) => {
            const status = this.userToStatusMap.get(userName);
            if (status) {
                status.getNode().textContent = "";
            }
        });
    };

    private handleMessageDeliveryChange = (): void => {
        eventBus.on("deliveryStatusChanged", (messageData: MessageData) => {
            if (messageData.status.isReaded === false) {
                const deliveredMessageDiv = this.currentMessagesDivMap.get(
                    messageData.id
                );
                if (deliveredMessageDiv) {
                    const deliveredDiv = deliveredMessageDiv
                        .getNode()
                        .querySelector(".delivered-read-div");
                    if (deliveredDiv) {
                        deliveredDiv.textContent = "Delivered";
                    }
                }
                this.scrollMessages();
            }
        });
    };

    private handleMessageReadChange = (): void => {
        eventBus.on("readStatusChanged", (messageData: MessageData) => {
            const myData = getLoginData();
            const myName = myData?.userName;
            if (myName === messageData.from) {
                const deliveredMessageDiv = this.currentMessagesDivMap.get(
                    messageData.id
                );
                if (deliveredMessageDiv) {
                    const deliveredDiv = deliveredMessageDiv
                        .getNode()
                        .querySelector(".delivered-read-div");
                    if (deliveredDiv) {
                        deliveredDiv.textContent = "Read";
                    }
                }
                this.scrollMessages();
            }
        });
    };

    public removeNewMessagesLine = (messageData: MessageData): void => {
        const unreadMessageDiv = this.currentMessagesDivMap.get(messageData.id);
        const newLine = document.querySelector(".new-messages-line");
        if (isHTMLElement(newLine)) {
            this.messangesConteiner.getNode().removeChild(newLine);
        }
        if (unreadMessageDiv) {
            if (unreadMessageDiv.getNode().classList.contains("unread")) {
                unreadMessageDiv.getNode().classList.remove("unread");
            }
        }
    };

    private handleEditeStatusChange = (): void => {
        eventBus.on("editStatusChanged", (editedData: MessageData) => {
            const editingMessage = this.currentMessagesDivMap.get(
                editedData.id
            );
            if (editingMessage) {
                const editStatus = editingMessage
                    .getNode()
                    .querySelector(".edited-div");
                if (isHTMLElement(editStatus)) {
                    editStatus.textContent = "Edited";
                }
            }
        });
    };

    private handleTeextChange = (): void => {
        eventBus.on("textChanged", (editedData: MessageData) => {
            const editingMessage = this.currentMessagesDivMap.get(
                editedData.id
            );
            if (editingMessage) {
                const textContentDiv = editingMessage
                    .getNode()
                    .querySelector(".message-block");
                if (isHTMLElement(textContentDiv)) {
                    textContentDiv.textContent = editedData.text;
                    console.log(textContentDiv);
                }
            }
        });
    };
}
