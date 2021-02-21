import React, {useEffect, useState } from 'react';
import { Progress } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams } from 'react-router-dom';

import { GetSurvey } from '../graphql/queries';

function SurveyResults () {
  const { surveyId } = useParams();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [total, setTotal] = useState(0);

  
  useEffect(() => {
    async function getSurvey(){
      const res = await API.graphql(graphqlOperation(GetSurvey, {surveyId}));
      const {getSurveyById} = res.data;
      const currentTotal = getSurveyById.answers.reduce((a, c) => a += c.count, 0);
      console.log(currentTotal)
      setTotal(currentTotal);
      setQuestion(getSurveyById.question);
      setAnswers(getSurveyById.answers);
    }
    getSurvey();
  }, [surveyId])

  return (
    <>
      <h1>{question}</h1>
      {answers.map(a =>(<div key={a.answer}>{a.answer}<Progress  percent={a.count*100/total} status="active"/></div>))}
      <h3>Total Votes: <strong>{total}</strong></h3>
    </>
  );
}


export default SurveyResults;
