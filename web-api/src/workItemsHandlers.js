module.exports = {
  assignWorkItemsLambda: require('./workitems/assignWorkItemsLambda').handler,
  completeWorkItemLambda: require('./workitems/completeWorkItemLambda').handler,
  forwardWorkItemLambda: require('./workitems/forwardWorkItemLambda').handler,
  getWorkItemLambda: require('./workitems/getWorkItemLambda').handler,
  setWorkItemAsReadLambda: require('./workitems/setWorkItemAsReadLambda')
    .handler,
};
