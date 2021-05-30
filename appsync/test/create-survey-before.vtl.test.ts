import {VTLSimulator} from './helpers/vtl-simulator';
import {join} from 'path';
const templatePath = join(__dirname, '..', 'vtl', 'create-survey-before.vtl');
const velocity = new VTLSimulator(templatePath);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('create-survey-before.vtl', () => {
	test('should stash survey id', () => {
		const rendered = velocity.render({arguments: {input: {id: 'id-12345'}}});
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({});
		expect(rendered.stash.id).toMatch(uuidRegex);
	});
});
