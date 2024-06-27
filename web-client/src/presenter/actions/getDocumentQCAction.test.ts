import { CHIEF_JUDGE, ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCAction } from '@web-client/presenter/actions/getDocumentQCAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentQCAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = '35f77d01-df22-479c-b5a9-84edfbc876af';

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: mockUserId,
    });

    applicationContext
      .getUseCases()
      .getDocumentQCInteractor.mockReturnValue(mockWorkItems);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to get the current user', async () => {
    await runAction(getDocumentQCAction, {
      modules: {
        presenter,
      },
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it("should make a call to getDocumentQCInteractor with the current user's userId, the selected workItem box when queue is 'my'", async () => {
    const mockBox = 'inbox';
    const mockQueue = 'my';
    const mockJudgeUser = { role: 'judge', userId: '123' };
    const { output } = await runAction(getDocumentQCAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: mockJudgeUser,
        workQueueToDisplay: { box: mockBox, queue: mockQueue },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInteractor.mock.calls[0][1],
    ).toMatchObject({
      box: mockBox,
      judgeUser: mockJudgeUser,
      recipient: { group: 'user', identifier: mockUserId },
    });
    expect(output).toEqual({ workItems: mockWorkItems });
  });

  it("should make a call to getDocumentQCInteractor with the selected section, the selected workItem box, and judgeUser queue is 'section' and the current user is an ADC", async () => {
    const mockBox = 'inProgress';
    const mockQueue = 'section';

    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.adc,
      userId: mockUserId,
    });

    const { output } = await runAction(getDocumentQCAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: { name: CHIEF_JUDGE },
        workQueueToDisplay: {
          box: mockBox,
          queue: mockQueue,
          section: 'docket',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInteractor.mock.calls[0][1],
    ).toMatchObject({
      box: mockBox,
      judgeUser: { name: CHIEF_JUDGE },
      recipient: { group: 'section', identifier: 'docket' },
    });
    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
