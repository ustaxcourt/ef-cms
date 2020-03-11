export default test => {
  return it('Petitions clerk removes a practitioner from a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(2);

    await test.runSequence('openEditPractitionersModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.0.removeFromCase',
      value: true,
    });

    await test.runSequence('submitEditPractitionersModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(1);
  });
};
