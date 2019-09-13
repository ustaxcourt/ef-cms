export default test => {
  return it('Petitions clerk submits case to IRS holding queue', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
    });
    await test.runSequence('autoSaveCaseSequence');

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      irsNoticeDate:
        'The IRS notice date is in the future. Enter a valid date.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });
    await test.runSequence('autoSaveCaseSequence');

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');

    // check that save occurred
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T05:00:00.000Z',
    );
    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
    expect(test.getState('alertSuccess.title')).toEqual(
      'The petition is now batched for IRS service.',
    );
    expect(test.getState('caseDetailErrors')).toEqual({});
  });
};
