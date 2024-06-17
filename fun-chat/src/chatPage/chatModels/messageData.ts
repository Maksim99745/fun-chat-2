import { eventBus } from "../../utilities/eventBus";
import { MessageData, MessageStatus } from "../../utilities/types";

export class MessageDataModel implements MessageData {
    public id: string;
    public from: string;
    public to: string;
    public text: string;
    public datetime: number;
    public status: MessageStatus;

    public static create = (messageData: MessageData): MessageDataModel => {
        return new MessageDataModel(messageData);
    };

    constructor(messageData: MessageData) {
        this.id = messageData.id;
        this.from = messageData.from;
        this.to = messageData.to;
        this.text = messageData.text;
        this.datetime = messageData.datetime;
        this.status = messageData.status;
    }

    public get isDelivered(): boolean {
        return this.status.isDelivered;
    }

    public set isDelivered(newStatus: boolean) {
        if (newStatus !== this.status.isDelivered) {
            this.status.isDelivered = newStatus;
            eventBus.emit("deliveryStatusChanged", this);
        }
    }

    public get isReaded(): boolean {
        return this.status.isReaded;
    }

    public set isReaded(newStatus: boolean) {
        if (newStatus !== this.status.isReaded) {
            this.status.isReaded = newStatus;
            eventBus.emit("readStatusChanged", this);
        }
    }

    public get isEdited(): boolean {
        return this.status.isEdited;
    }

    public set isEdited(newStatus: boolean) {
        if (newStatus !== this.status.isEdited) {
            this.status.isEdited = newStatus;
            eventBus.emit("editStatusChanged", this);
        }
    }

    public get newText(): string {
        return this.text;
    }

    public set newText(newText: string) {
        if (newText !== this.text) {
            this.text = newText;
            eventBus.emit("textChanged", this);
        }
    }
}
