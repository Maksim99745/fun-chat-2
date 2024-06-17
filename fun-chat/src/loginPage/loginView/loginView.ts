import { Component } from "../../components/baseComponents";

export class LoginView extends Component<"div"> {
    public nameInput: Component<"input">;
    public passwordInput: Component<"input">;
    public submitButton: Component<"input">;
    public aboutButton: Component<"div">;
    private nameValidationBlock: Component<"div">;
    private passwordValidationBlock: Component<"div">;
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        super({ tag: "div", className: "login-page" });
        this.parent = parent;
        const nameInput = new Component<"input">({
            tag: "input",
            className: "login_name",
        });
        nameInput.setInputAttributes({
            type: "text",
            placeholder: "Name",
        });
        this.nameInput = nameInput;
        const passwordInput = new Component<"input">({
            tag: "input",
            className: "login_password",
        });
        passwordInput.setInputAttributes({
            type: "text",
            placeholder: "password",
        });
        this.passwordInput = passwordInput;
        const submitButton = new Component<"input">({
            tag: "button",
            className: "login-button",
            text: "Submit",
        });
        submitButton.setAttribute("disabled", "");
        submitButton.addClass("button-element");
        this.submitButton = submitButton;
        this.aboutButton = this.addAboutButton();
        const nameValidatinBlock = this.addValidationBLock(
            "Name should be capitalized and not longer than 20 simbols"
        );
        this.nameValidationBlock = nameValidatinBlock;
        const passwordValidatinBlock = this.addValidationBLock(
            "Password should contains at least 6 simbols"
        );
        this.passwordValidationBlock = passwordValidatinBlock;
    }

    public draw(): void {
        this.getNode().innerHTML = "";
        const form = this.addForm();
        this.append(form);
        const nodeElement = this.getNode();
        this.parent.appendChild(nodeElement);
    }

    public addForm(): Component<"div"> {
        const loginDiv = new Component<"div">({
            tag: "div",
            className: "login-div",
        });
        const greeting = new Component<"div">({
            tag: "div",
            className: "login-greeting",
            text: "Login in",
        });
        const form = new Component<"form">({
            tag: "form",
            className: "login-form",
        });
        form.setAttribute("action", "");
        const inputs = this.addInputs();
        form.appendChildren([
            greeting,
            ...inputs,
            this.submitButton,
            this.aboutButton,
        ]);
        loginDiv.append(form);
        return loginDiv;
    }

    private addInputs(): Array<Component<"input"> | Component<"div">> {
        return [
            this.nameValidationBlock,
            this.nameInput,
            this.passwordValidationBlock,
            this.passwordInput,
        ];
    }

    private addValidationBLock(message: string): Component<"div"> {
        const validationBlock = new Component<"div">({
            tag: "div",
            className: "login_validation-block",
            text: message,
        });
        return validationBlock;
    }

    private addAboutButton(): Component<"div"> {
        const aboutButton = new Component<"div">({
            tag: "div",
            className: "login_about-button",
            text: "About",
        });
        aboutButton.getNode().classList.add("button-element");
        return aboutButton;
    }

    public toggleSubmitButton(isDisabled: boolean): void {
        this.submitButton.getNode().disabled = isDisabled;
    }

    public showNameAnnotation(isValidated: boolean): void {
        if (isValidated === false) {
            this.nameValidationBlock.style.opacity = "1";
        } else {
            this.nameValidationBlock.style.opacity = "0";
        }
    }

    public showPasswordAnnotation(isValidated: boolean): void {
        if (isValidated === false) {
            this.passwordValidationBlock.style.opacity = "1";
        } else {
            this.passwordValidationBlock.style.opacity = "0";
        }
    }

    public getNameValue(): string {
        const { value } = this.nameInput.getNode();
        return value;
    }

    public getPasswordValue(): string {
        const { value } = this.passwordInput.getNode();
        return value;
    }
}
