import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { checkForReadyForTrialCasesInteractor } from './checkForReadyForTrialCasesInteractor';

describe('checkForReadyForTrialCasesInteractor', () => {
  let mockCasesReadyForTrial;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockImplementation(() => mockCasesReadyForTrial);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);
  });

  it('should successfully run without error', async () => {
    mockCasesReadyForTrial = [];
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getReadyForTrialCases,
    ).toHaveBeenCalled();
  });

  it('should not check case if no case is found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(undefined);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getReadyForTrialCases,
    ).toHaveBeenCalled();
  });

  it("should only check cases that are 'general docket - not at issue'", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it("should not update case to 'ready for trial' if it does not have answer document", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
            documentType: 'Petition',
            processingStatus: 'pending',
            userId: 'petitioner',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it("should update cases to 'ready for trial' that meet requirements, removing duplicate cases before updating", async () => {
    /**
     * Requirements:
     * 1. Case has status 'General Docket - Not at Issue'
     * 2. Case has had an 'Answer' type document filed
     * 3. The cutoff(45 days) has passed since the first Answer document was submitted.
     */
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [
      { docketNumber: '101-20' },
      { docketNumber: '320-21' },
    ];
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockReturnValue([
        { docketNumber: '101-20' },
        { docketNumber: '101-20' },
        { docketNumber: '101-20' },
        { docketNumber: '320-21' },
      ]);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalledTimes(2);
  });

  it('should not call createCaseTrialSortMappingRecords if case has no trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockReturnValue([{ docketNumber: '101-20' }]);

    await checkForReadyForTrialCasesInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('should attempt to lock the case before it processes it and unlock when done', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValueOnce(MOCK_LOCK);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    applicationContext.getPersistenceGateway().updateCase.mockReturnValue({});

    mockCasesReadyForTrial = [
      { docketNumber: '101-20' },
      { docketNumber: '320-21' },
    ];
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockReturnValue([
        { docketNumber: '101-20' },
        { docketNumber: '320-21' },
      ]);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(2);

    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledTimes(3);
  });
});
