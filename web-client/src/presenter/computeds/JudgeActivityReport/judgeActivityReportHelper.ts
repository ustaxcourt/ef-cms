export const judgeActivityReportHelper = (get, applicationContext) => {
  return {
    activityReportResults: {
      closedCases: {
        Closed: 9,
        'Closed-Dismissed': 11,
      },
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
    },
  };
};
