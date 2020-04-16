import { Case } from '../../../shared/src/business/entities/cases/Case';

export const petitionsClerkVerifiesPetitionPaymentFeeOptions = test => {
  return it('Petitions clerk verifies petition payment fee options and required fields', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    expect(test.getState('form.petitionPaymentStatus')).toBeUndefined();

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.PAID,
    });

    expect(test.getState('form.orderForFilingFee')).toEqual(false);

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    expect(test.getState('validationErrors')).toMatchObject({
      petitionPaymentDate: Case.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });
    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      test.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.UNPAID,
    });

    expect(test.getState('form.orderForFilingFee')).toEqual(true);

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      test.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.WAIVED,
    });

    expect(test.getState('form.orderForFilingFee')).toEqual(false);

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    expect(test.getState('validationErrors')).toMatchObject({
      petitionPaymentWaivedDate:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentWaivedDate,
    });

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedDay',
      value: '02',
    });
    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedMonth',
      value: '02',
    });
    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedYear',
      value: '2002',
    });

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.petitionPaymentWaivedDate'),
    ).toBeUndefined();
  });
};
