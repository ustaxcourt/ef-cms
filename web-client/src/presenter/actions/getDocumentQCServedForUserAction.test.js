import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCServedForUserAction } from './getDocumentQCServedForUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentQCServedForUserAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = 'a2eaa4e5-e6d8-434c-973a-fe9431f84e66';

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: mockUserId,
    });

    applicationContext
      .getUseCases()
      .getDocumentQCServedForUserInteractor.mockReturnValue(mockWorkItems);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to get the current user', async () => {
    await runAction(getDocumentQCServedForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it("should make a call to getDocumentQCServedForUserInteractor with the current user's userId", async () => {
    await runAction(getDocumentQCServedForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCServedForUserInteractor.mock
        .calls[0][1],
    ).toMatchObject({ userId: mockUserId });
  });

  it('should return the retrieved work items as props', async () => {
    const { output } = await runAction(getDocumentQCServedForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
