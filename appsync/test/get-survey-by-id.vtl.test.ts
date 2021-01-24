import {velocityInstance} from './helpers/vtl';
import {getVelocityRendererParams} from './helpers/get-velocity-render-params';
import {join} from 'path';
const velocity = velocityInstance(join(__dirname, '..', 'vtl', 'get-survey-by-id.vtl'));
describe('get-survey-by-id.vtl', () => {
	test('should render a getItem template', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {id: 'id-12345'}),
			rendered = velocity.render(ctxValues, requestContext, info);
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
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {}, {stash: {id: 'id-12345'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
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
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {id: 'id-12345'}, {stash: {id: 'id-45667'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
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
