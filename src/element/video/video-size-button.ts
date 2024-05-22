import { MediaChromeButton } from "media-chrome";
import React, { HTMLProps, HtmlHTMLAttributes } from "react";

const renditionIcon = /*html*/ `<svg viewBox="0 0 24 24" fill="none">
    <path d="M14 22H6.8M6.8 22C5.11984 22 4.27976 22 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2M6.8 22H7.2C8.88016 22 9.72024 22 10.362 21.673C10.9265 21.3854 11.3854 20.9265 11.673 20.362C12 19.7202 12 18.8802 12 17.2V16.8C12 15.1198 12 14.2798 11.673 13.638C11.3854 13.0735 10.9265 12.6146 10.362 12.327C9.72024 12 8.88016 12 7.2 12H6.8C5.11984 12 4.27976 12 3.63803 12.327C3.07354 12.6146 2.6146 13.0735 2.32698 13.638C2 14.2798 2 15.1198 2 16.8V17.2M2 17.2V10M10 2H14M22 10V14M18 22C18.93 22 19.395 22 19.7765 21.8978C20.8117 21.6204 21.6204 20.8117 21.8978 19.7765C22 19.395 22 18.93 22 18M22 6C22 5.07003 22 4.60504 21.8978 4.22354C21.6204 3.18827 20.8117 2.37962 19.7765 2.10222C19.395 2 18.93 2 18 2M6 2C5.07003 2 4.60504 2 4.22354 2.10222C3.18827 2.37962 2.37962 3.18827 2.10222 4.22354C2 4.60504 2 5.07003 2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const slotTemplate = document.createElement("template");
slotTemplate.innerHTML = /*html*/ `
  <slot name="icon">${renditionIcon}</slot>
`;

class MediaPlayerSizeButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes];
  }

  constructor() {
    super({ slotTemplate });
  }
}

if (!globalThis.customElements.get("media-player-size-button")) {
  globalThis.customElements.define("media-player-size-button", MediaPlayerSizeButton);
}

const MediaPlayerSizeButtonReact = React.forwardRef<HTMLElement, HTMLProps<HTMLElement>>((props, ref) => {
  return React.createElement("media-player-size-button", { ...props, suppressHydrationWarning: true, ref });
});

export { MediaPlayerSizeButtonReact };
