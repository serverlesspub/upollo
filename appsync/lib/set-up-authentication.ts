import { Duration, Stack, CfnOutput } from '@aws-cdk/core';
import { CfnIdentityPool, UserPool, UserPoolClientIdentityProvider, OAuthScope, IUserPool } from '@aws-cdk/aws-cognito';
//import { Role, WebIdentityPrincipal } from '@aws-cdk/aws-iam';


export function setUpAuthentication(stack: Stack, oauthUrl: string): IUserPool {
	const userPool = new UserPool(stack, 'UserPool', {
			autoVerify: {email: true},
			signInAliases: {username: true, email: true},
			standardAttributes: {email: {required: true, mutable: true}},
			signInCaseSensitive: false,
			selfSignUpEnabled: true
		}),
		client = userPool.addClient('app-client-web', {
			preventUserExistenceErrors: true,
			generateSecret: false,
			refreshTokenValidity: Duration.days(30),
			supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
					implicitCodeGrant: true
				},
				scopes: [OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
				callbackUrls: [oauthUrl]
			}
		}),
		identityPool = new CfnIdentityPool(stack, 'IdentityPool', {
			allowUnauthenticatedIdentities: false,
			cognitoIdentityProviders: [{
				clientId: client.userPoolClientId,
				providerName: userPool.userPoolProviderName
			}]
		});

	new CfnOutput(stack, 'COGNITO_USER_POOL_ID', { value: userPool.userPoolId});
	new CfnOutput(stack, 'COGNITO_IDENTITY_POOL_ID', { value: identityPool.ref});
	new CfnOutput(stack, 'COGNITO_USER_POOL_CLIENT_ID', { value: client.userPoolClientId});

	return userPool;


	/*
		unauthenticatedPricipal = new WebIdentityPrincipal('cognito-identity.amazonaws.com', {
			'StringEquals': { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
			'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' }
		}),
		unauthenticatedRole = new Role(stack, 'UnauthenticatedRole', {
			assumedBy: unauthenticatedPricipal
		});*/

	/*api.grant(unauthenticatedRole, IamResource.custom('types/Mutation/fields/addVote'), 'appsync:GraphQL');
	api.grant(unauthenticatedRole, IamResource.custom('types/Query/fields/getSurveyById'), 'appsync:GraphQL');

	new CfnIdentityPoolRoleAttachment(stack, 'RoleAttachment', {
		identityPoolId: identityPool.ref,
		roles: {
			'unauthenticated': unauthenticatedRole.roleArn
		}
	});*/

}
