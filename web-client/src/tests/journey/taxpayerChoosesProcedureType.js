export default test => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoStartCaseSequence');
    expect(test.getState('trialCities').length).toEqual(0);
    await test.runSequence('getTrialCitiesSequence', {
      value: 'small',
    });
    expect(test.getState('trialCities').length).toBeGreaterThan(0);
    expect(test.getState('trialCities')[0].city).not.toBeNull();
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
    await test.runSequence('getTrialCitiesSequence', {
      value: 'large',
    });
    expect(test.getState('trialCities').length).toBeGreaterThan(0);
    expect(test.getState('trialCities')[0].city).not.toBeNull();
    expect(test.getState('form.preferredTrialCity')).toEqual('');
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
  });
};
