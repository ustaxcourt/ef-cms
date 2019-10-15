export default test => {
  return it('Petitions clerk removes a respondent from a case', async () => {
    expect(test.getState('caseDetail.respondents').length).toEqual(2);

    await test.runSequence('openEditRespondentsModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'respondents.1.removeFromCase',
      value: true,
    });

    await test.runSequence('submitEditRespondentsModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.respondents').length).toEqual(1);
  });
};
