import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUpdatesCaseStatusToReadyForTrial = cerebralTest => {
  return it('Docket clerk updates case status to General Docket - At Issue (Ready for Trial)', async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber:
        cerebralTest.docketNumberDifferentPlaceOfTrial ||
        cerebralTest.docketNumber,
    });

    const currentStatus = cerebralTest.getState('caseDetail.status');

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(cerebralTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocket,
    });

    await cerebralTest.runSequence('clearModalSequence');

    expect(cerebralTest.getState('caseDetail.status')).toEqual(currentStatus);
    expect(cerebralTest.getState('modal')).toEqual({});

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(cerebralTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );
    expect(cerebralTest.getState('modal')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
