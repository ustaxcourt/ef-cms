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
      termYear: 'Term year is required.',
      trialLocation: 'Trial Location is required.',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: 100,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: 'Hybrid',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'day',
      value: '12',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'year',
      value: '2025',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: 'Judge Cohen',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('form.term')).toEqual('Fall');
    expect(test.getState('form.termYear')).toEqual('2025');

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: 'Seattle, Washington',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');
  });
};
