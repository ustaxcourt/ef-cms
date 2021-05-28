export const petitionerNavigatesToEditContact = test => {
  it('petitioner views primary contact edit page', async () => {
    await test.runSequence('gotoContactEditSequence', {
      docketNumber: test.getState('caseDetail.docketNumber'),
    });

    const currentPage = test.getState('currentPage');
    expect(currentPage).toEqual('ContactEdit');
  });
};
