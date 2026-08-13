import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocketClerkReportDocumentQcAction } from './getDocketClerkReportDocumentQcAction';
import { getDocumentQCInboxForUserInteractor } from '@web-client/proxies/workitems/getDocumentQCInboxForUserProxy';
import { getDocumentQCServedForUserInteractor } from '@web-client/proxies/workitems/getDocumentQCServedForUserProxy';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@web-client/proxies/workitems/getDocumentQCInboxForUserProxy');
jest.mock('@web-client/proxies/workitems/getDocumentQCServedForUserProxy');

describe('getDocketClerkReportDocumentQcAction', () => {
  const mockInboxForUser = jest.mocked(getDocumentQCInboxForUserInteractor);
  const mockServedForUser = jest.mocked(getDocumentQCServedForUserInteractor);

  const mockClerk = {
    name: 'Alice Jones',
    role: 'docketClerk',
    section: 'docket',
    userId: 'clerk-uuid-001',
  };

  const mockInboxItems = [
    { workItemId: 'w1' },
    { workItemId: 'w2' },
  ] as RawWorkItemWithCaseAndDocketEntryInfo[];
  const mockServedItems = [
    { workItemId: 'w3' },
  ] as RawWorkItemWithCaseAndDocketEntryInfo[];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    mockInboxForUser.mockResolvedValue(mockInboxItems);
    mockServedForUser.mockResolvedValue(mockServedItems);
  });

  it('should call getDocumentQCInboxForUserInteractor with the selectedClerk userId', async () => {
    await runAction(getDocketClerkReportDocumentQcAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          inboxWorkItems: [],
          selectedClerk: mockClerk,
          servedWorkItems: [],
        },
      },
    });

    expect(mockInboxForUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ userId: 'clerk-uuid-001' }),
    );
  });

  it('should call getDocumentQCServedForUserInteractor with the selectedClerk userId', async () => {
    await runAction(getDocketClerkReportDocumentQcAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          inboxWorkItems: [],
          selectedClerk: mockClerk,
          servedWorkItems: [],
        },
      },
    });

    expect(mockServedForUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ userId: 'clerk-uuid-001' }),
    );
  });

  it('should store inboxWorkItems and servedWorkItems from the proxies', async () => {
    const { state } = await runAction(getDocketClerkReportDocumentQcAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          inboxWorkItems: [],
          selectedClerk: mockClerk,
          servedWorkItems: [],
        },
      },
    });

    expect(state.docketClerkReport.inboxWorkItems).toEqual(mockInboxItems);
    expect(state.docketClerkReport.servedWorkItems).toEqual(mockServedItems);
  });

  it('should not call any proxy when selectedClerk is null', async () => {
    mockInboxForUser.mockClear();
    mockServedForUser.mockClear();

    await runAction(getDocketClerkReportDocumentQcAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          inboxWorkItems: [],
          selectedClerk: null,
          servedWorkItems: [],
        },
      },
    });

    expect(mockInboxForUser).not.toHaveBeenCalled();
    expect(mockServedForUser).not.toHaveBeenCalled();
  });
});
