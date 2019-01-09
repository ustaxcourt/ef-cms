export default test => {
  return it('Petitions clerk submits case to IRS', async () => {
    await test.runSequence('submitToIrsSequence');
    expect(test.getState('caseDetail.status')).toEqual('general');
    expect(test.getState('alertSuccess.title')).toEqual(
      'Successfully served to IRS',
    );
  });
};
