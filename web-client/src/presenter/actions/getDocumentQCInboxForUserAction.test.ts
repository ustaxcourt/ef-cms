import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForUserAction } from './getDocumentQCInboxForUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentQCInboxForUserAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = '35f77d01-df22-479c-b5a9-84edfbc876af';

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: mockUserId,
    });

    applicationContext
      .getUseCases()
      .getDocumentQCInboxForUserInteractor.mockReturnValue(mockWorkItems);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to get the current user', async () => {
    await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it("should make a call to getDocumentQCInboxForUserInteractor with the current user's userId", async () => {
    await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInboxForUserInteractor.mock
        .calls[0][1],
    ).toMatchObject({ userId: mockUserId });
  });

  it('should return the retrieved work items as props', async () => {
    const { output } = await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
