export const CreateSurvey = `
mutation CreateSurvey ($question: String!, $answers:[String!]) {
  createSurvey(input: {answers: $answers, question: $question}) {
    id
  }
}
`;
