import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import {MappingTemplate, GraphqlApi, Schema, AuthorizationType} from '@aws-cdk/aws-appsync';
import {join} from 'path';
import {readFileSync} from 'fs';

const loadAndReplace = (filePath: string, replacements: any): string  => { //eslint-disable-line @typescript-eslint/no-explicit-any
	const data = readFileSync(filePath, 'utf8');
	return data.replace(/(?:{{)([^}]+)(?:}})/g, (_, v) => replacements[v]);
};
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
			api = new GraphqlApi(this, 'GraphqlApi', {
				name: 'Survey',
				schema: Schema.fromAsset(join(__dirname, '..', 'graphql', 'schema.graphql')),
				authorizationConfig: {
					defaultAuthorization: {
						authorizationType: AuthorizationType.API_KEY,
						apiKeyConfig: {}
					}
				}
			}),
			surveyDataSource = api.addDynamoDbDataSource('surveyTableSource', surveyTable);

		surveyDataSource.createResolver({
			typeName: 'Query',
			fieldName: 'getSurveyById',
			requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl')),
			responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
		});

		surveyDataSource.createResolver({
			typeName: 'Mutation',
			fieldName: 'createSurvey',

			requestMappingTemplate: MappingTemplate.fromString(
				loadAndReplace(
					join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl'),
					{TABLE_NAME: surveyTable.tableName}
				)),
			responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
		});

		new cdk.CfnOutput(this, 'Api Key', { value: api.apiKey || ''});
	}
}
