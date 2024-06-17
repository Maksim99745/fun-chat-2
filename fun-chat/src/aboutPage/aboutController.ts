import { Component } from "../components/baseComponents";
import { PersistanceService } from "../utilities/persistance";
import { AboutView } from "./aboutView";

export class AboutConroller {
    private aboutPageView: AboutView;
    private backButton: Component<"button">;
    private persistanceService: PersistanceService;

    constructor(aboutPageView: AboutView) {
        this.aboutPageView = aboutPageView;
        this.backButton = aboutPageView.backButton;
        this.persistanceService = new PersistanceService();
    }

    public drawAboutView = (): void => {
        this.aboutPageView.draw();
        this.backButton.addListener("click", this.backButtonListener);
    };

    public backButtonListener = (): void => {
        this.aboutPageView.destroy();

        if (this.persistanceService.load()) {
            window.location.hash = "#Chat";
        } else {
            window.location.hash = "#Login";
        }
    };
}
