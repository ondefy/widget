declare global {
  var Ondefy: {
    launchWidgetFullscreen: (params: {
      frameBorderRadius?: string;
      colorPrimary?: string;
      tokenId?: string;
      networkId?: string;
      _serverUrl?: string;
    }) => void;
  };
}
export {};
