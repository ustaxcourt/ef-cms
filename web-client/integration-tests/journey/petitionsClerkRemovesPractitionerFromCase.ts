export const petitionsClerkRemovesPractitionerFromCase = cerebralTest => {
  return it('Petitions clerk removes a practitioner from a case', async () => {
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(2);

    const barNumber = cerebralTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await cerebralTest.runSequence('openRemovePetitionerCounselModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await cerebralTest.runSequence('removePetitionerCounselFromCaseSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(1);
  });
};
