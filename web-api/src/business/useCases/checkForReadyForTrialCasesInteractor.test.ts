import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../shared/src/test/mockLock';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { checkForReadyForTrialCasesInteractor } from './checkForReadyForTrialCasesInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getReadyForTrialCases as getReadyForTrialCasesMock } from '@web-api/persistence/postgres/cases/reports/getReadyForTrialCases';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
const getReadyForTrialCases = getReadyForTrialCasesMock as jest.Mock;

describe('checkForReadyForTrialCasesInteractor', () => {
  let mockCasesReadyForTrial;

  beforeAll(() => {
    getReadyForTrialCases.mockImplementation(() => mockCasesReadyForTrial);

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);
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

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(getReadyForTrialCases).toHaveBeenCalled();
  });

  it("should only check cases that are 'general docket - not at issue'", async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
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

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];

    await expect(
      checkForReadyForTrialCasesInteractor(applicationContext),
    ).resolves.not.toThrow();

    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
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

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

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

  it('should not call createCaseTrialSortMappingRecords if case has no trial city', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      preferredTrialCity: null,
      status: CASE_STATUS_TYPES.generalDocket,
    });

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

    mockCasesReadyForTrial = [{ docketNumber: '101-20' }];
    getReadyForTrialCases.mockResolvedValue([{ docketNumber: '101-20' }]);

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

    updateCaseAndAssociations.mockResolvedValue({} as RawCase);

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
