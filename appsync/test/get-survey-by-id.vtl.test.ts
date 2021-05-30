import {VTLSimulator} from './helpers/vtl-simulator';
import {join} from 'path';
const templatePath = join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl');
const velocity = new VTLSimulator(templatePath);

describe('get-survey-by-id.vtl', () => {
	test('should render a getItem template', () => {
		const ctxValues = { arguments: {id: 'id-12345'} },
			rendered = velocity.render(ctxValues);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			consistentRead: true,
			key: {
				PK: {
					S: 'SURVEY#id-12345',
				},
				SK: {
					S: 'SURVEY#METADATA',
				},
			},
			operation: 'GetItem',
			version: '2017-02-28'
		});

		expect(rendered.stash).toEqual({});
	});
	test('should render a getItem template by ID from stash', () => {
		const ctxValues = {stash: {id: 'id-12345'} },
			rendered = velocity.render(ctxValues);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			consistentRead: true,
			key: {
				PK: {
					S: 'SURVEY#id-12345',
				},
				SK: {
					S: 'SURVEY#METADATA',
				},
			},
			operation: 'GetItem',
			version: '2017-02-28'
		});

		expect(rendered.stash).toEqual({id: 'id-12345'});

	});
	test('uses input instead of stash if both defined', () => {
		const ctxValues = {
				arguments: {id: 'id-12345'}, 
				stash: {id: 'id-45667'}
			},
			rendered = velocity.render(ctxValues);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			consistentRead: true,
			key: {
				PK: {
					S: 'SURVEY#id-12345',
				},
				SK: {
					S: 'SURVEY#METADATA',
				},
			},
			operation: 'GetItem',
			version: '2017-02-28'
		});

		expect(rendered.stash).toEqual({id: 'id-45667'});
	});
});
