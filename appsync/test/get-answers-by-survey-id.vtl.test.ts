
import {VTLSimulator} from './helpers/vtl-simulator';
import {join} from 'path';
const templatePath = join(__dirname, '..', 'vtl', 'get-answers-by-survey-id.vtl');
const velocity = new VTLSimulator(templatePath);

describe('get-answers-by-survey-id.vtl', () => {
	test('should render query by argument id', () => {
		const ctxValues =  {arguments: {id: 'id-12345'}},
			rendered = velocity.render(ctxValues);

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
		const ctxValues = {source: {id: 'id-12345'}},
			rendered = velocity.render(ctxValues);

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
