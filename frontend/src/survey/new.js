import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';

import { Form, Input, Button, Space, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { CreateSurvey } from '../graphql/mutations';

function NewSurvey(){
  let history = useHistory();
  const [form] = Form.useForm();

  const onFinish = async values => {
    const {question, answers} = values;
    try {
      const res = await API.graphql(graphqlOperation(CreateSurvey, {question: question, answers: answers.map(a => a.answer)}));
      history.push(`/survey/${res.data.createSurvey.id}`);
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <Row gutter={[16, 24]} justify="space-around" align="top" style={{ minHeight: '500px', marginTop: '40px' }}>
      <Col span={12}>
        <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
          <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Missing question' }]}>
            <Input />
          </Form.Item>
          <Form.List name="answers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Row>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.question !== curValues.question || prevValues.answer !== curValues.answer
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label="Answer"
                            name={[field.name, 'answer']}
                            fieldKey={[field.fieldKey, 'answer']}
                            rules={[{ required: true, message: 'Missing answer' }]}
                          >
                            <Input />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add answer
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Col>
  </Row>
  )
}

export default withAuthenticator(NewSurvey);
