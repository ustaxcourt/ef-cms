export const adcViewsCounselOnCase = cerebralTest => {
  return it('ADC views counsel on case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('showViewPetitionerCounselModalSequence', {
      privatePractitioner: cerebralTest.privatePractitioner,
    });

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'ViewPetitionerCounselModal',
    );
    expect(cerebralTest.getState('modal.contact')).toEqual(
      cerebralTest.privatePractitioner,
    );
  });
};
