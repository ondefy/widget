## Installation

### Installation using npm

```bash
npm i ondefy-widget
```

```javascript
import 'ondefy-widget'
```

### Installation from cdn
```
<script src="../dist/ondefy-widget.js"></script>
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
  token-id="ethereum"
  color-primary="4EB9A3"
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
  token-id="ethereum"
  color-primary="ffee00"
>
  <button>My button</button>
</ondefy-widget-button>
```


#### Method 2: Dispatch our custom event to launch the widget fullscreen
```html
<button
  onclick="document.body.dispatchEvent(
    new CustomEvent('ondefy:launch-ramp-fullscreen')
 )">
  Launch Widget
</button>
```

or with optional parameters
```html
<button
  onclick="document.body.dispatchEvent(
    new CustomEvent('ondefy:launch-ramp-fullscreen', {
      detail: {
       frameBorderRadius: '18',
       networkId: '1',
       tokenId: 'ethereum',
       colorPrimary: '4EB9A3'
     },
   })
 )">
  Launch Widget
</button>
```

#### Method 3: Use the method of our global object to launch the widget fullscreen
```html
<button
  onclick="Ondefy.launchRampFullscreen()">
  Launch Widget
</button>
```

or with optional params

```html
<button
  onclick="Ondefy.launchRampFullscreen({
     frameBorderRadius: '18',
     networkId: '1',
     tokenId: 'ethereum',
     colorPrimary: '4EB9A3'
   })">
  Launch Widget
</button>
```

