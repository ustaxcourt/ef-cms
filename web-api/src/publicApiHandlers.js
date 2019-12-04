module.exports = {
  casePublicSearchLambda: require('./public-api/casePublicSearchLambda')
    .handler,
  getPublicCaseLambda: require('./public-api/getPublicCaseLambda').handler,
  getPublicDocumentDownloadUrlLambda: require('./public-api/getPublicDocumentDownloadUrlLambda')
    .handler,
};
