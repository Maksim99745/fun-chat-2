(function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const n of document.querySelectorAll('link[rel="modulepreload"]'))
        s(n);
    new MutationObserver((n) => {
        for (const a of n)
            if (a.type === "childList")
                for (const l of a.addedNodes)
                    l.tagName === "LINK" && l.rel === "modulepreload" && s(l);
    }).observe(document, { childList: !0, subtree: !0 });
    function e(n) {
        const a = {};
        return (
            n.integrity && (a.integrity = n.integrity),
            n.referrerPolicy && (a.referrerPolicy = n.referrerPolicy),
            n.crossOrigin === "use-credentials"
                ? (a.credentials = "include")
                : n.crossOrigin === "anonymous"
                  ? (a.credentials = "omit")
                  : (a.credentials = "same-origin"),
            a
        );
    }
    function s(n) {
        if (n.ep) return;
        n.ep = !0;
        const a = e(n);
        fetch(n.href, a);
    }
})();
(function () {
    const i = document.createElement("link").relList;
    if (i && i.supports && i.supports("modulepreload")) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]'))
        e(s);
    new MutationObserver((s) => {
        for (const n of s)
            if (n.type === "childList")
                for (const a of n.addedNodes)
                    a.tagName === "LINK" && a.rel === "modulepreload" && e(a);
    }).observe(document, { childList: !0, subtree: !0 });
    function t(s) {
        const n = {};
        return (
            s.integrity && (n.integrity = s.integrity),
            s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy),
            s.crossOrigin === "use-credentials"
                ? (n.credentials = "include")
                : s.crossOrigin === "anonymous"
                  ? (n.credentials = "omit")
                  : (n.credentials = "same-origin"),
            n
        );
    }
    function e(s) {
        if (s.ep) return;
        s.ep = !0;
        const n = t(s);
        fetch(s.href, n);
    }
})();
function E(i) {
    return i != null;
}
function f(i) {
    return i == null ? !1 : i instanceof HTMLElement;
}
function H(i) {
    return i != null;
}
function O(i) {
    return H(i) && typeof i == "function";
}
const j = (i) => {
    const t = new Date(i),
        e = [];
    e.push(t.getDate());
    const s = t.getMonth() + 1;
    Number(s) < 10 ? e.push(`0${String(s)}`) : e.push(s), e.push(s);
    const n = `${t.getFullYear()}, `;
    e.push(n);
    const a = e.join("."),
        l = `${`0${t.getHours()}`.slice(-2)}:${`0${t.getMinutes()}`.slice(-2)}:${`0${t.getSeconds()}`.slice(-2)}`;
    return a + l;
};
var J = Object.defineProperty,
    q = (i, t, e) =>
        t in i
            ? J(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    b = (i, t, e) => (q(i, typeof t != "symbol" ? t + "" : t, e), e);
class $ {
    constructor() {
        b(this, "listeners", {}),
            b(this, "on", (t, e) => {
                typeof t == "string" && O(e) && this.subscribe(t, e);
            }),
            b(this, "subscribe", (t, e) => {
                var s;
                this.listeners[t] = (
                    (s = this.listeners[t]) != null ? s : []
                ).concat(e);
            }),
            b(this, "off", (t, e) => {
                var s;
                typeof t == "string" &&
                    O(e) &&
                    (this.listeners[t] = (
                        (s = this.listeners[t]) != null ? s : []
                    ).filter((n) => n !== e));
            }),
            b(this, "emit", (t, e) => {
                var s;
                ((s = this.listeners[t]) != null ? s : []).forEach((n) => {
                    n(e);
                });
            }),
            b(this, "hasListener", (t) => !!this.listeners[t]),
            b(this, "destroy", () => {
                this.listeners = {};
            });
    }
}
const r = new $(),
    w = () => {
        let i = null;
        const t = sessionStorage.getItem("fun-chat");
        return E(t) && (i = JSON.parse(t)), i;
    },
    W = (i) => {
        w() || sessionStorage.setItem("fun-chat", JSON.stringify(i));
    },
    X = () => {
        sessionStorage.removeItem("fun-chat");
    };
var z = Object.defineProperty,
    K = (i, t, e) =>
        t in i
            ? z(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    g = (i, t, e) => (K(i, typeof t != "symbol" ? t + "" : t, e), e);
class Y {
    constructor() {
        g(this, "socket", new WebSocket("ws://localhost:4000")),
            g(this, "isSocketReady", !1),
            g(this, "messagesFirstArr", [
                "USER_LOGIN",
                "USER_LOGOUT",
                "USER_EXTERNAL_LOGIN",
                "USER_EXTERNAL_LOGOUT",
                "USER_ACTIVE",
                "USER_INACTIVE",
                "MSG_SEND",
                "MSG_FROM_USER",
                "MSG_DELIVER",
                "ERROR",
            ]),
            g(this, "addListeners", () => {
                (this.socket.onopen = () => {
                    (this.isSocketReady = !0),
                        console.log("Соединение установлено");
                }),
                    (this.socket.onerror = (t) => {
                        console.log("Ошибка:", t);
                    }),
                    (this.socket.onmessage = (t) => {
                        const e = JSON.parse(t.data);
                        this.messagesFirstArr.includes(e.type)
                            ? this.messageHandledOne(t)
                            : this.messageHandledTwo(t);
                    }),
                    (this.socket.onclose = () => {
                        r.emit(
                            "showError",
                            "We are doing our best to reconnect to the server and you will be notified of success, please wait."
                        );
                        const t = setInterval(() => {
                            console.log("reconnect attemp");
                            const e = new WebSocket("ws://localhost:4000");
                            e.onopen = () => {
                                (this.socket = e), this.addListeners();
                                const s = w();
                                s && this.authentication(s),
                                    r.emit(
                                        "showReconnectionResult",
                                        "Connection successfully restored!"
                                    ),
                                    clearInterval(t);
                            };
                        }, 5e3);
                    });
            }),
            g(
                this,
                "waitForSocket",
                () =>
                    new Promise((t) => {
                        const e = () => {
                            this.isSocketReady ? t() : setInterval(e, 100);
                        };
                        e();
                    })
            ),
            g(this, "authentication", (t) => {
                const e = {
                    id: "1",
                    type: "USER_LOGIN",
                    payload: {
                        user: { login: t.userName, password: t.password },
                    },
                };
                this.isSocketReady === !1
                    ? this.waitForSocket().then(() => {
                          this.socket.send(JSON.stringify(e));
                      })
                    : this.socket.send(JSON.stringify(e));
            }),
            g(this, "loginOut", (t) => {
                const e = {
                    id: "2",
                    type: "USER_LOGOUT",
                    payload: {
                        user: { login: t.userName, password: t.password },
                    },
                };
                this.socket.send(JSON.stringify(e));
            }),
            g(this, "getActiveUsers", () => {
                const t = { id: "3", type: "USER_ACTIVE", payload: null };
                this.isSocketReady === !1
                    ? this.waitForSocket().then(() => {
                          this.socket.send(JSON.stringify(t));
                      })
                    : this.socket.send(JSON.stringify(t));
            }),
            g(this, "getInactiveUsers", () => {
                const t = { id: "4", type: "USER_INACTIVE", payload: null };
                this.isSocketReady === !1
                    ? this.waitForSocket().then(() => {
                          this.socket.send(JSON.stringify(t));
                      })
                    : this.socket.send(JSON.stringify(t));
            }),
            g(this, "sendMessage", (t, e) => {
                const s = {
                    id: "5",
                    type: "MSG_SEND",
                    payload: { message: { to: t, text: e } },
                };
                this.socket.send(JSON.stringify(s));
            }),
            g(this, "fetchMessagesWithUser", (t) => {
                const e = {
                    id: "6",
                    type: "MSG_FROM_USER",
                    payload: { user: { login: t } },
                };
                this.socket.send(JSON.stringify(e));
            }),
            g(this, "readMessage", (t) => {
                const e = {
                    id: "7",
                    type: "MSG_READ",
                    payload: { message: { id: t } },
                };
                this.socket.send(JSON.stringify(e));
            }),
            g(this, "deleteMessage", (t) => {
                const e = {
                    id: "8",
                    type: "MSG_DELETE",
                    payload: { message: { id: t } },
                };
                this.socket.send(JSON.stringify(e));
            }),
            g(this, "editMessage", (t, e) => {
                const s = {
                    id: "9",
                    type: "MSG_EDIT",
                    payload: { message: { id: t, text: e } },
                };
                this.socket.send(JSON.stringify(s));
            }),
            g(this, "messageHandledOne", (t) => {
                const e = JSON.parse(t.data);
                switch (e.type) {
                    case "USER_LOGIN":
                        r.emit("authorizetionSuccess", e.payload.user);
                        break;
                    case "USER_LOGOUT":
                        console.log(e);
                        break;
                    case "USER_EXTERNAL_LOGIN":
                        r.emit("userStatusChanged", e.payload.user);
                        break;
                    case "USER_EXTERNAL_LOGOUT":
                        r.emit("userStatusChanged", e.payload.user);
                        break;
                    case "USER_ACTIVE":
                        r.emit("activeUsers", e.payload.users);
                        break;
                    case "USER_INACTIVE":
                        r.emit("inactiveUsers", e.payload.users);
                        break;
                    case "MSG_SEND":
                        r.emit("messageSended", e.payload.message);
                        break;
                    case "MSG_FROM_USER":
                        r.emit("messagesFetched", e.payload.messages);
                        break;
                    case "MSG_DELIVER":
                        r.emit("messagesDelivered", e.payload.message);
                        break;
                    case "ERROR":
                        console.log(e.payload.error),
                            r.emit("showError", e.payload.error);
                        break;
                    default:
                        console.log(e.type);
                }
            }),
            g(this, "messageHandledTwo", (t) => {
                const e = JSON.parse(t.data);
                switch (e.type) {
                    case "MSG_READ":
                        r.emit("messageRead", e.payload.message);
                        break;
                    case "MSG_DELETE":
                        r.emit("messageDeleted", e.payload.message);
                        break;
                    case "MSG_EDIT":
                        r.emit("messageEditedOnServer", e.payload.message);
                        break;
                    default:
                        console.log(e.type);
                }
            }),
            this.addListeners();
    }
}
const m = new Y();
class _ {
    load() {
        const t = sessionStorage.getItem("fun-chat");
        return !!E(t);
    }
}
var Q = Object.defineProperty,
    Z = (i, t, e) =>
        t in i
            ? Q(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    N = (i, t, e) => (Z(i, typeof t != "symbol" ? t + "" : t, e), e);
class ee {
    constructor(t) {
        N(this, "aboutPageView"),
            N(this, "backButton"),
            N(this, "persistanceService"),
            N(this, "drawAboutView", () => {
                this.aboutPageView.draw(),
                    this.backButton.addListener(
                        "click",
                        this.backButtonListener
                    );
            }),
            N(this, "backButtonListener", () => {
                this.aboutPageView.destroy(),
                    this.persistanceService.load()
                        ? (window.location.hash = "#Chat")
                        : (window.location.hash = "#Login");
            }),
            (this.aboutPageView = t),
            (this.backButton = t.backButton),
            (this.persistanceService = new _());
    }
}
var te = Object.defineProperty,
    se = (i, t, e) =>
        t in i
            ? te(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    R = (i, t, e) => (se(i, typeof t != "symbol" ? t + "" : t, e), e);
class o {
    constructor(
        { tag: t = "div", className: e = "", text: s = "", id: n },
        ...a
    ) {
        R(this, "children", []), R(this, "nodeElement");
        const l = document.createElement(t);
        n && (l.id = n),
            (l.className = e),
            (l.textContent = s),
            (this.nodeElement = l),
            a && a.length > 0 && this.appendChildren(a);
    }
    append(t) {
        var e;
        this.children.push(t);
        const s = t.getNode();
        return s && ((e = this.nodeElement) == null || e.appendChild(s)), t;
    }
    appendChildren(t) {
        return (
            t.forEach((e) => {
                this.append(e);
            }),
            this
        );
    }
    get style() {
        return this.nodeElement.style;
    }
    getNode() {
        return this.nodeElement;
    }
    addClass(t) {
        this.nodeElement.classList.add(t);
    }
    removeClass(t) {
        this.nodeElement.classList.remove(t);
    }
    getChildren() {
        return this.children;
    }
    setTextContent(t) {
        this.nodeElement.textContent = t;
    }
    setAttribute(t, e) {
        return this.nodeElement.setAttribute(t, e), this;
    }
    setInputAttributes(t) {
        const e = Object.entries(t);
        for (let s = 0; s < e.length; s += 1)
            this.nodeElement.setAttribute(e[s][0], e[s][1]);
        return this;
    }
    get childrenCount() {
        return this.nodeElement.childNodes.length;
    }
    removeAttribute(t) {
        this.nodeElement.removeAttribute(t);
    }
    toggleClass(t) {
        this.nodeElement.classList.toggle(t);
    }
    addListener(t, e) {
        this.nodeElement.addEventListener(t, e);
    }
    destroyChildren() {
        return (
            this.children.forEach((t) => {
                t.destroy();
            }),
            (this.children.length = 0),
            this
        );
    }
    destroy() {
        this.destroyChildren(), this.nodeElement.remove();
    }
}
var ie = Object.defineProperty,
    ne = (i, t, e) =>
        t in i
            ? ie(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    S = (i, t, e) => (ne(i, typeof t != "symbol" ? t + "" : t, e), e);
class ae extends o {
    constructor(t) {
        super({ tag: "div", className: "about-page" }),
            S(this, "backButton"),
            S(this, "parent"),
            S(
                this,
                "gitHubLink",
                '<a target="_blank" href ="https://github.com/Maksim99745" class="about-link">@Maksim99745</a>'
            ),
            S(
                this,
                "aboutText",
                `This application created by ${this.gitHubLink} in order to learn more about interaction with WebSocket API and MVC pattern`
            ),
            (this.parent = t);
        const e = new o({
            tag: "button",
            className: "about_back-button",
            text: "Back",
        });
        e.setAttribute("type", "submit"),
            e.getNode().classList.add("button-element"),
            (this.backButton = e);
    }
    draw() {
        this.getNode().innerHTML = "";
        const t = this.addInformationBlock();
        this.append(t);
        const e = this.getNode();
        this.parent.appendChild(e);
    }
    addInformationBlock() {
        const t = new o({ tag: "div", className: "about-div" }),
            e = new o({
                tag: "div",
                className: "about-header",
                text: "Fun-chat by Maksim",
            }),
            s = new o({ tag: "div", className: "about-information" });
        return (
            (s.getNode().innerHTML = this.aboutText),
            t.appendChildren([e, s, this.backButton]),
            t
        );
    }
}
var oe = Object.defineProperty,
    re = (i, t, e) =>
        t in i
            ? oe(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    v = (i, t, e) => (re(i, typeof t != "symbol" ? t + "" : t, e), e);
const k = class {
    constructor(i) {
        v(this, "id"),
            v(this, "from"),
            v(this, "to"),
            v(this, "text"),
            v(this, "datetime"),
            v(this, "status"),
            (this.id = i.id),
            (this.from = i.from),
            (this.to = i.to),
            (this.text = i.text),
            (this.datetime = i.datetime),
            (this.status = i.status);
    }
    get isDelivered() {
        return this.status.isDelivered;
    }
    set isDelivered(i) {
        i !== this.status.isDelivered &&
            ((this.status.isDelivered = i),
            r.emit("deliveryStatusChanged", this));
    }
    get isReaded() {
        return this.status.isReaded;
    }
    set isReaded(i) {
        i !== this.status.isReaded &&
            ((this.status.isReaded = i), r.emit("readStatusChanged", this));
    }
    get isEdited() {
        return this.status.isEdited;
    }
    set isEdited(i) {
        i !== this.status.isEdited &&
            ((this.status.isEdited = i), r.emit("editStatusChanged", this));
    }
    get newText() {
        return this.text;
    }
    set newText(i) {
        i !== this.text && ((this.text = i), r.emit("textChanged", this));
    }
};
v(k, "create", (i) => new k(i));
let x = k;
var de = Object.defineProperty,
    le = (i, t, e) =>
        t in i
            ? de(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    U = (i, t, e) => (le(i, typeof t != "symbol" ? t + "" : t, e), e);
class he {
    constructor(t, e) {
        U(this, "login", ""),
            U(this, "isLogined", !1),
            (this.login = t),
            (this.isLogined = e);
    }
    setNewData(t, e) {
        t !== this.login
            ? ((this.login = t),
              (this.isLogined = e),
              r.emit("parnetnerUpdate", this))
            : t === this.login &&
              e !== this.isLogined &&
              ((this.isLogined = e), r.emit("parnetnerUpdate", this));
    }
}
var ce = Object.defineProperty,
    ue = (i, t, e) =>
        t in i
            ? ce(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    L = (i, t, e) => (ue(i, typeof t != "symbol" ? t + "" : t, e), e);
const I = class {
    constructor(i, t) {
        L(this, "login", ""),
            L(this, "loginStatus", !1),
            L(this, "newMessagesAmount", 0),
            (this.login = i),
            (this.loginStatus = t);
    }
    get isLogined() {
        return this.loginStatus;
    }
    set isLogined(i) {
        i !== this.loginStatus &&
            ((this.loginStatus = i), r.emit("userStatusChanged", this));
    }
    get newMessages() {
        return this.newMessagesAmount;
    }
    set newMessages(i) {
        (this.newMessagesAmount = i), r.emit("newMessageFromUser", this);
    }
};
L(I, "create", (i, t) => new I(i, t));
let A = I;
var ge = Object.defineProperty,
    pe = (i, t, e) =>
        t in i
            ? ge(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    h = (i, t, e) => (pe(i, typeof t != "symbol" ? t + "" : t, e), e);
class me {
    constructor(t) {
        h(this, "chatView"),
            h(this, "sortOrder", ""),
            h(this, "userModels", new Map()),
            h(this, "currentMessagesModels", new Map()),
            h(this, "partnerModel"),
            h(this, "isAutoScroll", !1),
            h(this, "isEditingMode", !1),
            h(this, "currentEditingMessageId", ""),
            h(this, "drawChatView", () => {
                this.chatView.draw(),
                    this.chatView.aboutButton.addListener(
                        "click",
                        this.aboutButtonListener
                    ),
                    this.chatView.loginOutButton.addListener(
                        "click",
                        this.loginOutListener
                    ),
                    this.chatView.sendButton
                        .getNode()
                        .addEventListener("click", (e) => {
                            e.preventDefault(), this.sendMessage();
                        }),
                    this.chatView.sortInput.addListener(
                        "input",
                        this.sortInputlistener
                    ),
                    this.updateUsersBlock();
            }),
            h(this, "aboutButtonListener", () => {
                this.chatView.destroy(), (window.location.hash = "#About");
            }),
            h(this, "loginOutListener", () => {
                const e = w();
                E(e) &&
                    (m.loginOut(e),
                    (this.chatView.parent.innerHTML = ""),
                    this.chatView.destroy(),
                    (this.chatView.getNode().innerHTML = ""),
                    X(),
                    (this.partnerModel.login = ""),
                    (window.location.hash = "#Login"));
            }),
            h(this, "sortInputlistener", () => {
                const e = this.chatView.getSortInputValue();
                (this.sortOrder = e), this.updateUsersBlock();
            }),
            h(this, "updateUsersBlock", () => {
                this.chatView.cleanUsersBlock(),
                    m.getActiveUsers(),
                    m.getInactiveUsers(),
                    this.userModels.forEach((e) => {
                        const s = w(),
                            n = s == null ? void 0 : s.userName;
                        e.login !== n && m.fetchMessagesWithUser(e.login),
                            r.on("messagesFetched", (a) => {
                                const l = [...a].filter(
                                        (u) => u.status.isReaded === !1
                                    ),
                                    c = this.userModels.get(a[0].from);
                                c &&
                                    typeof c.newMessages == "number" &&
                                    (c.newMessages = l.length);
                            });
                    });
            }),
            h(this, "addActiveUsers", (e, s) => {
                const n = w(),
                    a = n == null ? void 0 : n.userName,
                    l = [...e].filter((u) => u.login.includes(s)),
                    c = [];
                [...l].forEach((u) => {
                    const B = new A(u.login, u.isLogined);
                    this.userModels.set(u.login, B), c.push(B);
                }),
                    this.chatView.drawUsers(
                        c.concat().filter((u) => u.login !== a),
                        !0
                    );
            }),
            h(this, "addInactiveUsers", (e, s) => {
                const n = [...e].filter((l) => l.login.includes(s)),
                    a = [];
                [...n].forEach((l) => {
                    const c = new A(l.login, l.isLogined);
                    this.userModels.set(l.login, c), a.push(c);
                }),
                    this.chatView.drawUsers(a, !1);
            }),
            h(this, "handelUserStatusChanges", () => {
                r.on("userStatusChanged", (e) => {
                    const s = this.userModels.get(e.login);
                    s ? (s.isLogined = e.isLogined) : this.updateUsersBlock(),
                        this.partnerModel.login === e.login &&
                            this.partnerModel.setNewData(e.login, e.isLogined);
                });
            }),
            h(this, "handelMessageDelivered", () => {
                r.on("messagesDelivered", (e) => {
                    const s = this.currentMessagesModels.get(e.id);
                    s && (s.isDelivered = !0);
                });
            }),
            h(this, "handleMessageRead", () => {
                r.on("messageRead", (e) => {
                    const s = this.currentMessagesModels.get(e.id);
                    s && (s.isReaded = !0);
                });
            }),
            h(this, "handlePartnerChanges", () => {
                r.on("partnerChanged", (e) => {
                    (this.chatView.messageInput.getNode().value = ""),
                        this.chatView.cleanMessagesConteiner();
                    const s = this.userModels.get(e);
                    s &&
                        ((s.newMessages = 0),
                        this.partnerModel.setNewData(e, s.isLogined),
                        this.currentMessagesModels.clear(),
                        this.chatView.unblockMessangerAbility(),
                        m.fetchMessagesWithUser(this.partnerModel.login));
                }),
                    r.on("parnetnerUpdate", (e) => {
                        this.chatView.updatePartnerConteiner(e);
                    });
            }),
            h(this, "handleMessageSending", () => {
                r.on("messageSended", (e) => {
                    if (e.from !== this.partnerModel.login) {
                        const n = this.userModels.get(e.from);
                        n &&
                            typeof n.newMessages == "number" &&
                            (n.newMessages += 1);
                    }
                    const s = new x(e);
                    this.isCurrentPartner(e) &&
                        (this.currentMessagesModels.set(s.id, s),
                        this.chatView.drawMessage(e)),
                        this.chatView.scrollMessages();
                });
            }),
            h(this, "handleMessagesFetch", () => {
                r.on("messagesFetched", (e) => {
                    if (this.partnerModel.login !== "") {
                        e.forEach((n) => {
                            const a = new x(n);
                            this.currentMessagesModels.set(a.id, a),
                                this.chatView.drawMessage(n);
                        });
                        const s = this.userModels.get(e[0].from);
                        s &&
                            typeof s.newMessages == "number" &&
                            (s.newMessages = 0),
                            this.chatView.scrollMessages();
                    }
                });
            }),
            h(this, "handleMessageDelete", () => {
                r.on("messageDeleted", (e) => {
                    this.currentMessagesModels.get(e.id)
                        ? (console.log("delete"),
                          this.currentMessagesModels.delete(e.id))
                        : this.updateUsersBlock();
                    const s = this.chatView.currentMessagesDivMap.get(e.id);
                    s &&
                        (s.destroy(),
                        this.chatView.currentMessagesDivMap.delete(e.id));
                });
            }),
            h(this, "setMessagesReadListeners", () => {
                this.chatView.messangesConteiner.addListener(
                    "click",
                    this.readMessages
                ),
                    this.chatView.messangesConteiner.addListener(
                        "scroll",
                        this.readMessages
                    );
            }),
            h(this, "readMessages", () => {
                this.isAutoScroll === !1 &&
                    this.currentMessagesModels.forEach((e) => {
                        e.from === this.partnerModel.login &&
                            e.status.isReaded === !1 &&
                            (this.chatView.removeNewMessagesLine(e),
                            m.readMessage(e.id));
                    });
            }),
            h(this, "handleAutoScroll", () => {
                r.on("autoScroll", (e) => {
                    this.isAutoScroll = e;
                });
            }),
            h(this, "handleMessageEditingData", () => {
                r.on("setEditingMode", (e) => {
                    (this.isEditingMode = e.isEditingMode),
                        (this.currentEditingMessageId = e.id);
                });
            }),
            h(this, "handleMessageEditing", () => {
                r.on("messageEditedOnServer", (e) => {
                    const s = this.currentMessagesModels.get(e.id);
                    s &&
                        ((s.isEdited = e.status.isEdited),
                        (s.newText = e.text));
                });
            }),
            h(this, "sendMessage", () => {
                const e = this.chatView.getMessage();
                e.trim() !== "" &&
                    (this.isEditingMode === !1
                        ? (m.sendMessage(this.partnerModel.login, e),
                          this.readMessages())
                        : (m.editMessage(this.currentEditingMessageId, e),
                          (this.isEditingMode = !1),
                          (this.currentEditingMessageId = "")));
            }),
            (this.chatView = t),
            r.on("activeUsers", (e) => {
                this.addActiveUsers(e, this.sortOrder);
            }),
            r.on("inactiveUsers", (e) => {
                this.addInactiveUsers(e, this.sortOrder);
            }),
            (this.partnerModel = new he("", !1)),
            this.handelUserStatusChanges(),
            this.handlePartnerChanges(),
            this.handleMessageSending(),
            this.handleMessagesFetch(),
            this.handelMessageDelivered(),
            this.handleMessageRead(),
            this.setMessagesReadListeners(),
            this.handleAutoScroll(),
            this.handleMessageDelete(),
            this.handleMessageEditingData(),
            this.handleMessageEditing();
    }
    isCurrentPartner(t) {
        return (
            this.partnerModel.login === t.from ||
            this.partnerModel.login === t.to
        );
    }
}
var we = Object.defineProperty,
    be = (i, t, e) =>
        t in i
            ? we(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    d = (i, t, e) => (be(i, typeof t != "symbol" ? t + "" : t, e), e);
class Me extends o {
    constructor(t) {
        super({ tag: "div", className: "chat-page" }),
            d(this, "parent"),
            d(this, "aboutButton"),
            d(this, "loginOutButton"),
            d(this, "sortInput"),
            d(this, "usersConteiner"),
            d(this, "partnerConteiner"),
            d(this, "messangesConteiner"),
            d(this, "messageInput"),
            d(this, "sendButton"),
            d(this, "userToStatusMap", new Map()),
            d(this, "currentMessagesDivMap", new Map()),
            d(this, "addHeader", () => {
                const e = new o({ tag: "section", className: "chat-header" }),
                    s = w(),
                    n = s ? s.userName : "Guest",
                    a = new o({
                        tag: "div",
                        className: "user-name",
                        text: `User: ${n}`,
                    }),
                    l = new o({
                        tag: "div",
                        className: "app-name",
                        text: "Fun-chat",
                    }),
                    c = new o({ tag: "div", className: "header-buttons" });
                return (
                    c.appendChildren([this.aboutButton, this.loginOutButton]),
                    e.appendChildren([a, l, c]),
                    e
                );
            }),
            d(this, "addMain", () => {
                const e = new o({ tag: "section", className: "chat-main" });
                return (
                    e.appendChildren([
                        this.addUsersConteiner(),
                        this.addMessangerSide(),
                    ]),
                    e
                );
            }),
            d(this, "addUsersConteiner", () => {
                const e = new o({ tag: "div", className: "users-side" });
                return (
                    e.appendChildren([this.sortInput, this.usersConteiner]), e
                );
            }),
            d(
                this,
                "addUserConteiner",
                () => new o({ tag: "div", className: "users-conteiner" })
            ),
            d(this, "addSortInput", () => {
                const e = new o({ tag: "input", className: "sort-input" });
                return (
                    e.setInputAttributes({
                        type: "text",
                        placeholder: "Search...",
                    }),
                    e
                );
            }),
            d(this, "getSortInputValue", () => {
                const { value: e } = this.sortInput.getNode();
                return e;
            }),
            d(this, "addMessangerSide", () => {
                const e = new o({ tag: "div", className: "messanger-side" }),
                    s = new o({
                        tag: "div",
                        className: "messange-conteiner__initial-text",
                        text: "Choose user in order to send message...",
                    });
                return (
                    this.messangesConteiner.append(s),
                    e.appendChildren([
                        this.partnerConteiner,
                        this.messangesConteiner,
                        this.addMessangeInputBLock(),
                    ]),
                    e
                );
            }),
            d(
                this,
                "addMessangeConteiner",
                () => new o({ tag: "div", className: "messange-conteiner" })
            ),
            d(this, "addMessangeInputBLock", () => {
                const e = new o({
                    tag: "form",
                    className: "messange-input-block",
                });
                return (
                    e.appendChildren([this.messageInput, this.sendButton]), e
                );
            }),
            d(this, "addMessageInput", () => {
                const e = new o({ tag: "input", className: "message-input" });
                return (
                    e.setInputAttributes({
                        type: "text",
                        placeholder: "Message...",
                        disabled: "",
                    }),
                    e
                );
            }),
            d(this, "addSendButton", () => {
                const e = new o({
                    tag: "button",
                    className: "button-element",
                    text: "Send",
                });
                return (
                    e.addClass("send-button"),
                    e.setAttribute("disabled", ""),
                    e.setAttribute("type", "submit"),
                    e
                );
            }),
            d(this, "unblockMessangerAbility", () => {
                (this.messageInput.getNode().disabled = !1),
                    (this.sendButton.getNode().disabled = !1);
            }),
            d(
                this,
                "addPartnerConteiner",
                () => new o({ tag: "div", className: "partner-conteiner" })
            ),
            d(this, "updatePartnerConteiner", (e) => {
                this.partnerConteiner.getNode().innerHTML = "";
                const s = new o({
                        tag: "div",
                        className: "partner-name",
                        text: e.login,
                    }),
                    n = new o({ tag: "div", className: "partner-status" });
                e.isLogined === !0
                    ? (n.setTextContent("online"), n.addClass("online"))
                    : (n.addClass("offline"), n.setTextContent("offline")),
                    this.partnerConteiner.appendChildren([s, n]);
            }),
            d(this, "drawUsers", (e, s) => {
                s === !0 && this.usersConteiner.destroyChildren();
                const n = w(),
                    a = n == null ? void 0 : n.userName;
                e.forEach((l) => {
                    l.login !== a && this.drawUser(l);
                });
            }),
            d(this, "drawUser", (e) => {
                const s = new o({ tag: "div", className: "user", id: e.login }),
                    n = new o({
                        tag: "div",
                        className: "user-name",
                        text: e.login,
                    }),
                    a = new o({ tag: "div", className: "user-status" });
                this.userToStatusMap.set(e.login, a),
                    e.isLogined === !1
                        ? a.addClass("offline")
                        : a.addClass("online"),
                    s.appendChildren([n, a]),
                    s.addListener("click", (l) => {
                        const c = l.target;
                        if (c instanceof HTMLElement) {
                            const u = c.id;
                            r.emit("partnerChanged", u);
                        }
                    }),
                    this.usersConteiner.append(s);
            }),
            d(this, "cleanUsersBlock", () => {
                this.usersConteiner.destroyChildren();
            }),
            d(this, "drawMessage", (e) => {
                const s = new o({ tag: "div", className: "message-div" }),
                    n = w(),
                    a = this.drawTopDiv(e),
                    l = new o({
                        tag: "div",
                        className: "message-block",
                        text: e.text,
                    }),
                    c = this.drawBottomDiv(e);
                if ((n == null ? void 0 : n.userName) === e.from)
                    s.addClass("my-message"),
                        s.append(this.drawMessameTools(e)),
                        s.addListener("contextmenu", (u) => {
                            u.preventDefault(), this.messageListener(u);
                        });
                else if (
                    (s.addClass("others-message"),
                    this.isUnreaden(e) &&
                        document.querySelectorAll(".unread").length === 0)
                ) {
                    const u = this.addNewMessagesLine();
                    this.messangesConteiner.append(u), s.addClass("unread");
                }
                this.currentMessagesDivMap.set(e.id, s),
                    s.appendChildren([a, l, c]),
                    this.messangesConteiner.append(s);
            }),
            d(this, "isUnreaden", (e) => {
                let s = !1;
                return (
                    e.status.isReaded === !1 &&
                        e.status.isDelivered === !0 &&
                        (s = !0),
                    s
                );
            }),
            d(
                this,
                "addNewMessagesLine",
                () =>
                    new o({
                        tag: "div",
                        className: "new-messages-line",
                        text: "new-messages",
                    })
            ),
            d(this, "messageListener", (e) => {
                const s = e.target;
                if (f(s)) {
                    const n = s.querySelector(".message-tools");
                    if (f(n)) {
                        n.classList.add("message-tools_oppened");
                        const a = (l) => {
                            l.target !== n &&
                                (n.classList.toggle("message-tools_oppened"),
                                document.removeEventListener("click", a));
                        };
                        document.addEventListener("click", a);
                    }
                }
            }),
            d(this, "drawMessameTools", (e) => {
                const s = new o({ tag: "div", className: "message-tools" }),
                    n = new o({
                        tag: "div",
                        className: "edit-tool",
                        text: "edit",
                    });
                n.addListener("click", () => {
                    const l = n.getNode().closest(".message-div");
                    if (l) {
                        const c = l.querySelector(".message-block");
                        f(c) &&
                            c.textContent &&
                            ((this.messageInput.getNode().value =
                                c.textContent),
                            r.emit("setEditingMode", {
                                id: e.id,
                                isEditingMode: !0,
                            }));
                    }
                });
                const a = new o({
                    tag: "div",
                    className: "delete-tool",
                    text: "delete",
                });
                return (
                    a.addListener("click", () => {
                        m.deleteMessage(e.id);
                    }),
                    s.appendChildren([n, a]),
                    s
                );
            }),
            d(this, "drawTopDiv", (e) => {
                const s = new o({ tag: "div", className: "top-div" }),
                    n = w();
                let a = n == null ? void 0 : n.userName;
                a === e.from && (a = "You");
                const l = new o({ tag: "div", className: "sender", text: a }),
                    c = new o({
                        tag: "div",
                        className: "sender",
                        text: j(e.datetime),
                    });
                return s.appendChildren([l, c]), s;
            }),
            d(this, "drawBottomDiv", (e) => {
                const s = new o({ tag: "div", className: "bottom-div" });
                let n = "";
                e.status.isEdited === !0 && (n = "Edited");
                const a = new o({
                    tag: "div",
                    className: "edited-div",
                    text: n,
                });
                let l = "";
                const c = w();
                (c == null ? void 0 : c.userName) === e.from &&
                    (e.status.isReaded === !1 && e.status.isDelivered === !0
                        ? (l = "Delivered")
                        : e.status.isReaded === !0 && (l = "Read"));
                const u = new o({
                    tag: "div",
                    className: "delivered-read-div",
                    text: l,
                });
                return s.appendChildren([a, u]), s;
            }),
            d(this, "cleanMessagesConteiner", () => {
                this.messangesConteiner.getNode().innerHTML = "";
            }),
            d(this, "addFooter", () => {
                const e = new o({ tag: "section", className: "chat-footer" }),
                    s = new o({
                        tag: "a",
                        className: "footer-link",
                        text: "RSSchool",
                    }),
                    n = new o({ tag: "div", className: "school-logo" });
                s.append(n),
                    s.setInputAttributes({
                        href: "https://rs.school/",
                        target: "_blank",
                    });
                const a = new o({
                    tag: "a",
                    className: "footer-link",
                    text: "@Maksim99745",
                });
                a.setInputAttributes({
                    href: "https://github.com/Maksim99745?tab=repositories",
                    target: "_blank",
                });
                const l = new o({
                    tag: "div",
                    className: "footer-year",
                    text: "2024",
                });
                return e.appendChildren([s, a, l]), e;
            }),
            d(this, "getMessage", () => {
                const e = this.messageInput.getNode().value;
                return (this.messageInput.getNode().value = ""), e;
            }),
            d(this, "scrollMessages", () => {
                r.emit("autoScroll", !0),
                    (this.messangesConteiner.getNode().scrollTop =
                        this.messangesConteiner.getNode().scrollHeight),
                    setTimeout(() => {
                        r.emit("autoScroll", !1);
                    }, 1e3);
            }),
            d(this, "handleUserStatusChange", () => {
                r.on("userStatusChanged", (e) => {
                    const s = this.userToStatusMap.get(e.login);
                    s &&
                        (e.isLogined === !1
                            ? (s.addClass("offline"), s.removeClass("online"))
                            : e.isLogined === !0 &&
                              (s.removeClass("offline"), s.addClass("online")));
                });
            }),
            d(this, "handleNewMessageFromUser", () => {
                r.on("newMessageFromUser", (e) => {
                    const s = this.userToStatusMap.get(e.login);
                    s &&
                        E(e.newMessages) &&
                        (e.newMessages > 0
                            ? (s.getNode().textContent = String(e.newMessages))
                            : (s.getNode().textContent = ""));
                });
            }),
            d(this, "handlePartnerChange", () => {
                r.on("partnerChanged", (e) => {
                    const s = this.userToStatusMap.get(e);
                    s && (s.getNode().textContent = "");
                });
            }),
            d(this, "handleMessageDeliveryChange", () => {
                r.on("deliveryStatusChanged", (e) => {
                    if (e.status.isReaded === !1) {
                        const s = this.currentMessagesDivMap.get(e.id);
                        if (s) {
                            const n = s
                                .getNode()
                                .querySelector(".delivered-read-div");
                            n && (n.textContent = "Delivered");
                        }
                        this.scrollMessages();
                    }
                });
            }),
            d(this, "handleMessageReadChange", () => {
                r.on("readStatusChanged", (e) => {
                    const s = w();
                    if ((s == null ? void 0 : s.userName) === e.from) {
                        const n = this.currentMessagesDivMap.get(e.id);
                        if (n) {
                            const a = n
                                .getNode()
                                .querySelector(".delivered-read-div");
                            a && (a.textContent = "Read");
                        }
                        this.scrollMessages();
                    }
                });
            }),
            d(this, "removeNewMessagesLine", (e) => {
                const s = this.currentMessagesDivMap.get(e.id),
                    n = document.querySelector(".new-messages-line");
                f(n) && this.messangesConteiner.getNode().removeChild(n),
                    s &&
                        s.getNode().classList.contains("unread") &&
                        s.getNode().classList.remove("unread");
            }),
            d(this, "handleEditeStatusChange", () => {
                r.on("editStatusChanged", (e) => {
                    const s = this.currentMessagesDivMap.get(e.id);
                    if (s) {
                        const n = s.getNode().querySelector(".edited-div");
                        f(n) && (n.textContent = "Edited");
                    }
                });
            }),
            d(this, "handleTeextChange", () => {
                r.on("textChanged", (e) => {
                    const s = this.currentMessagesDivMap.get(e.id);
                    if (s) {
                        const n = s.getNode().querySelector(".message-block");
                        f(n) && ((n.textContent = e.text), console.log(n));
                    }
                });
            }),
            (this.parent = t),
            (this.aboutButton = this.addAboutButton()),
            (this.loginOutButton = this.addLogitOutButton()),
            (this.sortInput = this.addSortInput()),
            (this.usersConteiner = this.addUserConteiner()),
            (this.partnerConteiner = this.addPartnerConteiner()),
            (this.messangesConteiner = this.addMessangeConteiner()),
            (this.messageInput = this.addMessageInput()),
            (this.sendButton = this.addSendButton()),
            this.handleUserStatusChange(),
            this.handleNewMessageFromUser(),
            this.handlePartnerChange(),
            this.handleMessageDeliveryChange(),
            this.handleMessageReadChange(),
            this.handleEditeStatusChange(),
            this.handleTeextChange();
    }
    draw() {
        (this.parent.innerHTML = ""),
            (this.getNode().innerHTML = ""),
            this.appendChildren([
                this.addHeader(),
                this.addMain(),
                this.addFooter(),
            ]);
        const t = this.getNode();
        this.parent.appendChild(t);
    }
    addAboutButton() {
        const t = new o({
            tag: "div",
            className: "chat_about-button",
            text: "About",
        });
        return t.getNode().classList.add("button-element"), t;
    }
    addLogitOutButton() {
        const t = new o({
            tag: "div",
            className: "login-out-button",
            text: "Login out",
        });
        return t.getNode().classList.add("button-element"), t;
    }
}
var ve = Object.defineProperty,
    fe = (i, t, e) =>
        t in i
            ? ve(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    y = (i, t, e) => (fe(i, typeof t != "symbol" ? t + "" : t, e), e);
class Ne extends o {
    constructor(t) {
        super({ tag: "div", className: "error-modal" }),
            y(this, "messagePlace"),
            y(this, "parent"),
            y(this, "setErrorMessage", (s) => {
                this.messagePlace.setTextContent(s);
            }),
            y(this, "showError", (s) => {
                this.addClass("error-modal_visible"),
                    this.setErrorMessage(s),
                    this.addListener("click", this.closeModal);
            }),
            y(this, "closeModal", () => {
                this.getNode().classList.remove("error-modal_visible"),
                    (this.messagePlace.getNode().textContent = "");
            });
        const e = new o({ tag: "div", className: "error-modal__message" });
        (this.messagePlace = e),
            this.append(this.messagePlace),
            (this.parent = t),
            r.on("showReconnectionResult", (s) => {
                this.showError(s);
            });
    }
    draw() {
        this.parent.append(this.getNode());
    }
}
var ye = Object.defineProperty,
    Ce = (i, t, e) =>
        t in i
            ? ye(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    T = (i, t, e) => (Ce(i, typeof t != "symbol" ? t + "" : t, e), e);
class D {
    constructor() {
        T(this, "value", ""), T(this, "isValidated", !1);
    }
}
var Se = Object.defineProperty,
    Le = (i, t, e) =>
        t in i
            ? Se(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    Ee = (i, t, e) => (Le(i, typeof t != "symbol" ? t + "" : t, e), e);
class ke {
    constructor() {
        Ee(this, "isDisabled", !0);
    }
}
var Ie = Object.defineProperty,
    Ve = (i, t, e) =>
        t in i
            ? Ie(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    p = (i, t, e) => (Ve(i, typeof t != "symbol" ? t + "" : t, e), e);
class Be {
    constructor(t) {
        p(this, "loginView"),
            p(this, "nameInputModel"),
            p(this, "passwordInputModel"),
            p(this, "submitButtonModel"),
            p(this, "attempLoginData", { userName: "", password: "" }),
            p(this, "drawLoginView", () => {
                (this.loginView.getNode().innerHTML = ""),
                    this.loginView.draw(),
                    this.loginView.nameInput.addListener(
                        "input",
                        this.nameInputListener
                    ),
                    this.loginView.passwordInput.addListener(
                        "input",
                        this.passwordInputListener
                    ),
                    this.loginView.submitButton.addListener(
                        "click",
                        this.submitButtonListener
                    ),
                    this.loginView.aboutButton.addListener(
                        "click",
                        this.goToAboutPage
                    ),
                    r.on("authorizetionSuccess", () => {
                        W(this.attempLoginData),
                            (this.attempLoginData.userName = ""),
                            (this.attempLoginData.password = ""),
                            this.goToChatPage();
                    });
            }),
            p(this, "nameInputListener", () => {
                const e = this.loginView.getNameValue();
                (this.nameInputModel.value = e),
                    this.validateName(),
                    this.loginView.showNameAnnotation(
                        this.nameInputModel.isValidated
                    ),
                    this.validateSumbitButton(),
                    this.loginView.toggleSubmitButton(
                        this.submitButtonModel.isDisabled
                    );
            }),
            p(this, "passwordInputListener", () => {
                const e = this.loginView.getPasswordValue();
                (this.passwordInputModel.value = e),
                    this.validatePassword(),
                    this.loginView.showPasswordAnnotation(
                        this.passwordInputModel.isValidated
                    ),
                    this.validateSumbitButton(),
                    this.loginView.toggleSubmitButton(
                        this.submitButtonModel.isDisabled
                    );
            }),
            p(this, "submitButtonListener", (e) => {
                e.preventDefault();
                const s = this.nameInputModel.value,
                    n = {
                        userName: s,
                        password: this.passwordInputModel.value,
                    };
                (this.attempLoginData.userName = s),
                    (this.attempLoginData.password =
                        this.passwordInputModel.value),
                    m.authentication(n);
            }),
            p(this, "goToChatPage", () => {
                this.loginView.destroy(), (window.location.hash = "#Chat");
            }),
            p(this, "validateName", () => {
                if (this.nameInputModel.value) {
                    const e = this.nameInputModel.value[0];
                    e === e.toUpperCase()
                        ? (this.nameInputModel.isValidated = !0)
                        : (this.nameInputModel.isValidated = !1);
                } else this.nameInputModel.isValidated = !1;
            }),
            p(this, "validatePassword", () => {
                this.passwordInputModel.value.length >= 6
                    ? (this.passwordInputModel.isValidated = !0)
                    : (this.passwordInputModel.isValidated = !1);
            }),
            p(this, "validateSumbitButton", () => {
                const e = this.nameInputModel.isValidated,
                    s = this.passwordInputModel.isValidated;
                e === !0 && s === !0
                    ? (this.submitButtonModel.isDisabled = !1)
                    : (this.submitButtonModel.isDisabled = !0);
            }),
            p(this, "goToAboutPage", () => {
                m.socket.close();
            }),
            (this.loginView = t),
            (this.nameInputModel = new D()),
            (this.passwordInputModel = new D()),
            (this.submitButtonModel = new ke());
    }
}
var Oe = Object.defineProperty,
    Re = (i, t, e) =>
        t in i
            ? Oe(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    M = (i, t, e) => (Re(i, typeof t != "symbol" ? t + "" : t, e), e);
class xe extends o {
    constructor(t) {
        super({ tag: "div", className: "login-page" }),
            M(this, "nameInput"),
            M(this, "passwordInput"),
            M(this, "submitButton"),
            M(this, "aboutButton"),
            M(this, "nameValidationBlock"),
            M(this, "passwordValidationBlock"),
            M(this, "parent"),
            (this.parent = t);
        const e = new o({ tag: "input", className: "login_name" });
        e.setInputAttributes({ type: "text", placeholder: "Name" }),
            (this.nameInput = e);
        const s = new o({ tag: "input", className: "login_password" });
        s.setInputAttributes({ type: "text", placeholder: "password" }),
            (this.passwordInput = s);
        const n = new o({
            tag: "button",
            className: "login-button",
            text: "Submit",
        });
        n.setAttribute("disabled", ""),
            n.addClass("button-element"),
            (this.submitButton = n),
            (this.aboutButton = this.addAboutButton());
        const a = this.addValidationBLock("Name should be capitalized");
        this.nameValidationBlock = a;
        const l = this.addValidationBLock(
            "Password should contains at least 6 simbol"
        );
        this.passwordValidationBlock = l;
    }
    draw() {
        this.getNode().innerHTML = "";
        const t = this.addForm();
        this.append(t);
        const e = this.getNode();
        this.parent.appendChild(e);
    }
    addForm() {
        const t = new o({ tag: "div", className: "login-div" }),
            e = new o({
                tag: "div",
                className: "login-greeting",
                text: "Login in",
            }),
            s = new o({ tag: "form", className: "login-form" });
        s.setAttribute("action", "");
        const n = this.addInputs();
        return (
            s.appendChildren([e, ...n, this.submitButton, this.aboutButton]),
            t.append(s),
            t
        );
    }
    addInputs() {
        return [
            this.nameValidationBlock,
            this.nameInput,
            this.passwordValidationBlock,
            this.passwordInput,
        ];
    }
    addValidationBLock(t) {
        return new o({
            tag: "div",
            className: "login_validation-block",
            text: t,
        });
    }
    addAboutButton() {
        const t = new o({
            tag: "div",
            className: "login_about-button",
            text: "About",
        });
        return t.getNode().classList.add("button-element"), t;
    }
    toggleSubmitButton(t) {
        this.submitButton.getNode().disabled = t;
    }
    showNameAnnotation(t) {
        t === !1
            ? (this.nameValidationBlock.style.opacity = "1")
            : (this.nameValidationBlock.style.opacity = "0");
    }
    showPasswordAnnotation(t) {
        t === !1
            ? (this.passwordValidationBlock.style.opacity = "1")
            : (this.passwordValidationBlock.style.opacity = "0");
    }
    getNameValue() {
        const { value: t } = this.nameInput.getNode();
        return t;
    }
    getPasswordValue() {
        const { value: t } = this.passwordInput.getNode();
        return t;
    }
}
var Ue = Object.defineProperty,
    Ae = (i, t, e) =>
        t in i
            ? Ue(i, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: e,
              })
            : (i[t] = e),
    P = (i, t, e) => (Ae(i, typeof t != "symbol" ? t + "" : t, e), e);
class Te {
    constructor(t) {
        P(this, "possibleRoutes"),
            P(this, "mainNode"),
            (this.possibleRoutes = {
                Login: () => r.emit("goToLogin", "draw"),
                About: () => r.emit("goToAbout", "draw"),
                Chat: () => r.emit("goToChat", "draw"),
            }),
            (this.mainNode = t);
    }
    handleHashChange(t) {
        t.preventDefault();
        const { newURL: e } = t,
            s = e.split("#")[1];
        return s in this.possibleRoutes
            ? ((this.mainNode.innerHTML = ""), this.possibleRoutes[s]())
            : s === "RefreshIt"
              ? !0
              : console.log("No route found for:", s);
    }
}
const { body: F } = document,
    G = new Ne(F);
G.draw();
r.on("showError", (i) => {
    G.showError(i);
});
const V = new _(),
    De = new o({ tag: "main" }),
    C = De.getNode();
F.appendChild(C);
const Pe = new xe(C),
    _e = new Be(Pe);
r.on("goToLogin", () => {
    V.load() ? (window.location.hash = "#Chat") : _e.drawLoginView();
});
const Fe = new ae(C),
    Ge = new ee(Fe);
r.on("goToAbout", () => {
    Ge.drawAboutView();
});
const He = new Me(C),
    je = new me(He);
r.on("goToChat", () => {
    V.load() ? je.drawChatView() : (window.location.hash = "#Login");
});
const Je = new Te(C);
window.addEventListener("hashchange", (i) => {
    Je.handleHashChange(i);
});
window.location.hash = "#RefreshIt";
if (V.load()) {
    const i = w();
    i && (m.authentication(i), (window.location.hash = "#Chat"));
} else window.location.hash = "#Login";