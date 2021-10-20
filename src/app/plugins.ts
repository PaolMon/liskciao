/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { RestApiPlugin } from "./plugins/rest_api/rest_api_plugin";

// @ts-expect-error Unused variable error happens here until at least one module is registered
export const registerPlugins = (app: Application): void => {

    app.registerPlugin(RestApiPlugin);
};
