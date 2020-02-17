const {
  updatePetitionDetailsInteractor,
} = require('./updatePetitionDetailsInteractor');
const { Case } = require('../entities/cases/Case');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

let getCaseByCaseIdMock;
let mockCase;
const updateCaseMock = jest
  .fn()
  .mockImplementation(async ({ caseToUpdate }) => {
    return caseToUpdate;
  });
const mockUser = {
  role: User.ROLES.docketClerk,
  userId: 'docketClerk',
};

let applicationContext;

describe('updatePetitionDetailsInteractor', () => {
  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    mockUser.role = User.ROLES.docketClerk;
    getCaseByCaseIdMock = jest.fn().mockResolvedValue(mockCase);
    jest.clearAllMocks();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => mockUser,
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
        updateCase: updateCaseMock,
      }),
    };
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    mockUser.role = User.ROLES.petitioner;
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
    expect(updateCaseMock).toHaveBeenCalled();
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
    expect(updateCaseMock).toHaveBeenCalled();
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
    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });

  it('should create a docket entry when moved from unpaid to waived', async () => {
    mockCase.petitionPaymentStatus = Case.PAYMENT_STATUS.UNPAID;
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
      documentId: undefined,
      editState: undefined,
      eventCode: 'FEEW',
      filedBy: undefined,
      filingDate: '2019-11-30T09:10:11.000Z',
      index: 4,
      signatory: undefined,
      status: undefined,
    });
  });

  it('should create a docket entry when moved from unpaid to paid', async () => {
    mockCase.petitionPaymentStatus = Case.PAYMENT_STATUS.UNPAID;
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
      documentId: undefined,
      editState: undefined,
      eventCode: 'FEE',
      filedBy: undefined,
      filingDate: '2019-11-30T09:10:11.000Z',
      index: 4,
      signatory: undefined,
      status: undefined,
    });
  });
});
