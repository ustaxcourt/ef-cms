import { CaseQC } from '../../shared/src/business/entities/cases/CaseQC';
import {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('docket clerk edits a petition payment fee', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a taxpayer and create a case', async () => {
    caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('login as the docketclerk and edit the case petition payment fee', async () => {
    await cerebralTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(
      cerebralTest.getState('caseDetail.petitionPaymentDate'),
    ).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.petitionPaymentStatus')).toEqual(
      PAYMENT_STATUS.UNPAID,
    );
    expect(
      cerebralTest.getState('caseDetail.docketEntries'),
    ).not.toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      hasVerifiedIrsNotice:
        CaseQC.VALIDATION_ERROR_MESSAGES.hasVerifiedIrsNotice,
      petitionPaymentDate: CaseQC.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        CaseQC.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('caseDetail.petitionPaymentStatus')).toEqual(
      PAYMENT_STATUS.PAID,
    );
    expect(cerebralTest.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2001-01-01T05:00:00.000Z',
    );

    expect(
      cerebralTest
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
