export default test => {
  return it('Petitions clerk submits case to IRS', async () => {
    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');
    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
    expect(test.getState('alertSuccess.title')).toEqual(
      'The petition is now in the IRS Holding Queue',
    );
  });
};
