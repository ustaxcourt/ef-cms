/**
 * Given a list of cases associated with the current user, creates a map of
 *  consolidated and lead cases.
 *
 * @param {object} openUserCases the list of open cases associated with the current user
 * @returns {object} casesAssociatedWithUserOrLeadCaseMap - a map of
 *  consolidated and lead cases. leadDocketNumbersAssociatedWithUser - a list of leadDocketNumbers
 *  associated with the current user. userAssociatedDocketNumbersMap - a map of open cases associated
 *  with the current user
 */
exports.processUserAssociatedCases = openUserCases => {
  let casesAssociatedWithUserOrLeadCaseMap = {};
  let userAssociatedDocketNumbersMap = {};
  let leadDocketNumbersAssociatedWithUser = [];

  for (const userCaseRecord of openUserCases) {
    const { docketNumber, leadDocketNumber } = userCaseRecord;
    const caseIsALeadCase = leadDocketNumber === docketNumber;

    userCaseRecord.isRequestingUserAssociated = true;
    userAssociatedDocketNumbersMap[docketNumber] = true;

    if (!leadDocketNumber || caseIsALeadCase) {
      casesAssociatedWithUserOrLeadCaseMap[docketNumber] = userCaseRecord;
    }
    if (
      leadDocketNumber &&
      !leadDocketNumbersAssociatedWithUser.includes(leadDocketNumber)
    ) {
      leadDocketNumbersAssociatedWithUser.push(leadDocketNumber);
    }
  }

  return {
    casesAssociatedWithUserOrLeadCaseMap,
    leadDocketNumbersAssociatedWithUser,
    userAssociatedDocketNumbersMap,
  };
};
