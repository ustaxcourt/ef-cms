module.exports = {
  createCaseMessageLambda: require('./messages/createCaseMessageLambda')
    .createCaseMessageLambda,
  getCaseMessageLambda: require('./messages/getCaseMessageLambda')
    .getCaseMessageLambda,
  getInboxCaseMessagesForUserLambda: require('./messages/getInboxCaseMessagesForUserLambda')
    .getInboxCaseMessagesForUserLambda,
};
