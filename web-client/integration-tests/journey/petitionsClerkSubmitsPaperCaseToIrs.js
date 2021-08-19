import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export const petitionsClerkSubmitsPaperCaseToIrs = cerebralTest => {
  return it('Petitions clerk submits paper case to IRS', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
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

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

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
        expect(document.servedParties.length).toEqual(1);
        expect(document.servedParties[0].role).toEqual(ROLES.irsSuperuser);
      }
    }
  });
};
