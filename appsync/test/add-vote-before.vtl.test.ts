import {VTLSimulator} from './helpers/vtl-simulator';
import {join} from 'path';
const templatePath = join(__dirname, '..', 'vtl', 'add-vote-before.vtl');
const velocity = new VTLSimulator(templatePath);

describe('add-vote-before.vtl', () => {
	test('should stash survey id and answer', () => {
		const rendered = velocity.render({arguments: {input: {surveyId: 'id-12345', answer: 'Something'}}});
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({});
		expect(rendered.stash.id).toBe('id-12345');
		expect(rendered.stash.answer).toBe('Something');
	});
});
