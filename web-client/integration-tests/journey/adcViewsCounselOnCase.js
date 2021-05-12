export const adcViewsCounselOnCase = test => {
  return it('ADC views counsel on case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('showViewPetitionerCounselModalSequence', {
      privatePractitioner: test.privatePractitioner,
    });

    expect(test.getState('modal.showModal')).toBe('ViewPetitionerCounselModal');
    expect(test.getState('modal.contact')).toEqual(test.privatePractitioner);
  });
};
