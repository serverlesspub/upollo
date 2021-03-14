import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import {setUpApi} from './set-up-api';
import {setUpAuthentication} from './set-up-authentication';
export class AppsyncStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);
		const surveyTable = new dynamodb.Table(this, 'SurveyTable', {
				partitionKey: {
					name: 'PK',
					type: dynamodb.AttributeType.STRING
				},
				sortKey: {
					name: 'SK',
					type: dynamodb.AttributeType.STRING
				},
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				encryption: dynamodb.TableEncryption.DEFAULT
			}),
			userPool = setUpAuthentication(this, 'https://localhost:3000/auth'),
			api = setUpApi(this, surveyTable, userPool);

		new cdk.CfnOutput(this, 'API_KEY', { value: api.apiKey || ''});
		new cdk.CfnOutput(this, 'GRAPHQL_ENDPOINT', { value: api.graphqlUrl || ''});
		new cdk.CfnOutput(this, 'REGION', { value: this.region || ''});
		new cdk.CfnOutput(this, 'DATABASE', { value: surveyTable.tableName || ''});
	}
}
