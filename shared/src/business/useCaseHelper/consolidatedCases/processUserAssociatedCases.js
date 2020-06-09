/**
 * TODO
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.processUserAssociatedCases = openUserCases => {
  let casesAssociatedWithUserOrLeadCaseMap = {};
  let userAssociatedCaseIdsMap = {};
  let leadCaseIdsAssociatedWithUser = [];

  openUserCases.forEach(caseRecord => {
    const { caseId, leadCaseId } = caseRecord;
    const caseIsALeadCase = leadCaseId === caseId;

    caseRecord.isRequestingUserAssociated = true;
    userAssociatedCaseIdsMap[caseId] = true;

    if (!leadCaseId || caseIsALeadCase) {
      casesAssociatedWithUserOrLeadCaseMap[caseId] = caseRecord;
    }
    if (leadCaseId && !leadCaseIdsAssociatedWithUser.includes(leadCaseId)) {
      leadCaseIdsAssociatedWithUser.push(leadCaseId);
    }
  });

  return {
    casesAssociatedWithUserOrLeadCaseMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  };
};
