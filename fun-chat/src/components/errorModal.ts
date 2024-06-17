import { eventBus } from "../utilities/eventBus";
import { Component } from "./baseComponents";

export class ErorrModal extends Component<"div"> {
    private messagePlace: Component<"div">;
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        super({ tag: "div", className: "error-modal" });
        const messagePlace = new Component<"div">({
            tag: "div",
            className: "error-modal__message",
        });
        this.messagePlace = messagePlace;
        this.append(this.messagePlace);
        this.parent = parent;
        eventBus.on("showReconnectionResult", (result: string) => {
            this.showError(result);
        });
    }

    public draw(): void {
        this.parent.append(this.getNode());
    }

    private setErrorMessage = (message: string): void => {
        this.messagePlace.setTextContent(message);
    };

    public showError = (message: string): void => {
        this.addClass("error-modal_visible");
        this.setErrorMessage(message);
        this.addListener("click", this.closeModal);
    };

    public closeModal = (): void => {
        this.getNode().classList.remove("error-modal_visible");
        this.messagePlace.getNode().textContent = "";
    };
}
