import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCInboxForUserAction } from './getDocumentQCInboxForUserAction';
import { getDocumentQCInboxForUserInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForUserProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCInboxForUserProxy');

describe('getDocumentQCInboxForUserAction', () => {
  const mockGetDocumentQCInboxForUserInteractor =
    getDocumentQCInboxForUserInteractor as jest.Mock;
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = '35f77d01-df22-479c-b5a9-84edfbc876af';

  beforeAll(() => {
    mockGetDocumentQCInboxForUserInteractor.mockImplementation(
      () => mockWorkItems,
    );
    presenter.providers.applicationContext = applicationContext;
  });

  afterEach(() => {
    mockGetDocumentQCInboxForUserInteractor.mockClear();
  });

  it("should make a call to getDocumentQCInboxForUserInteractor with the current user's userId", async () => {
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

  it('should return the retrieved work items as props', async () => {
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
});
