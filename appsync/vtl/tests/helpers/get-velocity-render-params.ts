import { AmplifyAppSyncSimulatorAuthenticationType } from 'amplify-appsync-simulator'
import { AppSyncVTLRenderContext } from 'amplify-appsync-simulator/lib/velocity'
const { AMAZON_COGNITO_USER_POOLS } = AmplifyAppSyncSimulatorAuthenticationType

type VelocityRendererParams = {
  ctxValues: AppSyncVTLRenderContext
  requestContext: any // We use any here because jwt type does not support custom tags
  info: any // We use any here because info type requires more params, and we don't need to provide them
}

type CognitoParams = {
  [key: string]: string
}

type InputParams = {
  [key: string]: any
}

type IAdditionalContextParams = {
  [key: string]: any
}

export const getVelocityRendererParams = (
  username: string, 
  customCognitoParams: CognitoParams, 
  inputParams: InputParams = {}, 
  additionalContextParams: IAdditionalContextParams = {}
): VelocityRendererParams => {
  const ctxValues = {
    arguments: {
      input: {},
      ...inputParams,
    },
    source: {},
    ...additionalContextParams,
  }
  // We use any here because jwt type does not support custom tags
  const requestContext: any = {
    headers: {},
    requestAuthorizationMode: AMAZON_COGNITO_USER_POOLS,
    jwt: {
      issuer: 'issuer',
      sub: 'sub',
      'cognito:username': username,
      username,
      ...customCognitoParams,
    },
  }
  // We use any here because info type requires more params, and we don't need to provide them
  const info: any = {
    fieldNodes: [],
    fragments: {},
    path: {
      key: '',
    },
  }

  return {
    ctxValues,
    requestContext,
    info,
  }
}
