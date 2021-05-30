import {VTLSimulator} from './helpers/vtl-simulator';
import {join} from 'path';
const templatePath = join(__dirname, '..', 'vtl', 'create-survey.vtl');
const velocity = new VTLSimulator(templatePath);

describe('create-survey.vtl', () => {
	test('should render a template without answers', () => {
		const ctxValues = {
				arguments: {input: {question: 'Who?'}}, 
				stash: {id: 'id-12345'}
			},
			rendered = velocity.render(ctxValues);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			operation: 'BatchPutItem', 
			tables: { 
				'{{TABLE_NAME}}': [
					{ 
						PK: {S: 'SURVEY#id-12345'}, 
						SK: {S: 'SURVEY#METADATA'},
						question: {S: 'Who?'},
						id: {S: 'id-12345'}
					}
				]
			}, 
			version: '2018-05-29'
		});
		expect(rendered.stash).toEqual({id: 'id-12345'});
	});
	test('should render a template with answers', () => {
		const ctxValues =  {
				arguments: {
					input: {
						answers: ['Foo', 'Bar', 'Baz'], 
						question: 'Who?'
					}, 
				},
				stash: {id: 'id-12345'}
			},
			rendered = velocity.render(ctxValues);
		expect(rendered.errors).toEqual([]);
		expect(rendered.result).toEqual({
			operation: 'BatchPutItem', 
			tables: { 
				'{{TABLE_NAME}}': [
					{ 
						PK: {S: 'SURVEY#id-12345'}, 
						SK: {S: 'SURVEY#METADATA'},
						question: {S: 'Who?'},
						id: {S: 'id-12345'}
					},
					{
						PK: {S: 'SURVEY#id-12345'}, 
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
						PK: {S: 'SURVEY#id-12345'}, 
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
						PK: {S: 'SURVEY#id-12345'}, 
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
		expect(rendered.stash).toEqual({id: 'id-12345'});
	});

});
