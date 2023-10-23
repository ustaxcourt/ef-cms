import { Case } from '../../../shared/src/business/entities/cases/Case';
import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PAYMENT_STATUS } from '../../../shared/src/business/entities/EntityConstants';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
const customMessages = extractCustomMessages(Case.VALIDATION_RULES);
const caseInternalCustomMessages = extractCustomMessages(
  CaseInternal.VALIDATION_RULES,
);

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
      petitionPaymentDate: customMessages.petitionPaymentDate[0],
      petitionPaymentMethod: customMessages.petitionPaymentMethod[0],
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
        caseInternalCustomMessages.applicationForWaiverOfFilingFeeFile[0],
      petitionPaymentWaivedDate: customMessages.petitionPaymentWaivedDate[0],
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
