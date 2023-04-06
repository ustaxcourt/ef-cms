export const judgeActivityReportHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const currentUser = applicationContext.getCurrentUser();

  const isChambersUser = currentUser.role === USER_ROLES.chambers;
  if (isChambersUser) {
    const allJudgeChambers = applicationContext
      .getUtilities()
      .getJudgesChambers();

    const judgeChambers = Object.values(allJudgeChambers).find(
      chambers => chambers.section === currentUser.section,
    );

    currentUser.judgeFullName = judgeChambers.judgeFullName;
  }

  return {
    closedCases: {
      Closed: 9,
      'Closed-Dismissed': 11,
    },
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(currentUser.judgeFullName),
    opinionsIssued: [
      { documentType: 'Memorandum Opinion', eventCode: 'MOP', total: 76 },
      { documentType: 'T.C. Opinion', eventCode: 'TCOP', total: 13 },
    ],
    ordersIssued: [{ documentType: 'Order', eventCode: 'O', total: 4 }],
    trialSessionsHeld: {
      Hybrid: 10,
      'Motion/Hearing': 3,
      Regular: 0,
      Small: 3,
      Special: 9,
    },
  };
};
