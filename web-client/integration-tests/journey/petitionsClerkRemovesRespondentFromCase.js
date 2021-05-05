export const petitionsClerkRemovesRespondentFromCase = test => {
  return it('Petitions clerk removes a respondent from a case', async () => {
    expect(test.getState('caseDetail.irsPractitioners').length).toEqual(2);

    const barNumber = test.getState('caseDetail.irsPractitioners.1.barNumber');

    await test.runSequence('gotoEditRespondentCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openRemoveRespondentCounselModalSequence');

    expect(test.getState('modal.showModal')).toBe(
      'RemoveRespondentCounselModal',
    );

    await test.runSequence('removeRespondentCounselFromCaseSequence');

    expect(test.getState('caseDetail.irsPractitioners').length).toEqual(1);
  });
};
