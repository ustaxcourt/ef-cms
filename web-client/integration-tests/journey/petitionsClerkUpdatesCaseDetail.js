import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export default test => {
  return it('Petitions clerk updates case detail', async () => {
    expect(test.getState('caseDetailErrors')).toEqual({});

    // irsNoticeDate - invalid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: 'twentyoughteight',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('navigateToReviewSavedPetitionSequence');

    expect(test.getState('caseDetailErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[1],
    });

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('navigateToReviewSavedPetitionSequence');
    await test.runSequence('saveSavedCaseForLaterSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(null);

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    // petitionPaymentDate
    await test.runSequence('updateCaseValueSequence', {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.PAID,
    });
    await test.runSequence('navigateToReviewSavedPetitionSequence');

    expect(test.getState('caseDetailErrors')).toEqual({
      petitionPaymentDate: VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod: VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual({});

    //error on save
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: '',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'procedureType',
      value: '',
    });

    await test.runSequence('navigateToReviewSavedPetitionSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      caseType: VALIDATION_ERROR_MESSAGES.caseType,
      procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
    });
    expect(test.getState('alertError')).toEqual({
      messages: [
        VALIDATION_ERROR_MESSAGES.caseType,
        VALIDATION_ERROR_MESSAGES.procedureType,
      ],
      title: 'Please correct the following errors on the page:',
    });

    //user changes value and hits save
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });
    //submit and route to case detail
    await test.runSequence('navigateToReviewSavedPetitionSequence');
    await test.runSequence('saveSavedCaseForLaterSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
    expect(test.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
  });
};
