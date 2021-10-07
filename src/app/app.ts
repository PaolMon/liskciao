import { Application, PartialApplicationConfig, utils } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';
import { DashboardPlugin } from "@liskhq/lisk-framework-dashboard-plugin";

export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {

	// PATCH genesis block for Hello module
	const updatedGenesisBlock = utils.objects.mergeDeep({}, genesisBlock);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	updatedGenesisBlock.header.asset.accounts = updatedGenesisBlock.header.asset.accounts.map(a =>
		utils.objects.mergeDeep({}, a, {
            ciao: {
                mex: ''
            },
        }),
	);
	const app = Application.defaultApplication(updatedGenesisBlock, config);
	app.registerPlugin(DashboardPlugin);

	registerModules(app);
	registerPlugins(app);

	return app;
};
