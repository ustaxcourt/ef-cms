import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUpdatesCaseStatusToClosed = test => {
  return it('Docket clerk updates case status to closed', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const currentStatus = test.getState('caseDetail.status');

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');

    expect(test.getState('modal.caseStatus')).toEqual(currentStatus);

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.closed,
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    await refreshElasticsearchIndex();

    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.closed,
    );

    expect(test.getState('modal')).toEqual({});
  });
};
