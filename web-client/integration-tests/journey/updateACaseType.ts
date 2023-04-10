export const updateACaseType = (cerebralTest, caseType) => {
  return it(`Manually changes a case type to ${caseType}`, async () => {
    await cerebralTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: caseType,
    });

    await cerebralTest.runSequence('updateCaseDetailsSequence');
  });
};
