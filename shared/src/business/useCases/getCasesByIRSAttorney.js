/**
 * getCasesByIRSAttorney
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByIRSAttorney = ({ irsAttorneyId, applicationContext }) => {
  return applicationContext.persistence.getCasesByIRSAttorney({
    irsAttorneyId,
    applicationContext,
  });
};
