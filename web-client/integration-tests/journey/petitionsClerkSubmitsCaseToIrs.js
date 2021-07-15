import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export const petitionsClerkSubmitsCaseToIrs = cerebralTest => {
  return it('Petitions clerk submits case to IRS', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2018',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '24',
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    await cerebralTest.runSequence('serveCaseToIrsSequence');

    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // check that save occurred
    expect(cerebralTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T05:00:00.000Z',
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    //check that documents were served
    const documents = cerebralTest.getState('caseDetail.docketEntries');
    for (const document of documents) {
      if (!document.isMinuteEntry) {
        expect(document.servedAt).toBeDefined();
      }
    }
  });
};
