import React, {useEffect, useState} from 'react';
import { Button } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams } from 'react-router-dom';

import { GetSurvey } from '../graphql/queries';
import { AddVote } from '../graphql/mutations';

function SurveyVote () {
  const { surveyId } = useParams();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);

  
  useEffect(() => {
    async function getSurvey(){
      const res = await API.graphql(graphqlOperation(GetSurvey, {surveyId}));
      const {getSurveyById} = res.data;
      setQuestion(getSurveyById.question);
      setAnswers(getSurveyById.answers);
    }
    getSurvey();
  }, [surveyId])

  async function handleVote(answer){
    const res = await API.graphql(graphqlOperation(AddVote, {surveyId, answer}));
    console.log(res);
    const {addVote} = res.data;
  }

  return (
    <>
      <h1>{question}</h1>
      {answers.map(a =>(<Button key={a.answer} onClick={() => handleVote(a.answer)}>{a.answer}</Button>))}
    </>
  );
}


export default SurveyVote;
