import { AmplifyAppSyncSimulator, AmplifyAppSyncAuthenticationProviderConfig, AmplifyAppSyncSimulatorAuthenticationType } from 'amplify-appsync-simulator';
import { readFileSync } from 'fs';
import { join } from 'path';

const { AMAZON_COGNITO_USER_POOLS } = AmplifyAppSyncSimulatorAuthenticationType;

export const getAppSyncSimulator = (): AmplifyAppSyncSimulator => { // eslint-disable-line one-var
	const simulator = new AmplifyAppSyncSimulator(),
	 additionalAuthenticationProviders: AmplifyAppSyncAuthenticationProviderConfig[] = [];
	simulator.init({
		schema: {
			content: readFileSync(join(__dirname, '..', '..', 'graphql/schema.graphql'), 'utf8'),
		},
		appSync: {
			name: 'name',
			defaultAuthenticationType: {
				authenticationType: AMAZON_COGNITO_USER_POOLS,
				cognitoUserPoolConfig: {
					AppIdClientRegex: 'string',
				},
			},
			additionalAuthenticationProviders,
		},
	});
	return simulator;
};
