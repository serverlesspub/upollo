export const GetSurvey = `
query GetSurvey($surveyId: String!) {
  getSurveyById(id: $surveyId) {
    id
    answers {
      answer
      count
    }
    question
  }
}
`;
