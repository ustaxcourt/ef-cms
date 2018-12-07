/**
 * getCasesByIRSAttorney
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesForRespondent = ({ irsAttorneyId, applicationContext }) => {
  return applicationContext.getPersistenceGateway().getCasesForRespondent({
    irsAttorneyId,
    applicationContext,
  });
};
