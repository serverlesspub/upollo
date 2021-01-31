import {velocityInstance} from './helpers/vtl';
import {getVelocityRendererParams} from './helpers/get-velocity-render-params';
import {join} from 'path';
const velocity = velocityInstance(join(__dirname, '..', 'vtl', 'get-answers-by-survey-id.vtl'));
describe('get-answers-by-survey-id.vtl', () => {
	test('should render query by argument id', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {id: 'id-12345'}),
			rendered = velocity.render(ctxValues, requestContext, info);

		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			consistentRead: true,
			query: {
				expression: 'PK = :pk AND begins_with(SK, :sk)',
				expressionValues: {
					':pk': {
						S: 'SURVEY#id-12345'
					},
					':sk': {
						S: 'ANSWER#'
					}
				},
			},
			operation: 'Query',
			version: '2017-02-28'
		});

		expect(rendered.stash).toEqual({});
	});

	test('should render query by source id', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {}, { source: {id: 'id-12345'}}),
			rendered = velocity.render(ctxValues, requestContext, info);

		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			consistentRead: true,
			query: {
				expression: 'PK = :pk AND begins_with(SK, :sk)',
				expressionValues: {
					':pk': {
						S: 'SURVEY#id-12345'
					},
					':sk': {
						S: 'ANSWER#'
					}
				},
			},
			operation: 'Query',
			version: '2017-02-28'
		});

		expect(rendered.stash).toEqual({});
	});
});