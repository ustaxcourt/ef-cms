import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkUpdatesCaseStatusFromCalendaredToSubmitted =
  cerebralTest => {
    return it('Docket clerk updates case status from Calendared to Submitted with an associated judge', async () => {
      cerebralTest.setState('caseDetail', {});

      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.calendared,
      );

      await cerebralTest.runSequence('openUpdateCaseModalSequence');

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'UpdateCaseModalDialog',
      );

      expect(cerebralTest.getState('modal.caseStatus')).toEqual(
        CASE_STATUS_TYPES.calendared,
      );

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'caseStatus',
        value: CASE_STATUS_TYPES.submitted,
      });

      expect(cerebralTest.getState('modal.caseStatus')).toEqual(
        CASE_STATUS_TYPES.submitted,
      );

      // the current judge on the case is selected by default.
      // set to empty string to test validation
      expect(cerebralTest.getState('modal.associatedJudge')).toEqual('Cohen');
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: '',
      });

      await cerebralTest.runSequence('submitUpdateCaseModalSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        associatedJudge: 'Select an associated judge',
      });

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: 'Judge Buch',
      });

      await cerebralTest.runSequence('submitUpdateCaseModalSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.submitted,
      );
      expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
        'Judge Buch',
      );
      expect(cerebralTest.getState('modal')).toEqual({});
    });
  };
