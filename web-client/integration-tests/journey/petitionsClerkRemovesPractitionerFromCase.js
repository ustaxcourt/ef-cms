export const petitionsClerkRemovesPractitionerFromCase = test => {
  return it('Petitions clerk removes a practitioner from a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(2);

    const barNumber = test.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await test.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    await test.runSequence('openRemovePetitionerCounselModalSequence');

    expect(test.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await test.runSequence('removePetitionerCounselFromCaseSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(1);
  });
};
