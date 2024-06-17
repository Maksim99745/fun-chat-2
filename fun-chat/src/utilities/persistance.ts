import { isNotNullable } from "./common";

export class PersistanceService {
    public load(): boolean {
        const userData = sessionStorage.getItem("fun-chat");
        if (isNotNullable(userData)) {
            return true;
        }
        return false;
    }
}
