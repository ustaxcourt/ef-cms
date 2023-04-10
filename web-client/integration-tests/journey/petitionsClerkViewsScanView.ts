export const petitionsClerkViewsScanView = cerebralTest => {
  return it('Petitions clerk views the Petition tab selected by default', () => {
    expect(
      cerebralTest.getState('currentViewMetadata.documentSelectedForScan'),
    ).toEqual('petitionFile');
  });
};
