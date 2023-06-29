export const updateACaseCaption = (cerebralTest, caseCaption) => {
  return it(`Manually changes a case caption to ${caseCaption}`, async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: caseCaption,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');
  });
};
