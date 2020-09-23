const {
  updatePetitionDetailsInteractor,
} = require('./updatePetitionDetailsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { PAYMENT_STATUS } = require('../entities/EntityConstants');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

describe('updatePetitionDetailsInteractor', () => {
  let mockCase;

  beforeAll(() => {
    applicationContext.getUniqueId.mockReturnValue(
      '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    );
  });

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updatePetitionDetailsInteractor({
        applicationContext,
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if attempting to update caseType to undefined', async () => {
    await expect(
      updatePetitionDetailsInteractor({
        applicationContext,
        docketNumber: mockCase.docketNumber,
        petitionDetails: {
          caseType: undefined,
        },
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.UNPAID);
  });

  it('should call updateCase with the updated case payment information (when paid) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentDate).toEqual('2019-11-30T09:10:11.000Z');
    expect(result.petitionPaymentMethod).toEqual('check');
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.PAID);
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });

  it('should create a docket entry when moved from unpaid to waived', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      });

    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
    });

    // TODO 636
    const waivedDocument = result.docketEntries.find(
      entry => entry.description === 'Filing Fee Waived',
    );

    expect(waivedDocument).toBeTruthy();
  });

  it('should create a docket entry when moved from unpaid to paid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      });

    const result = await updatePetitionDetailsInteractor({
      applicationContext,
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
    });

    // TODO 636
    const wavedDocument = result.docketEntries.find(
      entry => entry.description === 'Filing Fee Paid',
    );

    expect(wavedDocument).toBeTruthy();
  });
});
