import { api } from "./API/API";
import { AboutConroller } from "./aboutPage/aboutController";
import { AboutView } from "./aboutPage/aboutView";
import { ChatController } from "./chatPage/chatController";
import { ChatView } from "./chatPage/chatView";
import { Component } from "./components/baseComponents";
import { ErorrModal } from "./components/errorModal";
import "./global.css";
import { LoginPageConroller } from "./loginPage/loginPageController";
import { LoginView } from "./loginPage/loginView/loginView";
import { HashRouter } from "./router/router";
import { eventBus } from "./utilities/eventBus";
import { PersistanceService } from "./utilities/persistance";
import { getLoginData } from "./utilities/sessionStorageTools";
import { CustomHashChangeEvent } from "./utilities/types";

const { body } = document;

const errorModal = new ErorrModal(body);
errorModal.draw();

eventBus.on("showError", (message: string) => {
    errorModal.showError(message);
});

const persistanceService = new PersistanceService();

const main = new Component<"main">({ tag: "main" });
const mainNode = main.getNode();
body.appendChild(mainNode);

const loginView = new LoginView(mainNode);
const loginPageConroller = new LoginPageConroller(loginView);
eventBus.on("goToLogin", () => {
    if (!persistanceService.load()) {
        loginPageConroller.drawLoginView();
    } else {
        window.location.hash = "#Chat";
    }
});

const aboutPageView = new AboutView(mainNode);
const aboutPageConroller = new AboutConroller(aboutPageView);
eventBus.on("goToAbout", () => {
    aboutPageConroller.drawAboutView();
});

const chatPageView = new ChatView(mainNode);
const chatPageController = new ChatController(chatPageView);

eventBus.on("goToChat", () => {
    if (persistanceService.load()) {
        chatPageController.drawChatView();
    } else {
        window.location.hash = "#Login";
    }
});

const router = new HashRouter(mainNode);

window.addEventListener("hashchange", (e: CustomHashChangeEvent) => {
    router.handleHashChange(e);
});

// artificial changing of the hash for trigger router in case that hash remain the same
window.location.hash = "#RefreshIt";
if (persistanceService.load()) {
    const loginData = getLoginData();
    if (loginData) {
        api.authentication(loginData);
        window.location.hash = "#Chat";
    }
} else {
    window.location.hash = "#Login";
}
