import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import { AWSAppSyncClient, AUTH_TYPE } from 'aws-appsync';
import {config} from 'aws-sdk';
import gql from 'graphql-tag';
import 'isomorphic-fetch';

const dc = new DocumentClient();
const tableName: string = process.env.DATABASE || '';

const appsyncClient = new AWSAppSyncClient({
  url: process.env.GRAPHQLENDPOINT || '',
  region: process.env.REGION || '',
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: config.credentials!
  },
  disableOffline: true
});

const query = gql(`
query GetSurvey($surveyId: String!) {
  getSurveyById(id: $surveyId) {
    id
    answers {
      answer
      count
    }
    question
  }
}`);

describe('get-survey-by-id integration', () => {

  let surveyId: string;

  beforeEach(async () => {
    surveyId = Date.now().toString();
    const allItems: any = await dc.scan({
			TableName: tableName
		}).promise();
		await Promise.all(allItems.Items.map((item: any) => dc.delete({
			TableName: tableName,
			Key: {
				PK: item.PK,
				SK: item.SK
			}
		}).promise()));
  });

  test('can read stack outputs', async () => {
    await dc.batchWrite({
      RequestItems: {
        [tableName]: [
          {
            PutRequest: {
              Item: {
                PK: `SURVEY#${surveyId}`,
                SK: `SURVEY#METADATA`,
                question: 'someQuestion',
                id: surveyId
              }
            }
          },
          {
            PutRequest: {
              Item: {
                PK: `SURVEY#${surveyId}`,
                SK: `ANSWER#yes`,
                answer: 'yes',
                count: 0
              }
            }
          },
          {
            PutRequest: {
              Item: {
                PK: `SURVEY#${surveyId}`,
                SK: `ANSWER#no`,
                answer: 'no',
                count: 0
              }
            }
          }
        ]
      }
    }).promise();
    const response: any = await appsyncClient.query({ query: query, fetchPolicy: 'network-only', variables: {surveyId}});
    expect(response.data.getSurveyById).toMatchObject({id: surveyId, question: 'someQuestion'});
  });
});
