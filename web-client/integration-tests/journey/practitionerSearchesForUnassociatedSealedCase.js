export const practitionerSearchesForUnassociatedSealedCase = cerebralTest => {
  return it('practitioner searches for unassociated sealed case', async () => {
    cerebralTest.setState('caseDetail', {});
    const sealedSeedCaseDocketNumber = '105-20';

    await cerebralTest.runSequence('gotoDashboardSequence');

    cerebralTest.setState('header.searchTerm', sealedSeedCaseDocketNumber);
    await cerebralTest.runSequence('submitCaseSearchSequence', {});

    expect(cerebralTest.getState('currentPage')).toEqual('PublicCaseDetail');

    expect(cerebralTest.getState('caseDetail.isSealed')).toBeTruthy();
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    //this user should NOT see any case details because they are not associated with the case
    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
