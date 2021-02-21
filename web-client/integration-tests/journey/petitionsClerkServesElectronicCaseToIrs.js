export const petitionsClerkServesElectronicCaseToIrs = test => {
  return it(`Petitions clerk serves an electronically-filed case (${test.docketNumber}) to IRS`, async () => {
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('saveSavedCaseForLaterSequence');

    await test.runSequence('openConfirmServeToIrsModalSequence');

    await test.runSequence('serveCaseToIrsSequence');

    expect(test.getState('currentPage')).toEqual('WorkQueue');
  });
};
