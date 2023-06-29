export const petitionsClerkRemovesRespondentFromCase = cerebralTest => {
  return it('Petitions clerk removes a respondent from a case', async () => {
    expect(cerebralTest.getState('caseDetail.irsPractitioners').length).toEqual(
      2,
    );

    const barNumber = cerebralTest.getState(
      'caseDetail.irsPractitioners.1.barNumber',
    );

    await cerebralTest.runSequence('gotoEditRespondentCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openRemoveRespondentCounselModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'RemoveRespondentCounselModal',
    );

    await cerebralTest.runSequence('removeRespondentCounselFromCaseSequence');

    expect(cerebralTest.getState('caseDetail.irsPractitioners').length).toEqual(
      1,
    );
  });
};
