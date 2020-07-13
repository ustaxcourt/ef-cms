/**
 * Given a list of cases associated with the current user, creates a map of
 *  consolidated and lead cases.
 *
 * @param {object} openUserCases the list of open cases associated with the current user
 * @returns {object} casesAssociatedWithUserOrLeadCaseMap - a map of
 *  consolidated and lead cases. leadCaseIdsAssociatedWithUser - a list of leadCaseIds
 *  associated with the current user. userAssociatedCaseIdsMap - a map of open cases associated
 *  with the current user
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
