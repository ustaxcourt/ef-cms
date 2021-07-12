import { Case } from '../../../shared/src/business/entities/cases/Case';
import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PAYMENT_STATUS } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesPetitionPaymentFeeOptions = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies petition payment fee options and required fields', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');

    expect(cerebralTest.getState('form.petitionPaymentStatus')).toBeUndefined();

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    expect(cerebralTest.getState('form.orderForFilingFee')).toEqual(false);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      petitionPaymentDate: Case.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });
    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.UNPAID,
    });

    expect(cerebralTest.getState('form.orderForFilingFee')).toEqual(true);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.WAIVED,
    });

    expect(cerebralTest.getState('form.orderForFilingFee')).toEqual(false);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      applicationForWaiverOfFilingFeeFile:
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      petitionPaymentWaivedDate:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentWaivedDate,
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedDay',
      value: '02',
    });
    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedMonth',
      value: '02',
    });
    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'paymentDateWaivedYear',
      value: '2002',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.petitionPaymentWaivedDate'),
    ).toBeUndefined();
  });
};
