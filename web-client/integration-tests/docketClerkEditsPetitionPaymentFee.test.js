import { loginAs, setupTest, uploadPetition } from './helpers';

import { Case } from '../../shared/src/business/entities/cases/Case';

const test = setupTest();

describe('Create a work item', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  let caseDetail;

  it('login as a tax payer and create a case', async () => {
    await loginAs(test, 'petitioner');
    caseDetail = await uploadPetition(test);
  });

  it('login as the docketclerk and edit the case petition payment fee', async () => {
    await loginAs(test, 'docketclerk');

    await test.runSequence('gotoEditPetitionDetailsSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('caseDetail.petitionPaymentDate')).toBeUndefined();
    expect(test.getState('caseDetail.petitionPaymentStatus')).toEqual(
      Case.PAYMENT_STATUS.UNPAID,
    );
    expect(test.getState('caseDetail.docketRecord')).not.toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.PAID,
    });

    await test.runSequence('updatePetitionDetailsSequence');

    expect(test.getState('validationErrors')).toEqual({
      petitionPaymentDate: Case.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await test.runSequence('updatePetitionDetailsSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.petitionPaymentStatus')).toEqual(
      Case.PAYMENT_STATUS.PAID,
    );
    expect(test.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2001-01-01T05:00:00.000Z',
    );

    expect(test.getState('caseDetail.docketRecord')).toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });
  });
});
