export interface BaseComponent {
    tag: string;
    className?: string;
    text?: string;
    id?: string;
}

export type Attributes = {
    type?: string;
    id?: string;
    name?: string;
    pattern?: string;
    title?: string;
    required?: string;
    minlength?: string;
    placeholder?: string;
    href?: string;
    target?: string;
    disabled?: string;
};

export interface LoginData {
    userName: string;
    password: string;
}

export interface CustomHashChangeEvent extends Event {
    newURL: string;
}

export interface AutorizetionRight {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

export interface AutorizetionError {
    id: string;
    type: "ERROR";
    payload: {
        error: string;
    };
}

export interface UserData {
    login: string;
    isLogined: boolean;
    newMessages?: number;
    setNewAmount?: (newAmount: number) => void;
}

export interface UsersList {
    users: Array<UserData>;
}

export interface AuthenticationError {
    error: string;
}

export interface MessageStatus {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
}
export interface MessageData {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: MessageStatus;
}

export interface NewDeliveredMessage {
    id: string;
    status: {
        isDelivered: boolean;
    };
}

export interface ReadNotification {
    id: string;
    status: {
        isReaded: boolean;
    };
}

export interface DeletedMessage {
    id: string;
    status: {
        isDeleted: boolean;
    };
}

export interface MessageForEditing {
    id: string;
    isEditingMode: boolean;
}

export interface EditedMessage {
    id: string;
    text: string;
    status: {
        isEdited: boolean;
    };
}
