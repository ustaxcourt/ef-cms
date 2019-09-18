module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda').handler,
  archiveDraftDocumentLambda: require('./documents/archiveDraftDocumentLambda')
    .handler,
  createWorkItemLambda: require('./workitems/createWorkItemLambda').handler,
  serveSignedStipDecisionLambda: require('./cases/serveSignedStipDecisionLambda')
    .handler,
  signDocumentLambda: require('./documents/signDocumentLambda').handler,
};
