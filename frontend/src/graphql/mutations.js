export const CreateSurvey = `
mutation CreateSurvey ($question: String!, $answers: [String!]) {
  createSurvey(input: {answers: $answers, question: $question}) {
    id
  }
}
`;

export const AddVote = `
mutation AddVote ($surveyId: String!, $answer: String!) {
  addVote(input: {answer: $answer, surveyId: $surveyId}){
    id
    answers {
      answer
      count
    }
    question
  }
}
`;
