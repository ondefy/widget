# \<ondefy-widget>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i ondefy-widget
```

## Usage

```html
<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
</head>
<style>
  body {
    background: #eeeeee;
  }
</style>
<body>
<!--  Put it wherever you like - in any place where you render html-->

<ondefy-ramp-button
  frame-border-radius="18"
  network-id="1"
  token-id="ethereum"
  color-primary="ffee00"
>
  <button>Method 1: User component triggers fullscreen</button>
</ondefy-ramp-button>

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
  Method 2: Using Custom Event
</button>

<button
  onclick="Ondefy.launchRampFullscreen({
     frameBorderRadius: '18',
     networkId: '1',
     tokenId: 'ethereum',
     colorPrimary: '4EB9A3'
   })">
  Method 3: Using Ondefy SDK
</button>

<ondefy-ramp-iframe
  frame-border-radius="18"
  frame-height="500"
  network-id="1"
  token-id="ethereum"
  color-primary="4EB9A3"
  __server-url="http://localhost:4004"
></ondefy-ramp-iframe>


<script src="./dist/ondefy-widget.js"></script>
</body>
</html>

```
