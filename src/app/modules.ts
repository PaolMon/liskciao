/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { CiaoModule } from "./modules/ciao/ciao_module";

export const registerModules = (app: Application): void => {

    app.registerModule(CiaoModule);
};
