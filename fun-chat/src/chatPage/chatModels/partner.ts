import { eventBus } from "../../utilities/eventBus";
import { UserData } from "../../utilities/types";

export class ParnterModel implements UserData {
    public login: string = "";
    public isLogined: boolean = false;

    constructor(login: string, isLogined: boolean) {
        this.login = login;
        this.isLogined = isLogined;
    }

    public setNewData(newLogin: string, newStatus: boolean): void {
        if (newLogin !== this.login) {
            this.login = newLogin;
            this.isLogined = newStatus;
            eventBus.emit("parnetnerUpdate", this);
        } else if (newLogin === this.login && newStatus !== this.isLogined) {
            this.isLogined = newStatus;
            eventBus.emit("parnetnerUpdate", this);
        }
    }
}
