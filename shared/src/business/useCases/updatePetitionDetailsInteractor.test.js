const {
  updatePetitionDetailsInteractor,
} = require('./updatePetitionDetailsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

describe('updatePetitionDetailsInteractor', () => {
  let mockCase;

  beforeAll(() => {
    applicationContext.getUniqueId.mockReturnValue('unique-id-1');
  });

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);

    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updatePetitionDetailsInteractor({
        applicationContext,
        caseId: mockCase.caseId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      petitionDetails: {
        petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.UNPAID);
  });

  it('should call updateCase with the updated case payment information (when paid) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      petitionDetails: {
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentDate).toEqual('2019-11-30T09:10:11.000Z');
    expect(result.petitionPaymentMethod).toEqual('check');
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.PAID);
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      petitionDetails: {
        petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });

  it('should create a docket entry when moved from unpaid to waived', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...mockCase,
      petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
    });

    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      petitionDetails: {
        petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
    });

    expect(result.docketRecord).toContainEqual({
      description: 'Filing Fee Waived',
      docketRecordId: 'unique-id-1',
      documentId: undefined,
      editState: undefined,
      entityName: 'DocketRecord',
      eventCode: 'FEEW',
      filedBy: undefined,
      filingDate: '2019-11-30T09:10:11.000Z',
      index: 4,
      signatory: undefined,
      status: undefined,
    });
  });

  it('should create a docket entry when moved from unpaid to paid', async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...MOCK_CASE,
      petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
    });

    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
      petitionDetails: {
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
      },
    });

    expect(result.docketRecord).toContainEqual({
      description: 'Filing Fee Paid',
      docketRecordId: 'unique-id-1',
      documentId: undefined,
      editState: undefined,
      entityName: 'DocketRecord',
      eventCode: 'FEE',
      filedBy: undefined,
      filingDate: '2019-11-30T09:10:11.000Z',
      index: 4,
      signatory: undefined,
      status: undefined,
    });
  });
});
