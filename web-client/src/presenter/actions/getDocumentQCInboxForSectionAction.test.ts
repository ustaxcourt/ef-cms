import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCInboxForSectionAction } from './getDocumentQCInboxForSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentQCInboxForSectionAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: 'judgy section',
    });
    applicationContext
      .getUseCases()
      .getDocumentQCInboxForSectionInteractor.mockReturnValue(mockWorkItems);
    presenter.providers.applicationContext = applicationContext;
  });

  it('should retrieve the current user', async () => {
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          name: 'A judgy person',
        },
      },
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should call getDocumentQCInboxForSectionInteractor with the judge user from state', async () => {
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          name: 'A judgy person',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      judgeUser: {
        name: 'A judgy person',
      },
      section: 'judgy section',
    });
  });

  it('should call getDocumentQCInboxForSectionInteractor with the selectedSection when section exists off workQueueToDisplay', async () => {
    const mockSection = 'a selected section';

    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        workQueueToDisplay: {
          section: mockSection,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      section: mockSection,
    });
  });

  it('should call getDocumentQCInboxForSectionInteractor with the CHIEF_JUDGE if judgeUser is not found in state and user role is adc', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: USER_ROLES.adc,
      section: 'judgy section',
    });
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      judgeUser: {
        name: CHIEF_JUDGE,
      },
      section: 'judgy section',
    });
  });
});
