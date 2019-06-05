export default test => {
  return it('Docket clerk starts a trial session', async () => {
    //await test.runSequence('goToSubmitTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({
      maxCases: 'Enter number of cases allowed.',
      sessionType: 'Enter Session Type.',
      startDate: 'Enter Start Date.',
      term: 'Enter selection for Term.',
      trialLocation: 'Select a Trial Location.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'maxCases',
      value: 100,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'sessionType',
      value: 'Regular',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'startDate',
      value: '2019-12-01T00:00:00.000Z',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'term',
      value: 'Fall',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'trialLocation',
      value: 'Birmingham, AL',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');
  });
};
