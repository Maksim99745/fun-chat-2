import { eventBus } from "../utilities/eventBus";
import { CustomHashChangeEvent } from "../utilities/types";

interface PossibleRoutes {
    [key: string]: () => void;
}

export class HashRouter {
    public possibleRoutes: PossibleRoutes;
    private mainNode: HTMLElement;

    constructor(mainNode: HTMLElement) {
        this.possibleRoutes = {
            Login: (): void => eventBus.emit("goToLogin", "draw"),
            About: (): void => eventBus.emit("goToAbout", "draw"),
            Chat: (): void => eventBus.emit("goToChat", "draw"),
        };
        this.mainNode = mainNode;
    }

    public handleHashChange(e: CustomHashChangeEvent): void | boolean {
        e.preventDefault();
        const { newURL } = e;
        const pathKey = newURL.split("#")[1];
        if (pathKey in this.possibleRoutes) {
            this.mainNode.innerHTML = "";
            return this.possibleRoutes[pathKey]();
        }
        if (pathKey === "RefreshIt") {
            // handle page refresh with the same hash
            return true;
        }
        return console.log("No route found for:", pathKey);
    }
}
