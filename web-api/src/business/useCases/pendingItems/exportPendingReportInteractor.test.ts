import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { exportPendingReportInteractor } from '@web-api/business/useCases/pendingItems/exportPendingReportInteractor';

describe('exportPendingReportInteractor', () => {
  let mockUser;

  const judge = 'Colvin';

  const mockFoundDocuments = [
    {
      associatedJudge: 'Judge Judgey',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-68',
      docketNumberWithSuffix: '456-68',
      documentTitle: 'Test Document Best',
      receivedAt: '2022-02-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    },
    {
      associatedJudge: 'Judge Judger',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-69',
      docketNumberWithSuffix: '456-69',
      documentTitle: 'Test Document Best',
      receivedAt: '2021-03-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    },
    {
      associatedJudge: 'Judge Foley',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-67',
      docketNumberWithSuffix: '456-67',
      documentTitle: 'Test Document Best',
      receivedAt: '2020-03-04T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Colvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45',
      documentTitle: 'Test Document Title',
      receivedAt: '1990-01-01T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Judgeson',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '123-49',
      docketNumberWithSuffix: '123-49',
      documentTitle: 'Test Document Title',
      receivedAt: '1999-01-01T12:00:00.000Z',
      status: CASE_STATUS_TYPES.generalDocket,
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption Two, Petitioner(s)',
      docketNumber: '234-56',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      docketNumberWithSuffix: '234-56S',
      documentType: 'Test Document Type',
      receivedAt: '2020-02-02T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
    {
      associatedJudge: 'Judge Alvin',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '345-67',
      docketNumberWithSuffix: '345-67',
      documentTitle: 'Test Document Title',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
    {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Test Caption, Petitioner',
      docketNumber: '456-78',
      docketNumberWithSuffix: '456-78',
      documentTitle: 'Fear and Trembling',
      leadDocketNumber: '456-78',
      receivedAt: '2020-03-03T12:00:00.000Z',
      status: CASE_STATUS_TYPES.onAppeal,
    },
  ];

  beforeAll(() => {
    applicationContext.getStorageClient.mockReturnValue({
      upload: jest.fn((params, callback) => callback()),
    });

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockResolvedValue({
        foundDocuments: mockFoundDocuments,
      });
  });

  beforeEach(() => {
    mockUser = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  afterEach(() => {
    applicationContext.getDocumentGenerators().pendingReport.mockReset();
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    mockUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      exportPendingReportInteractor(applicationContext, {
        judge: 'Colvin',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call fetchPendingItems from persistence and return a csv string of the results', async () => {
    const results = await exportPendingReportInteractor(applicationContext, {
      judge,
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalledWith({ applicationContext, judge });
    expect(
      applicationContext.getUtilities().formatPendingItem,
    ).toHaveBeenCalledTimes(mockFoundDocuments.length);

    expect(results)
      .toEqual(`Docket No.;Date Filed;Case Title;Filings and Proceedings;Case Status;Judge
456-68;02/04/22;Test Caption;Test Document Best;New;Judgey
456-69;03/04/21;Test Caption;Test Document Best;New;Judger
456-67;03/04/20;Test Caption;Test Document Best;General Docket - Not at Issue;Foley
123-45;01/01/90;Test Caption;Test Document Title;General Docket - Not at Issue;Colvin
123-49;01/01/99;Test Caption;Test Document Title;General Docket - Not at Issue;Judgeson
234-56S;02/02/20;Test Caption Two;Test Document Type;On Appeal;Buch
345-67;03/03/20;Test Caption;Test Document Title;On Appeal;Alvin
456-78;03/03/20;Test Caption;Fear and Trembling;On Appeal;Buch`);
  });

  it('alt library test', async () => {
    const results = await exportPendingReportInteractor(applicationContext, {
      judge,
      method: 'csvs',
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalledWith({ applicationContext, judge });
    expect(
      applicationContext.getUtilities().formatPendingItem,
    ).toHaveBeenCalledTimes(mockFoundDocuments.length);

    expect(results).toBeDefined();
  });
});
