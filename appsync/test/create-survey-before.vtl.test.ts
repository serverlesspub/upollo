import {velocityInstance} from './helpers/vtl';
import {getVelocityRendererParams} from './helpers/get-velocity-render-params';
import {join} from 'path';
import {v4 as uuid} from 'uuid';
jest.mock('uuid');
const velocity = velocityInstance(join(__dirname, '..', 'vtl', 'create-survey-before.vtl')),
	uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

beforeEach(() => {
	uuid.mockImplementation(() => 'testid');
});

describe('get-survey-by-id.vtl', () => {
	test('should render a getItem template', () => {
		const {ctxValues, requestContext, info} = getVelocityRendererParams('', {}, {input: {id: 'id-12345'}}),
			rendered = velocity.render(ctxValues, requestContext, info);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({});
		expect(rendered.stash.id).toMatch(uuidRegex);
	});
});
