module.exports = {
  assignWorkItemsLambda: require('./workitems/assignWorkItemsLambda')
    .assignWorkItemsLambda,
  completeWorkItemLambda: require('./workitems/completeWorkItemLambda')
    .completeWorkItemLambda,
  forwardWorkItemLambda: require('./workitems/forwardWorkItemLambda')
    .forwardWorkItemLambda,
  getWorkItemLambda: require('./workitems/getWorkItemLambda').getWorkItemLambda,
  setWorkItemAsReadLambda: require('./workitems/setWorkItemAsReadLambda')
    .setWorkItemAsReadLambda,
};
