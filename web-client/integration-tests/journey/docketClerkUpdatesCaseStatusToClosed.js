import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUpdatesCaseStatusToClosed = cerebralTest => {
  return it('Docket clerk updates case status to closed', async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const currentStatus = cerebralTest.getState('caseDetail.status');

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(cerebralTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.closed,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.closed,
    );

    expect(cerebralTest.getState('modal')).toEqual({});
  });
};
