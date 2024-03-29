## Installation

### Installation using npm

```bash
npm i @ondefy/widget
```

```javascript
import '@ondefy/widget'
```

### Installation from cdn
```html
<script src="https://cdn.jsdelivr.net/npm/@ondefy/widget@0.0.13"></script>
```

## Usage 

### Usage of Ondefy Widget

```html
<ondefy-widget></ondefy-widget>
```

### Usage of Ondefy Widget with Parameters

#### All parameters are optional
```html
<ondefy-widget
  frame-border-radius="18"
  frame-height="500"
  network-id="1"
  theme="dark"
  token-id="ethereum"
  color-primary="#4EB9A3"
></ondefy-widget>
```

### Usage of widget in fullscreen mode

#### Method 1: Use your own component here to launch the widget fullscreen
```html
<!--  Put it wherever you like - in any place where you render html-->
<ondefy-widget-button>
  <button>My button</button>
</ondefy-widget-button>
```

or with optional parameters
```html
<ondefy-widget-button
  frame-border-radius="18"
  network-id="1"
  theme="dark"
  token-id="ethereum"
  color-primary="#ffee00"
>
  <button>My button</button>
</ondefy-widget-button>
```


#### Method 2: Dispatch our custom event to launch the widget fullscreen
```html
<button
  onclick="document.dispatchEvent(
    new CustomEvent('ondefy:launch-ramp-fullscreen')
 )">
  Launch Widget
</button>
```

or with optional parameters
```html
<button
  onclick="document.dispatchEvent(
    new CustomEvent('ondefy:launch-ramp-fullscreen', {
      detail: {
       frameBorderRadius: '18',
       networkId: '1',
       theme: 'dark',
       tokenId: 'ethereum',
       colorPrimary: '#4EB9A3'
     },
   })
 )">
  Launch Widget
</button>
```

#### Method 3: Use the method of our global object to launch the widget fullscreen
```html
<button
  onclick="Ondefy.launchWidgetFullscreen()">
  Launch Widget
</button>
```

or with optional params

```html
<button
  onclick="Ondefy.launchWidgetFullscreen({
     frameBorderRadius: '18',
     networkId: '1',
     theme: 'dark',
     tokenId: 'ethereum',
     colorPrimary: '#4EB9A3'
   })">
  Launch Widget
</button>
```

## Using with typescript

If you compiler complains try creating react-app-env.d.ts 
in the root of your project for react.js projects:

```typescript
/// <reference types="react-scripts" />
import * as React from 'react';

declare global {
  interface OndefyWidgetFullscreenParams {
    frameBorderRadius?: string;
    colorPrimary?: string;
    theme?: string;
    tokenId?: string;
    networkId?: string;
  }

  type TLaunchWidgetFullscreen = (params: OndefyWidgetFullscreenParams) => void;

  interface Window {
    ethereum: any;
    Ondefy: {
      launchWidgetFullscreen: TLaunchWidgetFullscreen;
    };
  }

  interface OndefyWidgetParams {
    'frame-border-radius'?: string;
    'frame-height'?: string;
    'color-primary'?: string;
    'token-id'?: string;
    'theme'?: string;
    'network-id'?: string;
  }
  interface OndefyButtonParams {
    'frame-border-radius'?: string;
    'frame-height'?: string;
    'color-primary'?: string;
    'token-id'?: string;
    'theme'?: string;
    'network-id'?: string;
    class?: string;
  }

  interface OndefyButton
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      OndefyButtonParams {}

  interface OndefyWidget
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      OndefyIframeParams {}

  namespace JSX {
    interface IntrinsicElements {
      'ondefy-button': OndefyButton;
      'ondefy-widget': OndefyWidget;
    }
  }
}
```

