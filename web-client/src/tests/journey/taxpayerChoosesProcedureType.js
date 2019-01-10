export default test => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoFilePetitionSequence');
    expect(test.getState('trialCities').length).toEqual(0);
    await test.runSequence('getTrialCitiesSequence', {
      procedureType: 'small',
    });
    expect(test.getState('trialCities').length).toBeGreaterThan(0);
    expect(test.getState('trialCities')[0].city).not.toBeNull();
    test.setState('petition.preferredTrialCity', { state: 'XX', city: 'test' });
    await test.runSequence('getTrialCitiesSequence', {
      procedureType: 'large',
    });
    expect(test.getState('trialCities').length).toBeGreaterThan(0);
    expect(test.getState('trialCities')[0].city).not.toBeNull();
    expect(test.getState('petition.preferredTrialCity')).toEqual('');
  });
};
