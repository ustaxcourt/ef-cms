export const petitionerNavigatesToEditSecondaryContact = test => {
  it('petitioner views secondary contact edit page', async () => {
    await test.runSequence('gotoSecondaryContactEditSequence', {
      docketNumber: test.getState('caseDetail.docketNumber'),
    });

    const currentPage = test.getState('currentPage');
    expect(currentPage).toEqual('SecondaryContactEdit');
  });
};
