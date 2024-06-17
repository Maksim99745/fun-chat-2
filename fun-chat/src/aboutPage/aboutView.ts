import { Component } from "../components/baseComponents";

export class AboutView extends Component<"div"> {
    public backButton: Component<"button">;
    private parent: HTMLElement;
    private gitHubLink = `<a target="_blank" href ="https://github.com/Maksim99745" class="about-link">@Maksim99745</a>`;
    private aboutText: string = `This application created by ${this.gitHubLink} in order to learn more about interaction with WebSocket API and MVC pattern`;

    constructor(parent: HTMLElement) {
        super({ tag: "div", className: "about-page" });
        this.parent = parent;
        const backButton = new Component<"button">({
            tag: "button",
            className: "about_back-button",
            text: "Back",
        });
        backButton.setAttribute("type", "submit");
        backButton.getNode().classList.add("button-element");
        this.backButton = backButton;
    }

    public draw(): void {
        this.getNode().innerHTML = "";
        const aboutDiv = this.addInformationBlock();
        this.append(aboutDiv);
        const nodeElement = this.getNode();
        this.parent.appendChild(nodeElement);
    }

    private addInformationBlock(): Component<"div"> {
        const aboutDiv = new Component<"div">({
            tag: "div",
            className: "about-div",
        });
        const header = new Component<"div">({
            tag: "div",
            className: "about-header",
            text: "Fun-chat by Maksim",
        });
        const information = new Component<"div">({
            tag: "div",
            className: "about-information",
        });
        information.getNode().innerHTML = this.aboutText;
        aboutDiv.appendChildren([header, information, this.backButton]);
        return aboutDiv;
    }
}
