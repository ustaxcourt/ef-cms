export default test => {
  return it('Petitions clerk views the Petition tab selected by default', async () => {
    expect(
      test.getState('currentViewMetadata.documentSelectedForScan'),
    ).toEqual('petitionFile');
  });
};
