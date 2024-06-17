import { api } from "../API/API";
import { eventBus } from "../utilities/eventBus";
import { setLoginData } from "../utilities/sessionStorageTools";
import { LoginData } from "../utilities/types";
import { LoginInputModel } from "./loginPageModels/loginInputModel";
import { SubmitButtonModal } from "./loginPageModels/submitButtonModel";
import { LoginView } from "./loginView/loginView";

export class LoginPageConroller {
    private loginView: LoginView;
    private nameInputModel: LoginInputModel;
    private passwordInputModel: LoginInputModel;
    private submitButtonModel: SubmitButtonModal;
    private attempLoginData: LoginData = { userName: "", password: "" };

    constructor(loginView: LoginView) {
        this.loginView = loginView;
        this.nameInputModel = new LoginInputModel();
        this.passwordInputModel = new LoginInputModel();
        this.submitButtonModel = new SubmitButtonModal();
    }

    public drawLoginView = (): void => {
        this.loginView.getNode().innerHTML = "";
        this.loginView.draw();
        this.loginView.nameInput.addListener("input", this.nameInputListener);
        this.loginView.passwordInput.addListener(
            "input",
            this.passwordInputListener
        );
        this.loginView.submitButton.addListener(
            "click",
            this.submitButtonListener
        );
        this.loginView.aboutButton.addListener("click", this.goToAboutPage);
        eventBus.on("authorizetionSuccess", () => {
            setLoginData(this.attempLoginData);
            this.attempLoginData.userName = "";
            this.attempLoginData.password = "";
            this.goToChatPage();
        });
    };

    private nameInputListener = (): void => {
        const nameInputValue = this.loginView.getNameValue();
        this.nameInputModel.value = nameInputValue;
        this.validateName();
        this.loginView.showNameAnnotation(this.nameInputModel.isValidated);
        this.validateSumbitButton();
        this.loginView.toggleSubmitButton(this.submitButtonModel.isDisabled);
    };

    private passwordInputListener = (): void => {
        const passwordInputValue = this.loginView.getPasswordValue();
        this.passwordInputModel.value = passwordInputValue;
        this.validatePassword();
        this.loginView.showPasswordAnnotation(
            this.passwordInputModel.isValidated
        );
        this.validateSumbitButton();
        this.loginView.toggleSubmitButton(this.submitButtonModel.isDisabled);
    };

    private submitButtonListener = (e: Event): void => {
        e.preventDefault();
        const userName = this.nameInputModel.value;
        const loginData: LoginData = {
            userName,
            password: this.passwordInputModel.value,
        };
        this.attempLoginData.userName = userName;
        this.attempLoginData.password = this.passwordInputModel.value;
        api.authentication(loginData);
    };

    private goToChatPage = (): void => {
        this.loginView.destroy();
        window.location.hash = "#Chat";
    };

    public validateName = (): void => {
        if (this.nameInputModel.value) {
            const firstLetter = this.nameInputModel.value[0];
            const name = this.nameInputModel.value;
            if (
                firstLetter === firstLetter.toUpperCase() &&
                name.length <= 20
            ) {
                this.nameInputModel.isValidated = true;
            } else {
                this.nameInputModel.isValidated = false;
            }
        } else {
            this.nameInputModel.isValidated = false;
        }
    };

    public validatePassword = (): void => {
        const password = this.passwordInputModel.value;
        if (password.length >= 6) {
            this.passwordInputModel.isValidated = true;
        } else {
            this.passwordInputModel.isValidated = false;
        }
    };

    public validateSumbitButton = (): void => {
        const nameResult = this.nameInputModel.isValidated;
        const passwordResult = this.passwordInputModel.isValidated;
        if (nameResult === true && passwordResult === true) {
            this.submitButtonModel.isDisabled = false;
        } else {
            this.submitButtonModel.isDisabled = true;
        }
    };

    private goToAboutPage = (): void => {
        this.loginView.destroy();
        window.location.hash = "#About";
    };
}
