import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForSectionAction } from './getDocumentQCInboxForSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentQCInboxForSectionAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];

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

  it('should return props.workItems based on the section and judge', async () => {
    const result = await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          name: 'A judgy person',
        },
      },
    });

    expect(result.output.workItems).toEqual(mockWorkItems);
  });
});
