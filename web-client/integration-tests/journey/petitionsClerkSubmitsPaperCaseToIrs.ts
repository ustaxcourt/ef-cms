import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';

export const petitionsClerkSubmitsPaperCaseToIrs = cerebralTest => {
  return it('Petitions clerk submits paper case to IRS', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2050',
      },
    );
    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2018',
      },
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsNoticeDate: Case.VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2017',
      },
    );

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
      '2017-12-24T00:00:00.000-05:00',
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    //check that documents were served
    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    for (const docketEntry of docketEntries) {
      if (
        !docketEntry.isMinuteEntry &&
        docketEntry.eventCode !== 'NOTR' &&
        !docketEntry.isDraft
      ) {
        expect(docketEntry.servedAt).toBeDefined();
        expect(docketEntry.servedParties.length).toEqual(1);
        expect(docketEntry.servedParties[0].role).toEqual(ROLES.irsSuperuser);
      } else if (docketEntry.eventCode === 'NOTR') {
        expect(docketEntry.servedAt).toBeDefined();
        expect(docketEntry.servedParties.length).toBeGreaterThan(0);
        for (const party of docketEntry.servedParties) {
          expect(party.role).toBeUndefined();
        }
      }
    }
  });
};
