declare global {
  var Ondefy: {
    launchRampFullscreen: (params: {
      frameBorderRadius?: string;
      colorPrimary?: string;
      tokenId?: string;
      networkId?: string;
      _serverUrl?: string;
    }) => void;
  };
}
export {};
