import { isNotNullable } from "./common";
import { LoginData } from "./types";

export const getLoginData = (): LoginData | null => {
    let loginData: LoginData | null = null;
    const sessionStorageJSON = sessionStorage.getItem("fun-chat");
    if (isNotNullable(sessionStorageJSON)) {
        const sessionStorageData = JSON.parse(sessionStorageJSON);
        loginData = sessionStorageData;
    }
    return loginData;
};

export const setLoginData = (loginData: LoginData): void => {
    const currentLoginData = getLoginData();
    if (!currentLoginData) {
        sessionStorage.setItem("fun-chat", JSON.stringify(loginData));
    }
};

export const deleteUserFromSessionStorage = (): void => {
    sessionStorage.removeItem("fun-chat");
};
