import { loginAs, setupTest, uploadPetition } from './helpers';

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

    expect(test.getState('caseDetail').petitionPaymentDate).toBeUndefined();
    expect(test.getState('caseDetail').petitionPaymentStatus).toEqual(
      'Not Paid',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: 'Paid',
    });

    await test.runSequence('updatePetitionFeePaymentSequence');

    expect(test.getState('validationErrors')).toEqual({
      petitionPaymentDate: 'Enter a payment date',
      petitionPaymentMethod: 'Enter payment method',
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

    await test.runSequence('updatePetitionFeePaymentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail').petitionPaymentStatus).toEqual('Paid');
    expect(test.getState('caseDetail').petitionPaymentDate).toEqual(
      '2001-01-01T05:00:00.000Z',
    );
  });
});
