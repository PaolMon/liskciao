import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { __read } from 'tslib';
const express = require( 'express')
var cors = require('cors')


 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
 export class RestApiPlugin extends BasePlugin {
	// private _channel!: BaseChannel;
	private _app;
	private _server;

	public static get alias(): string {
		return 'restApi';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'paolo',
			version: '0.1.0',
			name: 'restApi',
		};
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-restApi/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		}
	}

	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public get actions(): ActionsDefinition {
		return {
		// 	hello: async () => { hello: 'world' },
		};
	}

		public async load(_channel: BaseChannel): Promise<void> {
		// this._channel = channel;
		// this._channel.once('app:ready', () => {});
			this._app = express();
			this._app.use(express.json());
			this._app.use(cors());
			this._app.get("/api/", async (_req, _res) => {
				_res.send("<h1>LISK REST API!!<h1>")
			})
			this._app.get("/api/saluti", async (__req, _res) =>{
				_res.json(await _channel.invoke("ciao:quantiSaluti"))
			})

			this._server = this._app.listen(8090, "0.0.0.0")

	}

	public async unload(): Promise<void> {
		// close http server
		await new Promise((resolve, reject) => {
		  this._server.close((err) => {
			if (err) {
			  reject(err);
			  return;
			}
			resolve(0);
		  });
		});}
}
