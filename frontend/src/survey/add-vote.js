import React, {useEffect, useState} from 'react';
import { Button } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams, useHistory } from 'react-router-dom';

import { GetSurvey } from '../graphql/queries';
import { AddVote } from '../graphql/mutations';

function SurveyVote () {
  const history = useHistory();
  const { surveyId } = useParams();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);

  
  useEffect(() => {
    async function getSurvey(){
      const res = await API.graphql({
        ...graphqlOperation(GetSurvey, {surveyId}),
        authMode: 'API_KEY'
      });
      const {getSurveyById} = res.data;
      setQuestion(getSurveyById.question);
      setAnswers(getSurveyById.answers);
    }
    getSurvey();
  }, [surveyId]);

  async function handleVote(answer){
    try {
      await API.graphql({
        ...graphqlOperation(AddVote, {surveyId, answer}), 
        authMode: 'API_KEY'
      });
      history.push(`/survey/${surveyId}/results`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <h1>{question}</h1>
      {answers.map(a =>(<Button key={a.answer} onClick={() => handleVote(a.answer)}>{a.answer}</Button>))}
    </>
  );
}


export default SurveyVote;
