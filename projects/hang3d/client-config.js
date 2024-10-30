
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
	domain = "maximumroulette.com";
	// domain = "localhost";

	/**
	 * masterServerKey is channel access id used to connect
	 * multimedia server channel/multiRTC3
	 */
	masterServerKey = "maximumroulette.hang3d-matrix";

	/**
	 * New networking platform
	 * Based on kurento/Ov media server
	 */
	networking2 = {
		active: true,
		domain: 'maximumroulette.com',
		port: 2020
	};

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

	getDomain() {
		// localhost vs prodc domain not works CORS not equal!
		if(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
			return window.location.hostname;
		}
		return this.domain;
	}

	// Used for both net variant
	getMasterServerKey() {
		return this.masterServerKey;
	}

}
export default ClientConfig;
