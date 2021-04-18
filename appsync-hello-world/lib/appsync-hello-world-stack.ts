import * as cdk from '@aws-cdk/core';
import { AuthorizationType, GraphqlApi, Schema, MappingTemplate, ResolvableField} from '@aws-cdk/aws-appsync';

export class AppsyncHelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloWorldSchema = new Schema();
    const helloField = 'hello';
    helloWorldSchema.addQuery(helloField, ResolvableField.string());

    const helloWorldApi = new GraphqlApi(this, 'HelloWorldApiResource', {
      name: 'HelloWorldApi',
      schema: helloWorldSchema,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      }
    });

    const mappingTemplateApiVersion = '2018-05-29';
    const localSource = helloWorldApi.addNoneDataSource('localDataSource');
    localSource.createResolver({
      typeName: 'Query',
      fieldName: helloField,
      requestMappingTemplate: MappingTemplate.fromString(JSON.stringify({ version: mappingTemplateApiVersion })),
      responseMappingTemplate: MappingTemplate.fromString(JSON.stringify('Serverless'))
    });

    new cdk.CfnOutput(this, 'API_KEY', { value: helloWorldApi.apiKey || ''});
		new cdk.CfnOutput(this, 'GRAPHQL_ENDPOINT', { value: helloWorldApi.graphqlUrl || ''});
  }
}
