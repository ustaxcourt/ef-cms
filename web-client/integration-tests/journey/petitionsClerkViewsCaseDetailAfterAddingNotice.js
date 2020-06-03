import { Case } from '../../../shared/src/business/entities/cases/Case';

export const petitionsClerkViewsCaseDetailAfterAddingNotice = test => {
  return it('Petitions clerk views case detail after adding notice', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(Case.STATUS_TYPES.new);
    expect(test.getState('caseDetail.documents').length).toEqual(3);
    expect(
      test
        .getState('caseDetail.documents')
        .find(d => d.documentTitle === 'Notice to Need a Nap'),
    ).toBeDefined();
  });
};
