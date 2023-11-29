import { Case } from '../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { PAYMENT_STATUS } from '../../../shared/src/business/entities/EntityConstants';
import { PaperPetition } from '../../../shared/src/business/entities/cases/PaperPetition';

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

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentDate',
        toFormat: FORMATS.ISO,
        value: '01/01/2001',
      },
    );

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
        PaperPetition.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      petitionPaymentWaivedDate:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentWaivedDate,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentWaivedDate',
        toFormat: FORMATS.ISO,
        value: '02/02/2002',
      },
    );

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
