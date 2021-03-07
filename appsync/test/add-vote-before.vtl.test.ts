import {velocityInstance} from './helpers/vtl';
import {getVelocityRendererParams} from './helpers/get-velocity-render-params';
import {join} from 'path';
const velocity = velocityInstance(join(__dirname, '..', 'vtl', 'add-vote-before.vtl'));

describe('add-vote-before.vtl', () => {
	test('should stash survey id and answer', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {input: {surveyId: 'id-12345', answer: 'Something'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({});
		expect(rendered.stash.id).toBe('id-12345');
		expect(rendered.stash.answer).toBe('Something');
	});
});
