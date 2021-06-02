const {
  CASE_STATUS_TYPES,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} = require('../entities/EntityConstants');
const {
  updatePetitionDetailsInteractor,
} = require('./updatePetitionDetailsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

describe('updatePetitionDetailsInteractor', () => {
  let mockCase, generalDocketReadyForTrialCase;

  beforeAll(() => {
    applicationContext.getUniqueId.mockReturnValue(
      '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    );
  });

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    generalDocketReadyForTrialCase = cloneDeep({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

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
      updatePetitionDetailsInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if attempting to update caseType to undefined', async () => {
    await expect(
      updatePetitionDetailsInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
        petitionDetails: {
          caseType: undefined,
        },
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor(applicationContext, {
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
    const result = await updatePetitionDetailsInteractor(applicationContext, {
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

  it('should call createCaseTrialSortMappingRecords if the updated case is ready for trial and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(generalDocketReadyForTrialCase);

    const result = await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
      petitionDetails: {
        ...generalDocketReadyForTrialCase,
        preferredTrialCity: 'Cheyenne, Wyoming',
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.preferredTrialCity).toBe('Cheyenne, Wyoming');
  });

  it('should call createCaseTrialSortMappingRecords if the updated case is high priority and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        highPriority: true,
        highPriorityReason: 'roll out',
      });

    const result = await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
      petitionDetails: {
        ...generalDocketReadyForTrialCase,
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.preferredTrialCity).toBe('Cheyenne, Wyoming');
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updatePetitionDetailsInteractor(applicationContext, {
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

    const result = await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
    });

    const waivedDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
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

    const result = await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: mockCase.docketNumber,
      petitionDetails: {
        ...mockCase,
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
    });

    const wavedDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
    );

    expect(wavedDocument).toBeTruthy();
  });

  it('should call createCaseTrialSortMappingRecords if the updated case is high priority, automaticBlocked, and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        automaticBlocked: true,
        automaticBlockedDate: '2019-11-30T09:10:11.000Z',
        automaticBlockedReason: 'Pending Item',
        highPriority: true,
        highPriorityReason: 'roll out',
      });

    await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
      petitionDetails: {
        ...generalDocketReadyForTrialCase,
        highPriority: true,
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('does not allow fields that do not exist on the editableFields list to be updated on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        highPriorityReason: 'roll out',
      });

    await updatePetitionDetailsInteractor(applicationContext, {
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
      petitionDetails: {
        ...generalDocketReadyForTrialCase,
        mailingDate: 'SOME NEW MAILING DATE', // attempting to change a field that does not exist in editableFields
        partyType: 'SOME NEW PARTY TYPE', // attempting to change a field that does not exist in editableFields
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.mailingDate,
    ).toEqual(MOCK_CASE.mailingDate); // does not change

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.partyType,
    ).toEqual(MOCK_CASE.partyType); // does not change
  });
});
