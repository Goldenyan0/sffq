class Bar extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        this.render()
    }
    static get observedAttributes() {
        return ["position"]
    }
    get position() {
        return this.hasAttribute("position") ? this.getAttribute("position") : "bottom"
    }
    set position(val) {
        !val || "top" !== val && "bottom" !== val ? this.removeAttribute("position") : this.setAttribute("position", val)
    }
    render() {
        this.shadow.innerHTML = `<style>:host{position: absolute;${this.position}: 0;left: 0;z-index: 1000;background-color: #0f9b9b;width: 100%;height: 40px;display: flex;align-items: center;justify-content: flex-start;box-shadow: 0px 0px 5px black;box-sizing: border-box;padding-left: 10px;}</style><slot></slot>`
    }
}
customElements.define("os-bar", Bar);
class Icon extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        }), this.open = (e => {
            let _w = document.querySelector(`os-window[name=${this.control}] `);
            _w && (_w.style.display = "block", _w.bringFront())
        }), this.addEventListener("dblclick", this.open), this.addEventListener("keydown", e => {
            13 === e.keyCode && this.open()
        }), this.tapedTwice = !1, this.addEventListener("touchstart", e => {
            if (!this.tapedTwice) return this.tapedTwice = !0, setTimeout(() => {
                this.tapedTwice = !1
            }, 300), !1;
            e.preventDefault(), this.open()
        })
    }
    calcPos() {
        if (!this.parentNode) return;
        const parent = this.parentNode.getBoundingClientRect(),
            x = Math.floor((parent.width ? parent.width : 320) / 72),
            howMany = this.i,
            offset = parseInt(this.parentNode.iconOffset) || 0;
        this.top = 8 + 104 * Math.floor(howMany / x) + offset, this.left = 8 + howMany % x * 72
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        this.hasAttribute("tabindex") || this.setAttribute("tabindex", 0), this.i = this.parentNode.querySelectorAll("os-icon").length - 1, this.render()
    }
    static get observedAttributes() {
        return ["href", "fixed", "name"]
    }
    get fixed() {
        return this.hasAttribute("fixed") ? this.getAttribute("fixed") : null
    }
    set fixed(val) {
        val ? this.setAttribute("fixed", val) : this.removeAttribute("fixed")
    }
    get control() {
        return this.hasAttribute("href") ? this.getAttribute("href") : null
    }
    set control(val) {
        val ? this.setAttribute("href", val) : this.removeAttribute("href")
    }
    get name() {
        return this.hasAttribute("name") ? this.getAttribute("name") : null
    }
    set name(val) {
        val ? this.setAttribute("name", val) : this.removeAttribute("name")
    }
    render() {
        this.calcPos(), this.shadow.innerHTML = `<style>:host{display: flex;align-items: center;justify-content: center;position: absolute;top: ${this.top}px;left: ${this.left}px;width: 64px;height: 64px;background-color: 0f9b9b;color: white;line-height: 64px;font-family: Verdana;font-size: 32px;border-radius: 5px;box-shadow: 3px 3px 5px rgba(0,0,0,0.3);-webkit-touch-callout: none;-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none;-ms-user-select: none;    user-select: none;}      ::after {        content: '${this.name?this.name:""}';        position: absolute;        top: 76px;        font-size: 0.5em;        line-height: 1em;      }</style><slot></slot>`
    }
}
customElements.define("os-icon", Icon);
class MenuItem extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        }), this.open = (e => {
            if ("keyCode" in e && 13 !== e.keyCode) return;
            let elem = this.parentNode;
            do {
                elem = elem.parentNode
            } while ("os-bar" !== elem.localName);
            let _w = elem.parentNode.querySelector(`*[name=${this.control}] `);
            _w && (_w.style.display = "block", _w.bringFront())
        }), this.addEventListener("click", this.open), this.addEventListener("keydown", this.open)
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        this.hasAttribute("tabindex") || this.setAttribute("tabindex", 0), this.render()
    }
    static get observedAttributes() {
        return ["href"]
    }
    get control() {
        return this.hasAttribute("href") ? this.getAttribute("href") : null
    }
    set control(val) {
        val ? this.setAttribute("href", val) : this.removeAttribute("href")
    }
    render() {
        this.shadow.innerHTML = "<style>:host{display: block;background-color: inherit;}div:hover{color: gray;}</style><div><slot></slot></div>"
    }
}
customElements.define("os-menu-item", MenuItem);
class Window extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        }), this.isMoving = !1, this.lastTop = this.lastLeft = this.lastWidth = this.lastHeight = null, this.index = 900
    }
    mouseUp() {
        this.isMoving = !1
    }
    mouseDown() {
        this.isMoving = !0
    }
    maximize() {
        if (null !== this.lastTop) this.style.top = this.lastTop + "px", this.style.left = this.lastLeft + "px", this.style.width = this.lastWidth + "px", this.style.height = this.lastHeight + "px", this.lastTop = this.lastLeft = this.lastWidth = this.lastHeight = null, this.fixed = !1;
        else {
            let r = this.getBoundingClientRect();
            this.lastTop = r.top, this.lastLeft = r.left, this.lastWidth = r.width, this.lastHeight = r.height, this.style.top = 0, this.style.left = 0, this.style.width = innerWidth + "px", this.style.height = innerHeight + "px", this.fixed = !0
        }
    }
    close() {
        this.style.display = "none"
    }
    bringFront() {
        const _windows = document.querySelectorAll("os-window");
        for (const w of _windows) w.style.zIndex = 900;
        this.style.zIndex = 999, this.render()
    }
    static get observedAttributes() {
        return ["name", "title", "fixed"]
    }
    get name() {
        return this.hasAttribute("name") ? this.getAttribute("name") : null
    }
    set name(val) {
        val ? this.setAttribute("name", val) : this.removeAttribute("name")
    }
    get title() {
        return this.hasAttribute("title") ? this.getAttribute("title") : null
    }
    set title(val) {
        val ? this.setAttribute("title", val) : this.removeAttribute("title")
    }
    get fixed() {
        return this.hasAttribute("fixed") ? this.getAttribute("fixed") : null
    }
    set fixed(val) {
        val ? this.setAttribute("fixed", val) : this.removeAttribute("fixed")
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        const howMany = document.querySelectorAll("os-window").length || 1;
        this.top = .2 * innerHeight * howMany / 5, this.left = .1 * innerWidth * howMany / 5, this.render()
    }
    render() {
        this.shadow.innerHTML = "";
        const style = document.createElement("style");
        style.innerText = `:host{position: fixed;top: ${this.top}px;left: ${this.left}px;z-index: ${this.index};min-width: 320px;min-height: 240px;background-color: white;display: none;border: solid 2px #0f9b9b;box-shadow: 5px 5px 5px;resize: both;overflow: auto;}#buttons{position: absolute;right: 0;top: 0;}#window{display: flex;flex-flow: column;height: 100%;}#top{flex: 0 1 auto;width: 100%;text-align: center;background-color: #0f9b9b;cursor: move;position: relative;}#top > div > button {height: 25px;}#winTitle{line-height: 25px;cursor: inherit;}#content{flex: 1 1 auto;overflow: auto;position: relative;min-height: 205px;}#border{height: 10px;flex: 0 0 auto;}    `;
        const _window = document.createElement("div");
        _window.id = "window", _window.addEventListener("click", () => {
            this.bringFront()
        });
        const top = document.createElement("div");
        top.part = "top", top.id = "top", top.addEventListener("mousedown", () => {
            this.mouseDown()
        }), top.addEventListener("mouseup", () => {
            this.mouseUp()
        }), top.addEventListener("touchstart", () => {
            this.mouseDown()
        }), top.addEventListener("touchend", () => {
            this.mouseUp()
        });
        const winTitle = document.createElement("div");
        winTitle.id = "winTitle", winTitle.innerText = this.title;
        const buttons = document.createElement("div");
        buttons.id = "buttons";
        const _max = document.createElement("button");
        _max.innerText = "❏", _max.part = "buttons", _max.addEventListener("click", () => {
            this.maximize()
        });
        const close = document.createElement("button");
        close.innerText = "✘", close.part = "buttons", close.addEventListener("click", () => {
            this.close()
        }), buttons.appendChild(_max), buttons.appendChild(close), top.appendChild(winTitle), top.appendChild(buttons);
        const content = document.createElement("div");
        content.id = "content";
        const slot = document.createElement("slot");
        content.appendChild(slot);
        const border = document.createElement("div");
        border.id = "border", _window.appendChild(top), _window.appendChild(content), _window.appendChild(border), this.shadow.appendChild(style), this.shadow.appendChild(_window)
    }
}
customElements.define("os-window", Window);
class Desktop extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        }), this.selected = null, this.addEventListener("mousedown", e => {
            "button" in e && 0 === e.button && this.mouseDown(e)
        }), this.addEventListener("mouseup", this.mouseUp), this.addEventListener("mousemove", this.mouseMove), this.addEventListener("touchstart", this.mouseDown), this.addEventListener("touchend", this.mouseUp), this.addEventListener("touchmove", this.mouseMove), this.addEventListener("dragstart", e => e.preventDefault()), new ResizeObserver(() => {
            this.updateIcons()
        }).observe(this)
    }
    updateIcons() {
        const icons = this.querySelectorAll("os-icon");
        for (const i of icons) i.render()
    }
    mouseUp() {
        this.selected = null
    }
    mouseDown(e) {
        const path = e.path || e.composedPath && e.composedPath();
        this.lastX = e.pageX || (e.touches ? e.touches[0].pageX : 0), this.lastY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
        for (let i = 0; i < path.length; i++) {
            if ("os-icon" === path[i].localName) {
                this.selected = path[i];
                break
            }
            if ("os-window" === path[i].localName && path[i].isMoving) {
                this.selected = path[i];
                break
            }
        }
    }
    mouseMove(e) {
        if (this.selected && !this.selected.fixed)
            if (e.preventDefault(), "os-icon" === this.selected.localName) {
                const x = e.pageX || (e.touches ? e.touches[0].pageX : 0),
                    y = e.pageY || (e.touches ? e.touches[0].pageY : 0);
                this.selected.style.left = 8 * Math.floor(x / 8) - this.selected.offsetWidth / 2 + "px", this.selected.style.top = 8 * Math.floor(y / 8) - this.selected.offsetHeight / 2 + "px"
            } else {
                let newX = e.pageX || (e.touches ? e.touches[0].pageX : 0),
                    newY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
                this.selected.style.left = this.selected.offsetLeft + (newX - this.lastX) + "px", this.selected.style.top = this.selected.offsetTop + (newY - this.lastY) + "px", this.lastX = newX, this.lastY = newY
            }
    }
    static get observedAttributes() {
        return ["iconOffset"]
    }
    get iconOffset() {
        return this.hasAttribute("iconOffset") ? this.getAttribute("iconOffset") : null
    }
    set iconOffset(val) {
        val ? this.setAttribute("iconOffset", val) : this.removeAttribute("iconOffset")
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        this.render()
    }
    render() {
        this.shadow.innerHTML = "<style>:host{position: relative;display: block;width: 100%;height: 100%;min-height: 240px;min-width: 320px;background-color: #0f9b9b;overflow: auto;}</style><slot></slot>"
    }
}


customElements.define("os-desktop", Desktop);
class Menu extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        }), this.open = (e => {
            "keyCode" in e && 13 !== e.keyCode || (this.visible = !0)
        }), this.addEventListener("click", this.open), this.addEventListener("keydown", this.open), document.body.addEventListener("click", e => {
            "os-menu" !== e.target.localName && (this.visible = !1)
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        for (this.hasAttribute("tabindex") || this.setAttribute("tabindex", 0), this.bar = this.parentNode;
            "os-BAR" !== this.bar.tagName;) this.bar = this.bar.parentNode;
        this.render()
    }
    static get observedAttributes() {
        return ["name", "visible"]
    }
    get visible() {
        return !!this.hasAttribute("visible")
    }
    set visible(val) {
        val ? this.setAttribute("visible", !0) : this.removeAttribute("visible")
    }
    get name() {
        return this.hasAttribute("name") ? this.getAttribute("name") : null
    }
    set name(val) {
        val ? this.setAttribute("name", val) : this.removeAttribute("name")
    }
    render() {
        this.shadow.innerHTML = "<style>:host{display: inline-block;cursor: default;}#menu{display: " + (this.visible ? "block" : "none") + ";position: absolute;" + (this.bar ? this.bar.position : "bottom") + ": 40px;background-color: #0f9b9b;padding: 1em;border: solid 1px black;border-" + (this.bar ? this.bar.position : "bottom") + `: 0;}#title:hover{color: gray;}</style><div><div id="title" part="title">${this.name}</div><div id="menu" part="window"><slot></slot></div></div>`
    }
}
customElements.define("os-menu", Menu);
class Panel extends HTMLElement {
    constructor() {
        super(), this.shadow = this.attachShadow({
            mode: "open"
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
    }
    connectedCallback() {
        this.render()
    }
    bringFront() {
        const panels = this.parentNode.querySelectorAll("os-panel");
        for (const panel of panels) panel.style.display = "none", panel.selected = !1;
        this.style.display = "block", this.selected = !0
    }
    static get observedAttributes() {
        return ["name", "selected"]
    }
    get selected() {
        return !!this.hasAttribute("selected")
    }
    set selected(val) {
        val ? this.setAttribute("selected", !0) : this.removeAttribute("selected")
    }
    get name() {
        return this.hasAttribute("name") ? this.getAttribute("name") : null
    }
    set name(val) {
        val ? this.setAttribute("name", val) : this.removeAttribute("name")
    }
    render() {
        this.shadow.innerHTML = "<style>:host{display: " + (this.selected ? "block" : "none") + ";}</style><slot></slot>"
    }
}
customElements.define("os-panel", Panel);