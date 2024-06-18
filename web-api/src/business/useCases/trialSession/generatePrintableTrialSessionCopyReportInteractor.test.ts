import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '../../../../../shared/src/test/mockTrial';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableTrialSessionCopyReportInteractor } from './generatePrintableTrialSessionCopyReportInteractor';

describe('generatePrintableTrialSessionCopyReportInteractor', () => {
  let mockUser;
  let mockTrialSession;

  beforeEach(() => {
    mockUser = {
      role: ROLES.trialClerk,
      userId: 'trialclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'https://example.com' });

    mockTrialSession = MOCK_TRIAL_REGULAR;
  });

  afterEach(() => {
    applicationContext
      .getDocumentGenerators()
      .printableWorkingCopySessionList.mockReset();
  });

  it('should throw an error when the user is not authorized to generate a printable trial session report', async () => {
    mockUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
        filters: {
          aBasisReached: true,
          continued: true,
          dismissed: true,
          recall: true,
          rule122: true,
          setForTrial: true,
          settled: true,
          showAll: true,
          statusUnassigned: true,
          takenUnderAdvisement: true,
        },
        formattedCases: [new Case(MOCK_CASE, { applicationContext })],
        formattedTrialSession: mockTrialSession,
        sessionNotes: 'session notes',
        showCaseNotes: true,
        sort: 'docket',
        userHeading: 'Yggdrasil - Session Copy',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('calls the document generator function to generate a Trial Session Working Copy PDF', async () => {
    await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      {
        filters: {
          aBasisReached: true,
          continued: true,
          dismissed: true,
          recall: true,
          rule122: true,
          setForTrial: true,
          settled: true,
          showAll: true,
          statusUnassigned: true,
          takenUnderAdvisement: true,
        },
        formattedCases: [new Case(MOCK_CASE, { applicationContext })],
        formattedTrialSession: mockTrialSession,
        sessionNotes: 'session notes',
        showCaseNotes: true,
        sort: 'docket',
        userHeading: 'Yggdrasil - Session Copy',
      },
    );

    expect(
      applicationContext.getDocumentGenerators()
        .printableWorkingCopySessionList,
    ).toHaveBeenCalledWith({
      applicationContext,
      data: {
        filters: {
          aBasisReached: true,
          continued: true,
          dismissed: true,
          recall: true,
          rule122: true,
          setForTrial: true,
          settled: true,
          showAll: true,
          statusUnassigned: true,
          takenUnderAdvisement: true,
        },
        formattedCases: [new Case(MOCK_CASE, { applicationContext })],
        formattedTrialSession: mockTrialSession,
        sessionNotes: 'session notes',
        showCaseNotes: true,
        sort: 'docket',
        userHeading: 'Yggdrasil - Session Copy',
      },
    });
  });

  it('should upload the generated trial session working copy PDF to persistence', async () => {
    await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      {
        filters: {
          aBasisReached: true,
          continued: true,
          dismissed: true,
          recall: true,
          rule122: true,
          setForTrial: true,
          settled: true,
          showAll: true,
          statusUnassigned: true,
          takenUnderAdvisement: true,
        },
        formattedCases: [new Case(MOCK_CASE, { applicationContext })],
        formattedTrialSession: mockTrialSession,
        sessionNotes: 'session notes',
        showCaseNotes: true,
        sort: 'docket',
        userHeading: 'Yggdrasil - Session Copy',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().uploadDocument,
    ).toHaveBeenCalled();
  });

  it('should return the url to the generated trial session working copy PDF', async () => {
    const results = await generatePrintableTrialSessionCopyReportInteractor(
      applicationContext,
      {
        filters: {
          aBasisReached: true,
          continued: true,
          dismissed: true,
          recall: true,
          rule122: true,
          setForTrial: true,
          settled: true,
          showAll: true,
          statusUnassigned: true,
          takenUnderAdvisement: true,
        },
        formattedCases: [new Case(MOCK_CASE, { applicationContext })],
        formattedTrialSession: mockTrialSession,
        sessionNotes: 'session notes',
        showCaseNotes: true,
        sort: 'docket',
        userHeading: 'Yggdrasil - Session Copy',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
    expect(results).toEqual('https://example.com');
  });
});
