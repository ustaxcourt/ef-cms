export const petitionsClerkRemovesRespondentFromCase = test => {
  return it('Petitions clerk removes a respondent from a case', async () => {
    expect(test.getState('caseDetail.irsPractitioners').length).toEqual(2);

    await test.runSequence('openEditIrsPractitionersModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'irsPractitioners.1.removeFromCase',
      value: true,
    });

    await test.runSequence('submitEditIrsPractitionersModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.irsPractitioners').length).toEqual(1);
  });
};
