import { Attributes, BaseComponent } from "../utilities/types";

export type HTMLElementTag = keyof HTMLElementTagNameMap;

export class Component<Tag extends HTMLElementTag> {
    private children: Component<HTMLElementTag>[] = [];

    private nodeElement: HTMLElementTagNameMap[Tag];

    constructor(
        { tag = "div", className = "", text = "", id }: BaseComponent,
        ...children: Component<HTMLElementTag>[]
    ) {
        const node = document.createElement(tag) as HTMLElementTagNameMap[Tag];
        if (id) {
            node.id = id;
        }
        node.className = className;
        node.textContent = text;
        this.nodeElement = node;

        if (children && children.length > 0) {
            this.appendChildren(children);
        }
    }

    public append<Child extends Component<HTMLElementTag>>(
        child: Child
    ): Child {
        this.children.push(child);
        const childNode = child.getNode();
        if (childNode) {
            this.nodeElement?.appendChild(childNode);
        }
        return child;
    }

    public appendChildren(children: Component<HTMLElementTag>[]): typeof this {
        children.forEach((element) => {
            this.append(element);
        });
        return this;
    }

    public get style(): CSSStyleDeclaration {
        return this.nodeElement.style;
    }

    public getNode(): HTMLElementTagNameMap[Tag] {
        return this.nodeElement;
    }

    public addClass(className: string): void {
        this.nodeElement.classList.add(className);
    }

    public removeClass(className: string): void {
        this.nodeElement.classList.remove(className);
    }

    public getChildren(): Component<HTMLElementTag>[] {
        return this.children;
    }

    public setTextContent(content: string): void {
        this.nodeElement.textContent = content;
    }

    public setAttribute(attribute: string, value: string): typeof this {
        this.nodeElement.setAttribute(attribute, value);
        return this;
    }

    public setInputAttributes(props: Attributes): typeof this {
        const propsArr = Object.entries(props);
        for (let i = 0; i < propsArr.length; i += 1) {
            this.nodeElement.setAttribute(propsArr[i][0], propsArr[i][1]);
        }
        return this;
    }

    public get childrenCount(): number {
        return this.nodeElement.childNodes.length;
    }

    public removeAttribute(attribute: string): void {
        this.nodeElement.removeAttribute(attribute);
    }

    public toggleClass(className: string): void {
        this.nodeElement.classList.toggle(className);
    }

    public addListener(event: string, listener: EventListener): void {
        this.nodeElement.addEventListener(event, listener);
    }

    public destroyChildren(): typeof this {
        this.children.forEach((child) => {
            child.destroy();
        });
        this.children.length = 0;
        return this;
    }

    public destroy(): void {
        this.destroyChildren();
        this.nodeElement.remove();
    }
}
