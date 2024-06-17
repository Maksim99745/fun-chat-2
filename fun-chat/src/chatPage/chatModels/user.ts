import { eventBus } from "../../utilities/eventBus";
import { UserData } from "../../utilities/types";

export class User implements UserData {
    public login: string = "";
    private loginStatus: boolean = false;
    public newMessagesAmount: number = 0;

    public static create = (login: string, loginStatus: boolean): User => {
        return new User(login, loginStatus);
    };

    constructor(login: string, loginStatus: boolean) {
        this.login = login;
        this.loginStatus = loginStatus;
    }

    public get isLogined(): boolean {
        return this.loginStatus;
    }

    public set isLogined(value: boolean) {
        if (value !== this.loginStatus) {
            this.loginStatus = value;
            eventBus.emit("userStatusChanged", this);
        }
    }

    public get newMessages(): number {
        return this.newMessagesAmount;
    }

    public set newMessages(count: number) {
        this.newMessagesAmount = count;
        eventBus.emit("newMessageFromUser", this);
    }
    // extends eventEmitter - там во вьюхе будет брать с его своего on
}
