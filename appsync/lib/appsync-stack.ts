import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import {setUpApi} from './survey-api';

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
			api = setUpApi(this, surveyTable);
			
		new cdk.CfnOutput(this, 'Api Key', { value: api.apiKey || ''});
	}
}
