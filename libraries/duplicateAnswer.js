const duplicateAnswer = async (answers) => {
  let seen = new Set();

  return answers.some((answer) => {
    if (seen.has(answer.questionId)) {
      return true;
    }
    seen.add(answer.questionId);
  });
};
export default duplicateAnswer;
