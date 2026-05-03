import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { getRecentFilingsForUserAction } from './getRecentFilingsForUserAction';

describe('getRecentFilingsForUserAction', () => {
  const mockRecentFilings = [
    {
      docketNumber: '123-45',
      filedDate: '2023-01-15T10:30:00.000Z',
      document: 'Petition',
      caseTitle: 'Test Case Title',
      docketEntryId: 'abc-123',
      isFileAttached: true,
      eventCode: 'P',
      isStricken: false,
      isSealed: false,
      servedAt: '2023-01-15T11:00:00.000Z',
      caseIsSealed: false,
      inConsolidatedGroup: false,
      isLeadCase: true,
      isDraft: false,
      isRequestingUserAssociated: true,
    },
    {
      docketNumber: '678-90',
      filedDate: '2023-01-14T14:20:00.000Z',
      document: 'Motion for Summary Judgment',
      caseTitle: 'Another Test Case',
      docketEntryId: 'def-456',
      isFileAttached: false,
      eventCode: 'MPSJ',
      isStricken: null,
      isSealed: null,
      caseIsSealed: null,
      inConsolidatedGroup: true,
      isLeadCase: false,
      consolidatedIconTooltipText: 'Consolidated case',
      isDraft: true,
      isRequestingUserAssociated: false,
    },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    applicationContext.getHttpClient().get = jest.fn().mockResolvedValue({
      data: mockRecentFilings,
    });
  });

  it('should return recent filings when the interactor succeeds', async () => {
    const { output } = await runAction(getRecentFilingsForUserAction, {
      modules: { presenter },
      state: {},
    });

    expect(output.recentFilings).toEqual(mockRecentFilings);
    expect(applicationContext.getHttpClient().get).toHaveBeenCalledWith(
      expect.stringContaining('/cases/recent-filings'),
      expect.any(Object),
    );
  });

  it('should return empty array when no recent filings are found', async () => {
    applicationContext.getHttpClient().get = jest.fn().mockResolvedValue({
      data: [],
    });

    const { output } = await runAction(getRecentFilingsForUserAction, {
      modules: { presenter },
      state: {},
    });

    expect(output.recentFilings).toEqual([]);
    expect(applicationContext.getHttpClient().get).toHaveBeenCalledWith(
      expect.stringContaining('/cases/recent-filings'),
      expect.any(Object),
    );
  });
});
