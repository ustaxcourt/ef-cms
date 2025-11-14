import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCInboxForUserAction } from './getDocumentQCInboxForUserAction';
import { getDocumentQCInboxForUserInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForUserProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCInboxForUserProxy');

describe('getDocumentQCInboxForUserAction', () => {
  const mockGetDocumentQCInboxForUserInteractor =
    getDocumentQCInboxForUserInteractor as jest.Mock;
  const mockUserId = '35f77d01-df22-479c-b5a9-84edfbc876af';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  afterEach(() => {
    mockGetDocumentQCInboxForUserInteractor.mockClear();
  });

  it("should make a call to getDocumentQCInboxForUserInteractor with the current user's userId", async () => {
    const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
    mockGetDocumentQCInboxForUserInteractor.mockResolvedValue(mockWorkItems);

    await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId: mockUserId },
      },
    });

    expect(
      mockGetDocumentQCInboxForUserInteractor.mock.calls[0][1],
    ).toMatchObject({
      userId: mockUserId,
    });
  });

  it('should return the retrieved work items as props when there are no consolidated cases', async () => {
    const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
    mockGetDocumentQCInboxForUserInteractor.mockResolvedValue(mockWorkItems);

    const { output } = await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId: mockUserId },
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });

  it('should add groupedCases to work items that need groups when leadDocketNumber exists', async () => {
    const mockWorkItems = [
      {
        docketEntryId: '123',
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
        workItemId: 'work-1',
        consolidatedCases: [
          { docketNumber: '101-20' },
          { docketNumber: '102-20' },
        ],
      },
      {
        docketEntryId: '123',
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
        workItemId: 'work-2',
        consolidatedCases: [
          { docketNumber: '101-20' },
          { docketNumber: '102-20' },
        ],
      },
    ];
    mockGetDocumentQCInboxForUserInteractor.mockResolvedValue(mockWorkItems);

    const { output } = await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId: mockUserId },
      },
    });

    expect(output.workItems).toEqual([
      {
        ...mockWorkItems[0],
        groupedCases: [{ docketNumber: '101-20' }, { docketNumber: '102-20' }],
      },
      {
        ...mockWorkItems[1],
        groupedCases: [{ docketNumber: '101-20' }, { docketNumber: '102-20' }],
      },
    ]);
  });

  it('should not add groupedCases when work item does not need groups', async () => {
    const mockWorkItems = [
      {
        docketEntryId: '123',
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
        workItemId: 'work-1',
        consolidatedCases: [
          { docketNumber: '101-20' },
          { docketNumber: '102-20' },
        ],
      },
      {
        docketEntryId: '456',
        docketNumber: '103-20',
        workItemId: 'work-2',
      },
    ];
    mockGetDocumentQCInboxForUserInteractor.mockResolvedValue(mockWorkItems);

    const { output } = await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId: mockUserId },
      },
    });

    expect(output.workItems).toEqual([
      {
        ...mockWorkItems[0],
        groupedCases: [{ docketNumber: '101-20' }, { docketNumber: '102-20' }],
      },
      {
        ...mockWorkItems[1],
        groupedCases: undefined,
      },
    ]);
  });

  it('should not add groupedCases when consolidatedCases is undefined', async () => {
    const mockWorkItems = [
      {
        docketEntryId: '123',
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
        workItemId: 'work-1',
      },
      {
        docketEntryId: '123',
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
        workItemId: 'work-2',
      },
    ];
    mockGetDocumentQCInboxForUserInteractor.mockResolvedValue(mockWorkItems);

    const { output } = await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: { userId: mockUserId },
      },
    });

    expect(output.workItems).toEqual([
      {
        ...mockWorkItems[0],
        groupedCases: undefined,
      },
      {
        ...mockWorkItems[1],
        groupedCases: undefined,
      },
    ]);
  });
});
