declare global {
  var Ondefy: {
    launchWidgetFullscreen: (params: {
      frameBorderRadius?: string;
      colorPrimary?: string;
      tokenId?: string;
      networkId?: string;
      theme?: string;
      _serverUrl?: string;
    }) => void;
  };
}

(() => {
  // next.js support
  try {
    // browser doesn't have global but next.js does
    // it will skip rendering on the server side
    if (!window) return;
  } catch {
    return;
  }

  const lightColor = '#E7EAED';
  const darkColor = '#161E25';

  const EVENTS = {
    launchWidgetFullscreen: 'ondefy:launch-widget-fullscreen',
    rampReady: 'ondefy:ready',
  };

  type TEventLaunchWidgetFullscreen = {
    frameBorderRadius?: string;
    colorPrimary?: string;
    tokenId?: string;
    networkId?: string;
    theme?: string;
    _serverUrl?: string;
  };

  type TRampIframe = {
    frameBorderRadius?: string;
    colorPrimary?: string;
    tokenId?: string;
    networkId?: string;
    theme?: string;
    _serverUrl?: string;
    frameHeight?: string;
  };

  const svgLoader = `
  <svg class="ondefy__skeleton-loader" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient gradientUnits='objectBoundingBox' id='ondefy-skeleton-gradient' x1='0' x2='1' y1='1' y2='1'>
         <stop offset='0' stop-color='#E7EAED'>
           <animate attributeName="stop-color"
               dur="2.5s" repeatCount="indefinite" values="#E7EAED;#161E25;#E7EAED;">
            </animate>
         </stop>
         <stop offset='1' stop-color='#161E25' stop-opacity="1">
            <animate attributeName="stop-color"
               dur="2.5s" repeatCount="indefinite" values="#161E25;#E7EAED;#161E25;">
            </animate>
         </stop>
       <animateTransform attributeName="gradientTransform" dur="1.25s" repeatCount="indefinite"
            type="rotate" values="-360 .5 .5;0 .5 .5" />
      </linearGradient>
     </defs>
      <path
      d="M23.1992 0C21.3422 0 19.537 0.220286 17.8061 0.634714V0.635392C7.59463 3.08497 0 12.3334 0 23.3682C0 34.4053 7.59492 43.6538 17.8068 46.1032C19.5375 46.5175 21.3425 46.7374 23.1992 46.7374C36.0113 46.7374 46.3974 36.2735 46.3974 23.3678C46.3974 10.462 36.0113 0 23.1992 0ZM17.8068 45.7982V38.9195C9.34998 38.8374 2.52235 31.9056 2.52235 23.3683C2.52235 14.8311 9.34998 7.90115 17.8068 7.81904V0.939242C27.44 3.78088 34.4749 12.7473 34.4749 23.3678C34.4749 33.9882 27.44 42.9566 17.8068 45.7982Z"
      fill="url(#ondefy-skeleton-gradient)"/>
  </svg>
  `;

  const templateOndefyButton = document.createElement('template');

  templateOndefyButton.innerHTML = `
      <slot></slot>
    `;

  class OndefyButton extends HTMLElement {
    static get observedAttributes() {
      return [
        'class',
        'className',
        'token-id',
        'color-primary',
        'network-id',
        'theme',
        '_server-url',
      ];
    }

    _shadowRoot: ShadowRoot;

    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(
        templateOndefyButton.content.cloneNode(true)
      );
    }

    // attributeChangedCallback() {
    //   // console.log(`Value ${name} changed from ${oldValue} to ${newValue}`);
    // }

    onClick() {
      document.dispatchEvent(
        new CustomEvent(EVENTS.launchWidgetFullscreen, {
          detail: {
            frameBorderRadius: this.frameBorderRadius,
            networkId: this.networkId,
            theme: this.theme,
            tokenId: this.tokenId,
            colorPrimary: this.colorPrimary,
            _serverUrl: this._serverUrl,
          },
        })
      );
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }

    connectedCallback() {
      this.addEventListener('click', this.onClick);
    }

    get className() {
      return this.getAttribute('class') || this.getAttribute('className') || '';
    }

    get frameBorderRadius() {
      return this.getAttribute('frame-border-radius');
    }

    get networkId() {
      return this.getAttribute('network-id');
    }

    get tokenId() {
      return this.getAttribute('token-id');
    }

    get colorPrimary() {
      const color = this.getAttribute('color-primary');
      return color ? color.replace('#', '') : color;
    }

    get theme() {
      const theme = this.getAttribute('theme');
      return theme;
    }

    get _serverUrl() {
      return this.getAttribute('_server-url');
    }
  }

  const css = `
      <style>
        @keyframes anvil {
          0% {
            transform: scale(0.1) rotate(0);
            opacity: 0;
            box-shadow: 0 0 0 rgba(241, 241, 241, 0);
          }
          50% {
            transform: scale(1) rotate(-0.2deg);
            opacity: 1;
            box-shadow: 0 0 0 rgba(241, 241, 241, 0.5);
          }
          75% {
            transform: scale(1) rotate(0.2deg);
            opacity: 1;
            box-shadow: 0 0 250px rgba(241, 241, 241, 0.5);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
            box-shadow: 0 0 500px rgba(241, 241, 241, 0);
          }
        }

        .ondefy__modal {
          box-sizing: border-box;
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(43, 45, 50, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          overflow: auto;
          padding: 20px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.1s;
        }

        .ondefy__modal--visible {
          pointer-events: all;
          visibility: visible;
          opacity: 1;
        }

        .ondefy__modal--visible .ondefy__modal__content {
          overflow: auto;
          /*animation: anvil 0.8s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;*/
          visibility: visible;
          z-index: 200;
          transform: translateY(0%);
        }

        .ondefy__modal__content {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 0;
          width: min(600px, 95%);
          margin: 0 auto;
          transition: all 0.3s ease-in-out;
          max-height: 670px;
        }

        .ondefy__modal__content-inner {
          flex: 1;
          position: relative;
          background-clip: padding-box;
          height: 100%;
          border: 0;
          box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
            0 9px 28px 8px rgb(0 0 0 / 5%);
          pointer-events: auto;
        }

        .ondefy__modal__body {
          font-size: 14px;
          line-height: 0;
          word-wrap: break-word;
        }

        .ondefy__modal__close {
          position: absolute;
          transform: rotate(45deg) scale(1);
          transform-origin: center;
          top: 0;
          right: 0;
          z-index: 1;
          cursor: pointer;
          font-size: 20px;
          transition: transform 0.1s;
          padding: 20px 0;
          line-height: 0;
        }

        .ondefy__modal__close:hover {
          transform: rotate(45deg) scale(1.3);
          transition: transform 0.1s;
        }

        .ondefy__modal__loading {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }


        .ondefy__modal__loading--dark {
            background: ${darkColor};
        }
        .ondefy__modal__loading--light {
            background: ${lightColor};
        }
        .ondefy__modal__body--dark {
            background: ${darkColor};
        }
        .ondefy__modal__body--light {
            background: ${lightColor};
        }

        .ondefy__skeleton-loader {
            width: 40px;
            height: 40px;
            /*animation: loader-animation 2s infinite;*/
        }
      </style>
  `;

  const templateOndefyWidgetFullscreen = document.createElement('template');

  templateOndefyWidgetFullscreen.innerHTML = `
      ${css}
      <div class="ondefy__modal">
        <div
          class="ondefy__modal__close"
        >+</div>
        <div class="ondefy__modal__content">
          <div class="ondefy__modal__content-inner">
            <div class="ondefy__modal__body">
                <div class="ondefy__modal__loading">
                  ${svgLoader}
                </div>
<!--                <iframe-->
<!--                  src="#"-->
<!--                  frameBorder="0"-->
<!--                  height="665px"-->
<!--                  width="100%"-->
<!--                  style="border-radius: 18px"-->
<!--                />-->
            </div>
          </div>
        </SBox>
      </div>
    `;

  class OndefyWidgetFullscreen extends HTMLElement {
    static get observedAttributes() {
      return ['class', 'className'];
    }

    closeTimer?: ReturnType<typeof setTimeout>;

    bodyEl: HTMLDivElement | null;

    rootEl: HTMLDivElement | null;

    _shadowRoot: ShadowRoot;

    params?: {
      frameBorderRadius?: string;
      colorPrimary?: string;
      tokenId?: string;
      networkId?: string;
      theme?: string;
      _serverUrl?: string;
    };

    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(
        templateOndefyWidgetFullscreen.content.cloneNode(true)
      );

      this.bodyEl = null;
      this.rootEl = null;

      this.openHandler = this.openHandler.bind(this);
      this.closeHandler = this.closeHandler.bind(this);
      this.onWindowResize = this.onWindowResize.bind(this);
      this.onClickOutside = this.onClickOutside.bind(this);
      this.onPostMessage = this.onPostMessage.bind(this);
    }

    toggleLoader(show: boolean) {
      const loader = this._shadowRoot.querySelector(
        '.ondefy__modal__loading'
      ) as HTMLDivElement;

      this.setSkeletonTheme((this.params || {}).theme || 'light');

      if (!loader) return;

      if (show) {
        loader.style.display = 'flex';
      } else {
        loader.style.display = 'none';
      }
    }

    onWindowResize() {
      const iframe = this._shadowRoot.querySelector('iframe');
      this.setIframeHeight(iframe!);
    }

    setSkeletonTheme(theme: string) {
      const loader = this._shadowRoot.querySelector(
        '.ondefy__modal__loading'
      ) as HTMLElement;

      const body = this._shadowRoot.querySelector(
        '.ondefy__modal__body'
      ) as HTMLElement;

      const variant = theme === 'dark' ? 'dark' : 'light';

      if (body) {
        body.classList.remove(`ondefy__modal__body--light`);
        body.classList.remove(`ondefy__modal__body--dark`);
        body.classList.add(`ondefy__modal__body--${variant}`);
      }

      if (loader) {
        loader.classList.remove(`ondefy__modal__loading--light`);
        loader.classList.remove(`ondefy__modal__loading--dark`);
        loader.classList.add(`ondefy__modal__loading--${variant}`);
      }
    }

    setIframeHeight(iframe: HTMLIFrameElement) {
      const availableHeight = window.innerHeight - 40;
      const height = `${availableHeight >= 670 ? 670 : availableHeight}px`;

      if (iframe) {
        iframe.setAttribute('height', height);
      }

      const body = this._shadowRoot.querySelector(
        '.ondefy__modal__body'
      ) as HTMLDivElement;

      if (body) {
        body.style.height = height;
      }
    }

    setIframeRadius(iframe: HTMLIFrameElement) {
      const { frameBorderRadius } = this.params || {};
      const radiusStyle = `${
        parseInt(frameBorderRadius || '18', 10) || '18'
      }px`;

      iframe.style.borderRadius = radiusStyle;

      const loading = this._shadowRoot.querySelector(
        '.ondefy__modal__loading'
      ) as HTMLElement;

      if (loading) {
        loading.style.borderRadius = radiusStyle;
      }

      const content = this._shadowRoot.querySelector(
        '.ondefy__modal__content'
      ) as HTMLElement;

      if (content) {
        content.style.borderRadius = radiusStyle;
      }

      const contentInner = this._shadowRoot.querySelector(
        '.ondefy__modal__content-inner'
      ) as HTMLElement;

      if (contentInner) {
        contentInner.style.borderRadius = radiusStyle;
      }

      const body = this._shadowRoot.querySelector(
        '.ondefy__modal__body'
      ) as HTMLDivElement;

      if (body) {
        body.style.borderRadius = radiusStyle;
      }
    }

    onPostMessage(e: MessageEvent) {
      if (e.data.action === EVENTS.rampReady) {
        this.toggleLoader(false);
      }
    }

    toggle(open: boolean) {
      const iframe = document.createElement('IFRAME') as HTMLIFrameElement;

      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.toggleLoader(true);
      }

      if (open) {
        document.body.style.overflow = 'hidden';
        const { tokenId, networkId, theme, _serverUrl, colorPrimary } =
          this.params || {};
        const queryParams = {
          tokenId,
          networkId,
          theme,
          colorPrimary,
        };

        let querySearch = Object.entries(queryParams)
          .filter(
            ([key]) =>
              queryParams[
                key as 'tokenId' | 'networkId' | 'colorPrimary' | 'theme'
              ]
          )
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        querySearch = querySearch ? `?${querySearch}` : '';

        iframe.setAttribute(
          'src',
          (_serverUrl || 'https://ramp.ondefy.com/') + querySearch
        );

        iframe.setAttribute('frameBorder', '0');
        iframe.setAttribute('width', '100%');
        this.setIframeHeight(iframe);
        this.setIframeRadius(iframe);

        window.addEventListener('message', this.onPostMessage);

        if (this.bodyEl) {
          this.bodyEl!.appendChild(iframe);
        }

        if (this.rootEl) {
          this.rootEl.classList.add('ondefy__modal--visible');
        }
      } else {
        document.body.style.overflow = 'unset';
        window.removeEventListener('message', this.onPostMessage);

        if (this.rootEl) {
          this.rootEl.classList.remove('ondefy__modal--visible');
        }

        this.closeTimer = setTimeout(() => {
          if (this.rootEl) {
            const iframeEl = this.rootEl.querySelector('iframe')!;

            if (iframeEl && iframeEl.parentNode) {
              iframeEl.parentNode!.removeChild(iframeEl);
            }
          }
          this.toggleLoader(true);
        }, 300);
      }
    }

    closeHandler() {
      this.toggle(false);
    }

    openHandler(e: CustomEvent<TEventLaunchWidgetFullscreen>) {
      const colorPrimary =
        e.detail && e.detail.colorPrimary
          ? e.detail.colorPrimary.replace('#', '')
          : undefined;

      this.params = {
        ...e.detail,
        colorPrimary,
      };

      this.toggle(true);
    }

    onClickOutside() {
      this.closeHandler();
    }

    connectedCallback() {
      this.bodyEl = this._shadowRoot.querySelector('.ondefy__modal__body');
      this.rootEl = this._shadowRoot.querySelector('.ondefy__modal');

      // this._shadowRoot
      //   .querySelector('.ondefy__modal__close')
      //   .addEventListener('click', this.closeHandler);

      document.addEventListener(
        EVENTS.launchWidgetFullscreen,
        this.openHandler as EventListener
      );
      window.addEventListener('resize', this.onWindowResize);
      if (this.rootEl) {
        this.rootEl.addEventListener('click', this.onClickOutside);
      }
    }

    disconnectedCallback() {
      // this._shadowRoot
      //   .querySelector('.ondefy__modal__close')
      //   .removeEventListener('click', this.closeHandler);

      document.body.removeEventListener(
        EVENTS.launchWidgetFullscreen,
        this.openHandler as EventListener
      );
      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('message', this.onPostMessage);
      if (this.rootEl) {
        this.rootEl.removeEventListener('click', this.onClickOutside);
      }
    }

    attributeChangedCallback() {
      // newValue: string | undefined // oldValue: string | undefined, // name: string,
      // console.log(`Value ${name} changed from ${oldValue} to ${newValue}`);
    }
  }

  const cssIframe = `
      <style>
        :host {
            display: inline-block;
            width: 100%;
            max-width: 500px;
        }

        .ondefy__iframe {
          box-sizing: border-box;
          font-family: 'atten-new', sans-serif;
          height: max(100%, 670px);
          width: max(100%, 350px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
        }

        .ondefy__iframe__content {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 0;
          width: 100%;
          margin: 0 auto;
          transition: all 0.3s ease-in-out;
          max-height: 670px;
        }

        .ondefy__iframe__content-inner {
          flex: 1;
          position: relative;
          background-clip: padding-box;
          height: 100%;
          border: 0;
          box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
            0 9px 28px 8px rgb(0 0 0 / 5%);
          pointer-events: auto;
        }

        .ondefy__iframe__body {
          font-size: 14px;
          line-height: 0;
          word-wrap: break-word;
        }

        .ondefy__iframe__close {
          position: absolute;
          transform: rotate(45deg) scale(1);
          transform-origin: center;
          top: 0;
          right: 0;
          z-index: 1;
          cursor: pointer;
          font-size: 20px;
          transition: transform 0.1s;
          padding: 20px;
          line-height: 0;
        }

        .ondefy__iframe__close:hover {
          transform: rotate(45deg) scale(1.3);
          transition: transform 0.1s;
        }

        .ondefy__iframe__loading {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ondefy__iframe__loading--dark {
            background: ${darkColor};
        }
        .ondefy__iframe__loading--light {
            background: ${lightColor};
        }
        .ondefy__body--dark {
            background: ${darkColor};
        }
        .ondefy__body--light {
            background: ${lightColor};
        }


        .ondefy__skeleton-loader {
            width: 40px;
            height: 40px;
            /*animation: loader-animation 2s infinite;*/
        }
      </style>
  `;

  const templateOndefyWidget = document.createElement('template');

  templateOndefyWidget.innerHTML = `
      ${cssIframe}
      <div class="ondefy__iframe">
        <div class="ondefy__iframe__content">
          <div class="ondefy__iframe__content-inner">
            <div class="ondefy__iframe__body">
                <div class="ondefy__iframe__loading">
                  ${svgLoader}
                </div>
            </div>
          </div>
        </SBox>
      </div>
    `;

  class OndefyWidget extends HTMLElement {
    static get observedAttributes() {
      return [
        'class',
        'className',
        'token-id',
        'color-primary',
        'network-id',
        'theme',
        '_server-url',
        'frame-height',
        'frame-border-radius',
      ];
    }

    bodyEl: HTMLDivElement | null;

    rootEl: HTMLDivElement | null;

    _shadowRoot: ShadowRoot;

    get className() {
      return this.getAttribute('class') || this.getAttribute('className') || '';
    }

    get frameBorderRadius() {
      return this.getAttribute('frame-border-radius');
    }

    get networkId() {
      return this.getAttribute('network-id');
    }

    get theme() {
      return this.getAttribute('theme');
    }

    get tokenId() {
      return this.getAttribute('token-id');
    }

    get colorPrimary() {
      const color = this.getAttribute('color-primary');
      return color ? color.replace('#', '') : color;
    }

    get _serverUrl() {
      return this.getAttribute('_server-url');
    }

    get frameHeight() {
      return this.getAttribute('frame-height');
    }

    params?: TRampIframe;

    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(
        templateOndefyWidget.content.cloneNode(true)
      );

      this.bodyEl = null;
      this.rootEl = null;

      this.onWindowResize = this.onWindowResize.bind(this);
      this.onPostMessage = this.onPostMessage.bind(this);

      this.setSkeletonTheme(this.theme || 'dark');
    }

    toggleLoader(show: boolean) {
      const loader = this._shadowRoot.querySelector(
        '.ondefy__iframe__loading'
      ) as HTMLElement;

      if (!loader) return;

      if (show) {
        loader.style.display = 'flex';
      } else {
        loader.style.display = 'none';
      }
    }

    onPostMessage(e: MessageEvent) {
      if (e.data.action === EVENTS.rampReady) {
        this.toggleLoader(false);
      }
    }

    onWindowResize() {
      const iframe = this._shadowRoot.querySelector('iframe');
      this.setIframeHeight(iframe!);
    }

    setIframeHeight(iframe: HTMLIFrameElement) {
      const { frameHeight } = this;

      if (iframe) {
        const availableHeight = window.innerHeight - 40;
        const height = `${
          frameHeight
            ? frameHeight
            : availableHeight >= 670
            ? 670
            : availableHeight
        }px`;
        const contentWrapper = this._shadowRoot.querySelector(
          '.ondefy__iframe'
        ) as HTMLDivElement;
        iframe.setAttribute('height', height);

        if (contentWrapper) {
          contentWrapper.style.height = height;
        }

        const body = this._shadowRoot.querySelector(
          '.ondefy__modal__body'
        ) as HTMLDivElement;

        if (body) {
          body.style.height = height;
        }
      }
    }

    setIframeRadius(iframe: HTMLIFrameElement) {
      const { frameBorderRadius } = this;
      const radiusStyle = `${parseInt(frameBorderRadius || '', 10) || '18'}px`;

      iframe.style.borderRadius = radiusStyle;

      const loading = this._shadowRoot.querySelector(
        '.ondefy__iframe__loading'
      ) as HTMLElement;

      if (loading) {
        loading.style.borderRadius = radiusStyle;
      }

      const content = this._shadowRoot.querySelector(
        '.ondefy__iframe__content'
      ) as HTMLElement;

      if (content) {
        content.style.borderRadius = radiusStyle;
      }

      const contentWrapper = this._shadowRoot.querySelector(
        '.ondefy__iframe'
      ) as HTMLElement;
      if (contentWrapper) {
        contentWrapper.style.borderRadius = radiusStyle;
      }

      const body = this._shadowRoot.querySelector(
        '.ondefy__modal__body'
      ) as HTMLDivElement;

      if (body) {
        body.style.borderRadius = radiusStyle;
      }
    }

    setSkeletonTheme(theme: string) {
      const loader = this._shadowRoot.querySelector(
        '.ondefy__iframe__loading'
      ) as HTMLElement;

      const body = this._shadowRoot.querySelector(
        '.ondefy__iframe__body'
      ) as HTMLElement;

      const variant = theme === 'dark' ? 'dark' : 'light';

      if (body) {
        body.classList.remove(`ondefy__iframe__body--light`);
        body.classList.remove(`ondefy__iframe__body--dark`);
        body.classList.add(`ondefy__iframe__body--${variant}`);
      }

      if (loader) {
        loader.classList.remove(`ondefy__iframe__loading--light`);
        loader.classList.remove(`ondefy__iframe__loading--dark`);
        loader.classList.add(`ondefy__iframe__loading--${variant}`);
      }
    }

    renderIframe() {
      const existingIframe = this._shadowRoot.querySelector(
        'iframe'
      ) as HTMLIFrameElement;
      const iframe =
        existingIframe ||
        (document.createElement('IFRAME') as HTMLIFrameElement);
      const { tokenId, networkId, theme, _serverUrl, colorPrimary } = this;
      const queryParams = {
        tokenId,
        networkId,
        colorPrimary,
        theme,
      };

      this.setSkeletonTheme(theme || 'light');

      let querySearch = Object.entries(queryParams)
        .filter(
          ([key]) =>
            queryParams[
              key as 'tokenId' | 'networkId' | 'colorPrimary' | 'theme'
            ]
        )
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      this.toggleLoader(true);

      querySearch = querySearch ? `?${querySearch}` : '';

      iframe.setAttribute(
        'src',
        (_serverUrl || 'https://ramp.ondefy.com/') + querySearch
      );
      iframe.setAttribute('frameBorder', '0');
      iframe.setAttribute('width', '100%');
      this.setIframeHeight(iframe);
      this.setIframeRadius(iframe);

      if (existingIframe) {
        return;
      }

      if (this.bodyEl) {
        this.bodyEl.appendChild(iframe);
      }

      window.addEventListener('message', this.onPostMessage);
    }

    connectedCallback() {
      this.bodyEl = this._shadowRoot.querySelector('.ondefy__iframe__body');
      this.rootEl = this._shadowRoot.querySelector('.ondefy__iframe');

      // this._shadowRoot
      //   .querySelector('.ondefy__modal__close')
      //   .addEventListener('click', this.closeHandler);

      this.renderIframe();
      window.addEventListener('resize', this.onWindowResize);
    }

    disconnectedCallback() {
      // this._shadowRoot
      //   .querySelector('.ondefy__modal__close')
      //   .removeEventListener('click', this.closeHandler);

      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('message', this.onPostMessage);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (newValue && oldValue === null) {
        return;
      }

      if (name === 'frame-border-radius') {
        const iframe = this._shadowRoot.querySelector(
          'iframe'
        ) as HTMLIFrameElement;
        if (iframe) {
          this.setIframeRadius(iframe);
        }
        return;
      }
      if (name === 'frame-height') {
        const iframe = this._shadowRoot.querySelector(
          'iframe'
        ) as HTMLIFrameElement;
        if (iframe) {
          this.setIframeHeight(iframe);
        }
        return;
      }
      // console.log(`Value ${name} changed from ${oldValue} to ${newValue}`);

      this.renderIframe();
    }
  }

  if (window) {
    window.customElements.define('ondefy-button', OndefyButton);
    window.customElements.define(
      'ondefy-widget-fullscreen',
      OndefyWidgetFullscreen
    );
    window.customElements.define('ondefy-widget', OndefyWidget);

    window.Ondefy = {
      launchWidgetFullscreen(params: TEventLaunchWidgetFullscreen) {
        document.dispatchEvent(
          new CustomEvent(EVENTS.launchWidgetFullscreen, {
            detail: params,
          })
        );
      },
    };
  }

  const template = document.createElement('template');
  template.innerHTML = '<ondefy-widget-fullscreen></ondefy-widget-fullscreen>';

  // document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(template.content);
  // });
})();

export {};
