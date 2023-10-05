import { Case } from '../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = Case;

const { CASE_TYPES_MAP, PAYMENT_STATUS } = applicationContext.getConstants();

export const petitionsClerkUpdatesCaseDetail = cerebralTest => {
  return it('Petitions clerk updates case detail', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    // irsNoticeDate - invalid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/25/twentyoughteight',
      },
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[1],
    });

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/25/2018',
      },
    );

    await cerebralTest.runSequence('validateCaseDetailSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2018',
      },
    );

    await cerebralTest.runSequence('validateCaseDetailSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T00:00:00.000-05:00',
    );

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2018',
      },
    );
    await cerebralTest.runSequence('validateCaseDetailSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    // petitionPaymentDate
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      petitionPaymentDate: VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod: VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });
    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2018',
      },
    );
    await cerebralTest.runSequence('validateCaseDetailSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    //error on save
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: '',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: '',
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      caseType: VALIDATION_ERROR_MESSAGES.caseType,
      procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
    });
    expect(cerebralTest.getState('alertError')).toEqual({
      messages: [
        VALIDATION_ERROR_MESSAGES.caseType,
        VALIDATION_ERROR_MESSAGES.procedureType,
      ],
      title: 'Please correct the following errors on the page:',
    });

    //user changes value and hits save
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });
    //submit and route to case detail
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    await cerebralTest.runSequence('navigateToPathSequence', {
      path: `/case-detail/${cerebralTest.docketNumber}`,
    });
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T00:00:00.000-05:00',
    );
    expect(cerebralTest.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2018-12-24T00:00:00.000-05:00',
    );
  });
};
