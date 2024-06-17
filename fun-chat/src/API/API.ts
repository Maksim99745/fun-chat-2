import { eventBus } from "../utilities/eventBus";
import { getLoginData } from "../utilities/sessionStorageTools";
import { LoginData } from "../utilities/types";

export class API {
    public socket = new WebSocket("ws://localhost:4000");
    private isSocketReady = false;
    private messagesFirstArr: Array<string> = [
        "USER_LOGIN",
        "USER_LOGOUT",
        "USER_EXTERNAL_LOGIN",
        "USER_EXTERNAL_LOGOUT",
        "USER_ACTIVE",
        "USER_INACTIVE",
        "MSG_SEND",
        "MSG_FROM_USER",
        "MSG_DELIVER",
        "ERROR",
    ];
    constructor() {
        this.addListeners();
    }

    private addListeners = (): void => {
        this.socket.onopen = (): void => {
            this.isSocketReady = true;
            console.log("Соединение установлено");
        };
        this.socket.onerror = (error): void => {
            console.log("Ошибка:", error);
        };
        this.socket.onmessage = (event: MessageEvent): void => {
            const response = JSON.parse(event.data);
            if (this.messagesFirstArr.includes(response.type)) {
                this.messageHandledOne(event);
            } else {
                this.messageHandledTwo(event);
            }
        };
        this.socket.onclose = (): void => {
            eventBus.emit(
                "showError",
                "We are doing our best to reconnect to the server and you will be notified of success, please wait."
            );
            const reconnectInterval = setInterval(() => {
                console.log("reconnect attemp");
                const newSocket = new WebSocket("ws://localhost:4000");
                newSocket.onopen = (): void => {
                    this.socket = newSocket;
                    this.addListeners();
                    const loginData = getLoginData();
                    if (loginData) {
                        this.authentication(loginData);
                    }
                    eventBus.emit(
                        "showReconnectionResult",
                        "Connection successfully restored!"
                    );
                    clearInterval(reconnectInterval);
                };
            }, 5000);
        };
    };

    private waitForSocket = (): Promise<void> => {
        return new Promise<void>((resolve) => {
            const checkSocket = (): void => {
                if (this.isSocketReady) {
                    resolve();
                } else {
                    setInterval(checkSocket, 100);
                }
            };
            checkSocket();
        });
    };

    public authentication = (loginData: LoginData): void => {
        const request = {
            id: "1",
            type: "USER_LOGIN",
            payload: {
                user: {
                    login: loginData.userName,
                    password: loginData.password,
                },
            },
        };
        if (this.isSocketReady === false) {
            this.waitForSocket().then(() => {
                this.socket.send(JSON.stringify(request));
            });
        } else {
            this.socket.send(JSON.stringify(request));
        }
    };

    public loginOut = (loginData: LoginData): void => {
        const request = {
            id: "2",
            type: "USER_LOGOUT",
            payload: {
                user: {
                    login: loginData.userName,
                    password: loginData.password,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    public getActiveUsers = (): void => {
        const request = {
            id: "3",
            type: "USER_ACTIVE",
            payload: null,
        };
        if (this.isSocketReady === false) {
            this.waitForSocket().then(() => {
                this.socket.send(JSON.stringify(request));
            });
        } else {
            this.socket.send(JSON.stringify(request));
        }
    };

    public getInactiveUsers = (): void => {
        const request = {
            id: "4",
            type: "USER_INACTIVE",
            payload: null,
        };
        if (this.isSocketReady === false) {
            this.waitForSocket().then(() => {
                this.socket.send(JSON.stringify(request));
            });
        } else {
            this.socket.send(JSON.stringify(request));
        }
    };

    public sendMessage = (user: string, message: string): void => {
        const request = {
            id: "5",
            type: "MSG_SEND",
            payload: {
                message: {
                    to: user,
                    text: message,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    public fetchMessagesWithUser = (user: string): void => {
        const request = {
            id: "6",
            type: "MSG_FROM_USER",
            payload: {
                user: {
                    login: user,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    public readMessage = (messageId: string): void => {
        const request = {
            id: "7",
            type: "MSG_READ",
            payload: {
                message: {
                    id: messageId,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    public deleteMessage = (messageId: string): void => {
        const request = {
            id: "8",
            type: "MSG_DELETE",
            payload: {
                message: {
                    id: messageId,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    public editMessage = (messageId: string, newText: string): void => {
        const request = {
            id: "9",
            type: "MSG_EDIT",
            payload: {
                message: {
                    id: messageId,
                    text: newText,
                },
            },
        };
        this.socket.send(JSON.stringify(request));
    };

    private messageHandledOne = (event: MessageEvent): void => {
        const response = JSON.parse(event.data);
        switch (response.type) {
            case "USER_LOGIN":
                eventBus.emit("authorizetionSuccess", response.payload.user);
                break;
            case "USER_LOGOUT":
                console.log(response);
                break;
            case "USER_EXTERNAL_LOGIN":
                eventBus.emit("userStatusChanged", response.payload.user);
                break;
            case "USER_EXTERNAL_LOGOUT":
                eventBus.emit("userStatusChanged", response.payload.user);
                break;
            case "USER_ACTIVE":
                eventBus.emit("activeUsers", response.payload.users);
                break;
            case "USER_INACTIVE":
                eventBus.emit("inactiveUsers", response.payload.users);
                break;
            case "MSG_SEND":
                eventBus.emit("messageSended", response.payload.message);
                break;
            case "MSG_FROM_USER":
                eventBus.emit("messagesFetched", response.payload.messages);
                break;
            case "MSG_DELIVER":
                eventBus.emit("messagesDelivered", response.payload.message);
                break;
            case "ERROR":
                console.log(response.payload.error);
                eventBus.emit("showError", response.payload.error);
                break;
            default:
                console.log(response.type);
        }
    };
    private messageHandledTwo = (event: MessageEvent): void => {
        const response = JSON.parse(event.data);
        switch (response.type) {
            case "MSG_READ":
                eventBus.emit("messageRead", response.payload.message);
                break;
            case "MSG_DELETE":
                eventBus.emit("messageDeleted", response.payload.message);
                break;
            case "MSG_EDIT":
                eventBus.emit(
                    "messageEditedOnServer",
                    response.payload.message
                );
                break;
            default:
                console.log(response.type);
        }
    };
}

export const api = new API();
