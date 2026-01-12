import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCServedForUserAction } from './getDocumentQCServedForUserAction';
import { getDocumentQCServedForUserInteractor } from '@shared/proxies/workitems/getDocumentQCServedForUserProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCServedForUserProxy');

describe('getDocumentQCServedForUserAction', () => {
  const mockGetDocumentQCServedForUserInteractor =
    getDocumentQCServedForUserInteractor as jest.Mock;
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = 'a2eaa4e5-e6d8-434c-973a-fe9431f84e66';

  beforeAll(() => {
    mockGetDocumentQCServedForUserInteractor.mockReturnValue(mockWorkItems);
    presenter.providers.applicationContext = applicationContext;
  });

  it("should make a call to getDocumentQCServedForUserInteractor with the current user's userId", async () => {
    await runAction(getDocumentQCServedForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          userId: mockUserId,
        },
      },
    });

    expect(
      mockGetDocumentQCServedForUserInteractor.mock.calls[0][1],
    ).toMatchObject({ userId: mockUserId });
  });

  it('should return the retrieved work items as props', async () => {
    const { output } = await runAction(getDocumentQCServedForUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          userId: mockUserId,
        },
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
