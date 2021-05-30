/*eslint @typescript-eslint/no-explicit-any: "off" */
import { AmplifyAppSyncSimulatorAuthenticationType, AmplifyAppSyncSimulator  } from 'amplify-appsync-simulator';
import { VelocityTemplate, AppSyncVTLRenderContext  } from 'amplify-appsync-simulator/lib/velocity';
import { readFileSync } from 'fs';
import { join } from 'path';
const { API_KEY } = AmplifyAppSyncSimulatorAuthenticationType;

const defaultRequestContext: any = {
	headers: {},
	requestAuthorizationMode: API_KEY
};
const defaultInfo: any = {
	fieldNodes: [],
	fragments: {},
	path: {
		key: '',
	}
};
const defaultSchemaPath = join(__dirname, '..', '..', 'graphql/schema.graphql');
export class VTLSimulator {
	vtl: any;
	constructor(filePath: string, schemaFilePath = defaultSchemaPath) {
		const content = readFileSync(filePath, 'utf8');
		const graphQLSchema = readFileSync(schemaFilePath, 'utf8');
		const simulator = new AmplifyAppSyncSimulator();
		simulator.init({
			schema: {
				content: graphQLSchema,
			},
			appSync: {
				name: 'name',
				defaultAuthenticationType: {
					authenticationType: API_KEY
				},
				additionalAuthenticationProviders: []
			},
		});
		this.vtl = new VelocityTemplate({content}, simulator);
	}
	render (templateParameters: Partial<AppSyncVTLRenderContext>): any {
		const ctxParameters = {source: {}, arguments: {input: {}}, ...templateParameters};
		return this.vtl.render(
			ctxParameters,
			defaultRequestContext, 
			defaultInfo
		);
	}
}
