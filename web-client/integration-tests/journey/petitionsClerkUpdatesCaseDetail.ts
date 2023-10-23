import { Case } from '../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
const customMessages = extractCustomMessages(Case);

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
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: 'twentyoughteight',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsNoticeDate: customMessages[0],
    });

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await cerebralTest.runSequence('validateCaseDetailSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });

    await cerebralTest.runSequence('validateCaseDetailSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.irsNoticeDate')).toEqual(null);

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // irsNoticeDate - valid
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
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
      '2018-12-24T05:00:00.000Z',
    );
    expect(cerebralTest.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
  });
};
