import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkUpdatesCaseStatusToReadyForTrial = test => {
  return it('Docket clerk updates case status to General Docket - At Issue (Ready for Trial)', async () => {
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
      value: CASE_STATUS_TYPES.generalDocket,
    });

    await test.runSequence('clearModalSequence');

    expect(test.getState('caseDetail.status')).toEqual(currentStatus);
    expect(test.getState('modal')).toEqual({});

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');
    expect(test.getState('modal.caseStatus')).toEqual(currentStatus);

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(test.getState('caseDetail.associatedJudge')).toEqual(CHIEF_JUDGE);
    expect(test.getState('modal')).toEqual({});
  });
};
