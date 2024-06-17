// type Listener<T> = (data: T) => void;
import { isSomeFunction } from "./common";
import {
    UserData,
    MessageData,
    NewDeliveredMessage,
    ReadNotification,
    DeletedMessage,
    EditedMessage,
    MessageForEditing,
} from "./types";

// export class EventBus<T, D> {
//     private listeners: { [key: string]: Listener<T>[] } = {};

//     subscribe(eventType: string, listener: Listener<T>): void {
//         if (!this.listeners[eventType]) {
//             this.listeners[eventType] = [];
//         }
//         this.listeners[eventType].push(listener);
//     }

//     emit(eventType: string, data: T): void {
//         const eventListeners = this.listeners[eventType];
//         if (eventListeners) {
//             eventListeners.forEach((listener) => listener(data));
//         }
//     }
// }

// export const eventBus = new EventBus<string>();

export type EventMap = Record<string, unknown>;
export type EventKey<Events extends EventMap> = string & keyof Events;
export type EventListener<Event> = (event: Event) => void;

export interface Emitter<Events extends EventMap> {
    on: <Event extends EventKey<Events>>(
        eventName: Event,
        fn: EventListener<Events[Event]>
    ) => void;
    off: <Event extends EventKey<Events>>(
        eventName: Event,
        fn: EventListener<Events[Event]>
    ) => void;
    emit: <Event extends EventKey<Events>>(
        eventName: Event,
        params: Events[Event]
    ) => void;
}

export class EventEmitter<T extends EventMap> implements Emitter<T> {
    private listeners: {
        [K in keyof EventMap]?: Array<(p: EventMap[K]) => void>;
    } = {};

    public on = <K extends EventKey<T>>(
        eventName: K,
        callback: EventListener<T[K]>
    ): void => {
        if (
            typeof eventName === "string" &&
            isSomeFunction<(p: EventMap[K]) => void>(callback)
        ) {
            this.subscribe<K, (p: EventMap[K]) => void>(eventName, callback);
        }
    };

    private subscribe = <
        K extends EventKey<T>,
        C extends (p: EventMap[K]) => void,
    >(
        eventName: K,
        callback: C
    ): void => {
        this.listeners[eventName] = (this.listeners[eventName] ?? []).concat(
            callback
        );
    };

    public off = <K extends EventKey<T>>(
        eventName: K,
        callback: EventListener<T[K]>
    ): void => {
        if (typeof eventName === "string" && isSomeFunction(callback)) {
            this.listeners[eventName] = (
                this.listeners[eventName] ?? []
            ).filter((f) => f !== callback);
        }
    };

    public emit = <K extends EventKey<T>>(eventName: K, data: T[K]): void => {
        (this.listeners[eventName] ?? []).forEach((fn) => {
            fn(data);
        });
    };

    public hasListener = <K extends EventKey<T>>(eventName: K): boolean => {
        return !!this.listeners[eventName];
    };

    public destroy = (): void => {
        this.listeners = {};
    };
}

type EventBusEvents = {
    goToLogin: string;
    goToAbout: string;
    goToChat: string;
    userStatusChanged: UserData;
    authorizetionSuccess: UserData;
    activeUsers: Array<UserData>;
    inactiveUsers: Array<UserData>;
    updateUser: UserData;
    showError: string;
    partnerChanged: string;
    parnetnerUpdate: UserData;
    messageSended: MessageData;
    deliveryStatusChanged: MessageData;
    newMessageFromUser: UserData;
    messagesFetched: Array<MessageData>;
    messagesDelivered: NewDeliveredMessage;
    readStatusChanged: MessageData;
    messageRead: ReadNotification;
    autoScroll: boolean;
    messageDeleted: DeletedMessage;
    setEditingMode: MessageForEditing;
    messageEditedOnServer: EditedMessage;
    editStatusChanged: MessageData;
    textChanged: MessageData;
    showReconnectionResult: string;
};

export const eventBus = new EventEmitter<EventBusEvents>();
