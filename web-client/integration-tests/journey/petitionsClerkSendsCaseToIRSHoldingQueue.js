import { waitForRouter } from '../helpers';

export default test => {
  return it('Petitions clerk sends case to holding queue', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('New');

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');
    await waitForRouter();
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
  });
};
