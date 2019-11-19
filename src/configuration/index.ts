import { readdirSync } from "fs";
import { ServerConfiguration } from "./server";
import { targetPath } from "../utils";
class DevProdConfig {
	[key: string]: any
	constructor(lib: object) {
		for (const key of Object.getOwnPropertyNames(lib)) {
			this[key] = this.DeepDevOrProd(lib, key);
		}
	}
	/**
	 * Creates an object based on its dev prod properties and merges them accordint to
	 * the current NODE_ENV
	 * This function is recursive and will transform the hole object
	 * @private
	 * @param {object} object target object to transform
	 * @param {string} prop the property to look at
	 * @example {a:{dev:0,prod:1}} if NODE_ENV = 'productoin' -> {a:1}
	 */
	DeepDevOrProd(object: object, prop: string) {
		let target = object[prop];
		if (target instanceof Array) {
			return target;
		} else if (typeof target === 'object' && Object.keys(target).indexOf('dev') === -1) {
			let newobj = {};
			for (const deep of Object.keys(target)) {
				newobj[deep] = this.DeepDevOrProd(object[prop], deep);
			}
			return newobj;
		}
		if (Object.keys(target).indexOf('dev') === -1) {
			return target;
		} else {
			return process.env.NODE_ENV === 'production' ? /* istanbul ignore next */ target.prod : target.dev;
		}
	}
}
class Configuration {
	[p: string]: any;
	environment: string
	bundles: object = {};
	conections: object = {};
	inflections = {
		plural: [],
		singular: []
	};
	server: ServerConfiguration = {} as ServerConfiguration;
	static: object = {};
	views: object = {};
	constructor() {
		/* istanbul ignore next */
		this.environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
		for (const file of readdirSync(targetPath('configuration'))) {
			try {
				/* istanbul ignore else */
				if (/.*\.map$/.exec(file) === null) {
					let [lib] = file.split('.');
					let config = require(targetPath('configuration', file)).default;
					this[lib] = new DevProdConfig(config);
				}
			} catch (ex) {
				/* istanbul ignore next */
				console.log(ex);
			}
		}
		this.server.subdomains = this.server.subdomains || [];
	}
}
const configuration = new Configuration();
export { configuration };
