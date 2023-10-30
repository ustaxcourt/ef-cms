import { Case } from '../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
const customMessages = extractCustomMessages(Case.VALIDATION_RULES);

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
      irsNoticeDate: customMessages.irsNoticeDate[0],
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
      petitionPaymentDate: customMessages.petitionPaymentDate[0],
      petitionPaymentMethod: customMessages.petitionPaymentMethod[0],
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
      caseType: customMessages.caseType[0],
      procedureType: customMessages.procedureType[0],
    });
    expect(cerebralTest.getState('alertError')).toEqual({
      messages: [customMessages.caseType[0], customMessages.procedureType[0]],
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
