
/**
 * @description
 * ClientConfig is config file for client part of networking.
 */
class ClientConfig {

  // Not implemented yet
  // Free to define what ever -> injectCanvas
  recordCanvasOption = {
    injectCanvas: () => document.getElementsByTagName("canvas")[0],
    frameRequestRate: 30,
    videoDuration: 20,
    outputFilename: "record-gameplay.mp4",
    mineType: "video/mp4",
    resolutions: '800x600'
  }

  /**
   * @description
   * Default setup is `dev`.
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  // domain = "maximumroulette.com";
  domain = "localhost";

  /**
   * @description Important note for this property: if you
   * disable (false) you can't use Account system or any other
   * network. Use 'false' if you wanna make single player game.
   * In other way keep it 'true'.
   */
  showBroadcasterOnInt = true;

  /**
   * networkDeepLogs control of dev logs for webRTC context only.
   */
  networkDeepLogs = false;

  /**
   * masterServerKey is channel access id used to connect
   * multimedia server channel/multiRTC3
   */
  masterServerKey = "maximumroulette.matrix-engine.roulette";

  /**
   * @description
   * runBroadcasterOnInt load broadcaster
   */
  runBroadcasterOnInt = true;
  broadcastAutoConnect = true;

  /**
   * @description
   * broadcasterPort Port used to connect multimedia server MultiRTC3.
   * I will use it for explicit video chat multiplatform support.
   * Default value is 999
   */
  broadcasterPort = 999;

  /**
   * @description
   * broadcaster rtc session init values.
   * Change it for production regime
   */
  broadcasterSessionDefaults = {
    sessionAudio: true,
    sessionVideo: false,
    sessionData: true,
    enableFileSharing: true,
  };

  /**
   * @description
   * Optimal for dev stage.
   * read more about webRtc protocols.
   * Recommended: coturn open source project.
   */
  stunList = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun.l.google.com:19302?transport=udp",
  ];

  /**
   * @description
   * constructor will save interest data for game platform
   * For now it is just name of the game. I use it in
   * pre gameplay UI game selector.
   */
  constructor() {
  }

  getRecordCanvasOptions() {
    return this.recordCanvasOption;
  }

  getRunBroadcasterOnInt() {
    return this.runBroadcasterOnInt;
  }

  didAppUseBroadcast() {
    return this.appUseBroadcaster;
  }

  getStunList() {
    return this.stunList;
  }

  getBroadcastSockRoute() {
    return this.getProtocolFromAddressBar() + this.getDomain() + ":" + this.broadcasterPort + "/";
  }

  getDomain() {
    // localhost vs prodc domain not works CORS not equal!
    if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return window.location.hostname;
    }
    return this.domain;
  }

  getBroadcastAutoConnect() {
    return this.broadcastAutoConnect;
  }

  getShowBroadcasterOnInt() {
    return this.showBroadcasterOnInt;
  }

  getBroadcasterPort() {
    return this.broadcasterPort;
  }

  getBroadcasterSessionDefaults() {
    return this.broadcasterSessionDefaults;
  }

  getProtocolFromAddressBar() {
    return (location.protocol === "https:" ? "https://" : "http://");
  }

  setNetworkDeepLog(newState) {
    this.networkDeepLogs = newState;
  }

  getNetworkDeepLog() {
    return this.networkDeepLogs;
  }

  getMasterServerKey() {
    return this.masterServerKey;
  }

}
export default ClientConfig;
