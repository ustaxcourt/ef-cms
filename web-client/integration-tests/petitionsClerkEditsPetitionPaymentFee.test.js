import { Case } from '../../shared/src/business/entities/cases/Case';
import {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('petitions clerk edits a petition payment fee', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;

  loginAs(test, 'petitioner@example.com');

  it('login as a taxpayer and create a case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(test, 'petitionsclerk@example.com');

  it('login as the petitions clerk and edit the case petition payment fee', async () => {
    await test.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('caseDetail.petitionPaymentDate')).toBeUndefined();
    expect(test.getState('caseDetail.petitionPaymentStatus')).toEqual(
      PAYMENT_STATUS.UNPAID,
    );
    expect(test.getState('caseDetail.docketEntries')).not.toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    await test.runSequence('updateCaseDetailsSequence');

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

    await test.runSequence('updateCaseDetailsSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.petitionPaymentStatus')).toEqual(
      PAYMENT_STATUS.PAID,
    );
    expect(test.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2001-01-01T05:00:00.000Z',
    );

    expect(
      test
        .getState('caseDetail.docketEntries')
        .find(
          r => r.documentType === MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
        ),
    ).toMatchObject({
      documentTitle: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });
  });
});
