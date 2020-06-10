import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkUpdatesCaseStatusFromCalendaredToSubmitted = test => {
  return it('Docket clerk updates case status from Calendared to Submitted with an associated judge', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.calendared,
    );

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');

    expect(test.getState('modal.caseStatus')).toEqual(
      CASE_STATUS_TYPES.calendared,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.submitted,
    });

    expect(test.getState('modal.caseStatus')).toEqual(
      CASE_STATUS_TYPES.submitted,
    );

    // the current judge on the case is selected by default.
    // set to empty string to test validation
    expect(test.getState('modal.associatedJudge')).toEqual('Judge Cohen');
    await test.runSequence('updateModalValueSequence', {
      key: 'associatedJudge',
      value: '',
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      associatedJudge: 'Select an associated judge',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'associatedJudge',
      value: 'Judge Buch',
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.submitted,
    );
    expect(test.getState('caseDetail.associatedJudge')).toEqual('Judge Buch');
    expect(test.getState('modal')).toEqual({});
  });
};
