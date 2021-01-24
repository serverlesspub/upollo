import { AmplifyAppSyncSimulator, AmplifyAppSyncAuthenticationProviderConfig, AmplifyAppSyncSimulatorAuthenticationType } from 'amplify-appsync-simulator'
import { readFileSync } from 'fs'
import { join } from 'path'

const { AMAZON_COGNITO_USER_POOLS } = AmplifyAppSyncSimulatorAuthenticationType

export const getAppSyncSimulator = (): AmplifyAppSyncSimulator => {
  const simulator = new AmplifyAppSyncSimulator()
  const additionalAuthenticationProviders: AmplifyAppSyncAuthenticationProviderConfig[] = []
  simulator.init({
    schema: {
      content: readFileSync(join('..', 'shared', 'graphql/schema.gql'), 'utf8'),
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
  })
  return simulator
}
