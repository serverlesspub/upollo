import React, {useEffect, useState } from 'react';
import { Progress, Row, Col } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams } from 'react-router-dom';

import { GetSurvey } from '../graphql/queries';
import { SurveyVotes } from '../graphql/subscriptions';

function SurveyResults () {
  const { surveyId } = useParams();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [total, setTotal] = useState();

  function updateValues({answers, question}){
    const total = answers.reduce((a, c) => a += c.count, 0);
    setTotal(total);
    setQuestion(question);
    setAnswers(answers);
  }

  useEffect(() => {
    async function getSurvey(){
      const res = await API.graphql({
        ...graphqlOperation(GetSurvey, {surveyId}),
        authMode: 'API_KEY'
      });
      updateValues(res.data.getSurveyById);
    }
    getSurvey();
    const subscriber = API.graphql({
      ...graphqlOperation(SurveyVotes, {id: surveyId}), 
      authMode: 'API_KEY'
    }).subscribe({
      next: ({value}) => {
        updateValues(value.data.surveyVotes);
      },
      error: error => console.warn(error)
    });
    return () => {
      subscriber.unsubscribe();
    }
  }, [surveyId])

  return (
    <Row gutter={[16, 24]} justify="space-around" align="top" style={{ minHeight: '500px', marginTop: '40px' }}>
      <Col span={12}>
        <h1>{question}</h1>
        {answers.map(a =>(
          <Row key={a.answer}>{a.answer}<Progress percent={Number(a.count*100/total).toFixed(2)} status="active"/></Row>
        ))}
        <h3>Total Votes: <strong>{total}</strong></h3>
      </Col>
    </Row>
  );
}


export default SurveyResults;
