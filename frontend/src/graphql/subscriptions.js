export const SurveyVotes = `
subscription SurveyVotes ($id: String) {
  surveyVotes(id: $id) {
    id
    answers {
      answer
      count
    }
    question
  }
}
`;
