import {join} from 'path';

import {Stack} from '@aws-cdk/core';
import {Table} from '@aws-cdk/aws-dynamodb';
import {MappingTemplate, GraphqlApi, Schema, AuthorizationType, Resolver, AppsyncFunction} from '@aws-cdk/aws-appsync';

import {loadAndReplace} from './load-and-replace';

export function setUpApi(stack: Stack, surveyTable: Table) : GraphqlApi {
	const api = new GraphqlApi(stack, 'GraphqlApi', {
			name: 'Survey',
			schema: Schema.fromAsset(join(__dirname, '..', 'graphql', 'schema.graphql')),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: AuthorizationType.API_KEY,
					apiKeyConfig: {}
				}
			}
		}),
		surveyDataSource = api.addDynamoDbDataSource('surveyTableSource', surveyTable),
		createSurveyBatchPutFunction = new AppsyncFunction(stack, 'createSurveyBatchPutFunction', {
			api, 
			dataSource: surveyDataSource,
			name: 'createSurveyBatchPut',
			requestMappingTemplate: MappingTemplate.fromString(
				loadAndReplace(
					join(__dirname, '..', 'vtl', 'create-survey.vtl'),
					{TABLE_NAME: surveyTable.tableName}
				)),
			responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
		}),
		getSurveyByIdFromStashFunction = new AppsyncFunction(stack, 'getSurveyByIdFromStashFunction', {
			api, 
			dataSource: surveyDataSource,
			name: 'getSurveyByIdFromStash',
			requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl')),
			responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
		});

	surveyDataSource.createResolver({
		typeName: 'Query',
		fieldName: 'getSurveyById',
		requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl')),
		responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
	});
	surveyDataSource.createResolver({
		typeName: 'Query',
		fieldName: 'getAnswersBySurveyId',
		requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'get-answers-by-survey-id.vtl')),
		responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
	});
	surveyDataSource.createResolver({
		typeName: 'Survey',
		fieldName: 'answers',
		requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'get-answers-by-survey-id.vtl')),
		responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
	});
	surveyDataSource.createResolver({
		typeName: 'Mutation',
		fieldName: 'addVote',
		requestMappingTemplate: MappingTemplate.fromString(
			loadAndReplace(
				join(__dirname, '..', 'vtl', 'add-vote.vtl'),
				{TABLE_NAME: surveyTable.tableName}
			)),
		responseMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'add-vote-tx-response.vtl'))
	});
	new Resolver(stack, 'createSurveyPipelineResolver', {
		api: api,
		typeName: 'Mutation',
		fieldName: 'createSurvey',
		pipelineConfig: [createSurveyBatchPutFunction, getSurveyByIdFromStashFunction],
		requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'create-survey-before.vtl')),
		responseMappingTemplate: MappingTemplate.fromFile(join(__dirname, '..', 'vtl', 'create-survey-after.vtl'))
	});
	return api;
}
