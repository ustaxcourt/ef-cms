import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { checkForReadyForTrialCasesInteractor } from './checkForReadyForTrialCasesInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';
import { getReadyForTrialCases as getReadyForTrialCasesMock } from '@web-api/persistence/postgres/cases/reports/getReadyForTrialCases';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const updateCase = jest.mocked(updateCaseMock);
const getReadyForTrialCases = getReadyForTrialCasesMock as jest.Mock;

describe('checkForReadyForTrialCasesInteractor', () => {
  let mockCasesReadyForTrial;

  beforeAll(() => {
    getReadyForTrialCases.mockImplementation(() => mockCasesReadyForTrial);

    updateCase.mockResolvedValue({} as RawCase);
    getCasesByDocketNumbers.mockResolvedValue([]);
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);
  });

  it('should successfully run without error', async () => {
    mockCasesReadyForTrial = [];
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    getCasesByDocketNumbers.mockResolvedValue([MOCK_CASE]);

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(getReadyForTrialCases).toHaveBeenCalled();
  });

  it('should not check case if no case is found', async () => {
    getCaseByDocketNumber.mockResolvedValue(undefined);

    updateCase.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(getReadyForTrialCases).toHaveBeenCalled();
  });

  it("should only check cases that are 'general docket - not at issue'", async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    updateCase.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(updateCase).not.toHaveBeenCalled();
  });

  it("should not update case to 'ready for trial' if it does not have answer document", async () => {
    getCaseByDocketNumber.mockResolvedValue({
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

    updateCase.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(updateCase).not.toHaveBeenCalled();
  });

  it("should update cases to 'ready for trial' that meet requirements, removing duplicate cases before updating", async () => {
    /**
     * Requirements:
     * 1. Case has status 'General Docket - Not at Issue'
     * 2. Case has had an 'Answer' type document filed
     * 3. The cutoff(45 days) has passed since the first Answer document was submitted.
     */
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocket,
    });

    updateCase.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [
      { docketNumber: '101-20' },
      { docketNumber: '320-21' },
    ];
    getReadyForTrialCases.mockResolvedValue([
      { docketNumber: '101-20' },
      { docketNumber: '101-20' },
      { docketNumber: '101-20' },
      { docketNumber: '320-21' },
    ]);

    await checkForReadyForTrialCasesInteractor(applicationContext);

    expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: ['101-20', '320-21'],
    });
  });

  it('should attempt to lock the case before it processes it and unlock when done', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValueOnce(MOCK_LOCK);
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocket,
    });
    getCasesByDocketNumbers.mockResolvedValue([
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        ...MOCK_CASE,
        docketNumber: '320-21',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ]);

    updateCase.mockResolvedValue({} as RawCase);

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
