import {velocityInstance} from './helpers/vtl';
import {getVelocityRendererParams} from './helpers/get-velocity-render-params';
import {join} from 'path';
const velocity = velocityInstance(join(__dirname, '..', 'vtl', 'create-survey.vtl'));
describe('create-survey.vtl', () => {
	const surveyUUIDRegex = /^SURVEY#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
	test('should render a template without answers', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {input: {question: 'Who?'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			operation: 'BatchPutItem', 
			tables: { 
				consistentRead: true, 
				'{{TABLE_NAME}}': [
					{ 
						PK: {S: expect.stringContaining('SURVEY#')}, 
						SK: {S: 'SURVEY#METADATA'},
						question: {S: 'Who?'}
					}
				]
			}, 
			version: '2018-05-29'
		});
		expect(rendered.stash).toEqual({});
	});
	test('should render a template with answers', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {input: {answers: ['Foo', 'Bar', 'Baz'], question: 'Ko je?'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			operation: 'BatchPutItem', 
			tables: { 
				consistentRead: true, 
				'{{TABLE_NAME}}': [
					{ 
						PK: {S: expect.stringContaining('SURVEY#')}, 
						SK: {S: 'SURVEY#METADATA'},
						question: {S: 'Ko je?'}
					},
					{
						PK: {
							S: expect.stringMatching(surveyUUIDRegex),
						},
						SK: {
							S: 'ANSWER#Foo',
						},
						answer: {
							S: 'Foo',
						},
						count: {
							N: '0',
						},
					},
					{
						PK: {
							S: expect.stringContaining('SURVEY#'),
						},
						SK: {
							S: 'ANSWER#Bar',
						},
						answer: {
							S: 'Bar',
						},
						count: {
							N: '0',
						},
					},
					{
						PK: {
							S: expect.stringContaining('SURVEY#'),
						},
						SK: {
							S: 'ANSWER#Baz',
						},
						answer: {
							S: 'Baz',
						},
						count: {
							N: '0',
						}
					}
				]
			}, 
			version: '2018-05-29'
		});
		expect(rendered.stash).toEqual({});
	});

});
