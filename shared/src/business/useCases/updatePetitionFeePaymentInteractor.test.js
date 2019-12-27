const {
  updatePetitionFeePaymentInteractor,
} = require('./updatePetitionFeePaymentInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

const getCaseByCaseIdMock = jest.fn().mockResolvedValue(MOCK_CASE);
const updateCaseMock = jest
  .fn()
  .mockImplementation(async ({ caseToUpdate }) => {
    return caseToUpdate;
  });
const mockUser = {
  role: User.ROLES.petitionsClerk,
  userId: 'petitionsClerk',
};

const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => mockUser,
  getPersistenceGateway: () => ({
    getCaseByCaseId: getCaseByCaseIdMock,
    updateCase: updateCaseMock,
  }),
};

describe('updatePetitionFeePaymentInteractor', () => {
  beforeEach(() => {
    mockUser.role = User.ROLES.petitionsClerk;
    jest.clearAllMocks();
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    mockUser.role = User.ROLES.petitioner;
    await expect(
      updatePetitionFeePaymentInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updatePetitionFeePaymentInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
    });
    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.UNPAID);
  });

  it('should call updateCase with the updated case payment information (when paid) and return the updated case', async () => {
    const result = await updatePetitionFeePaymentInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      petitionPaymentDate: '2019-11-30T09:10:11.000Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
    });
    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentDate).toEqual('2019-11-30T09:10:11.000Z');
    expect(result.petitionPaymentMethod).toEqual('check');
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.PAID);
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updatePetitionFeePaymentInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
    });
    expect(updateCaseMock).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(Case.PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });
});
