export default test => {
  return it('Docket clerk starts a trial session', async () => {
    await test.runSequence('gotoAddTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({
      maxCases: 'Enter the maximum number of cases allowed for this session.',
      sessionType: 'Session type is required.',
      startDate: 'Date must be in correct format.',
      term: 'Term is required.',
      trialLocation: 'Trial Location is required.',
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
      key: 'month',
      value: '12',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '12',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2025',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('form.term')).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'trialLocation',
      value: 'Birmingham, AL',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');
  });
};
