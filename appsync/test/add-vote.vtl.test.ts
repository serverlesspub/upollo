import { join } from 'path';
import {VTLSimulator} from './helpers/vtl-simulator';
const templatePath = join(__dirname, '..', 'vtl', 'add-vote.vtl');
const velocity = new VTLSimulator(templatePath);
describe('add-vote.vtl', () => {
	test('should render a template for updates', () => {
		const ctxValues = {stash: {id: 's1234', answer: 'Something'} },
			rendered = velocity.render(ctxValues),
			voteUUIDRegex = /^VOTE#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
			tsRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
			uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			'version': '2018-05-29',
			'operation': 'TransactWriteItems',
			'transactItems': [
				{
					'table': '{{TABLE_NAME}}',
					'operation': 'PutItem',
					'key': {
						'PK': { S: 'SURVEY#s1234' },
						'SK': { S: expect.stringMatching(voteUUIDRegex) }
					},
					'attributeValues': {
						'id': { S: expect.stringMatching(uuidRegex) },
						'ts': { S: expect.stringMatching(tsRegex) }
					}
				},
				{
					'table': '{{TABLE_NAME}}',
					'operation': 'UpdateItem',
					'key': {
						'PK': { S: 'SURVEY#s1234' },
						'SK': { S: 'ANSWER#Something' },
					},
					'update': {
						'expression': 'SET #count = if_not_exists(#count, :zero) + :inc',
						'expressionValues': {
							':zero': { N: '0' },
							':inc': { N: '1' }
						},
						'expressionNames': {
							'#count': 'count'
						}
					},
					'condition': {
						'expression': 'attribute_exists(PK)'
					}
				}
			]
		}
		);
		expect(rendered.stash).toEqual({id: 's1234', answer: 'Something'});
	});

});
