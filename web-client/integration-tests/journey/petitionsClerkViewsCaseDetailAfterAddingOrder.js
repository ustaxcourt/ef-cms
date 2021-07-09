import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsCaseDetailAfterAddingOrder = cerebralTest => {
  return it('Petitions clerk views case detail after adding order', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.new,
    );
    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(4);
    expect(
      cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.documentTitle === 'Order of Dismissal and Decision'),
    ).toBeDefined();
  });
};
