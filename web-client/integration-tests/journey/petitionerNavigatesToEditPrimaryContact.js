export default test => {
  it('petitioner views primary contact edit page', async () => {
    await test.runSequence('gotoPrimaryContactEditSequence', {
      docketNumber: test.getState('caseDetail.docketNumber'),
    });

    const currentPage = test.getState('currentPage');
    expect(currentPage).toEqual('PrimaryContactEdit');
  });
};
