/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesForRespondent = ({ respondentId, applicationContext }) => {
  return applicationContext.getPersistenceGateway().getCasesForRespondent({
    respondentId,
    applicationContext,
  });
};
