import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCInboxForSectionAction } from './getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCInboxForSectionProxy');

describe('getDocumentQCInboxForSectionAction', () => {
  const mockGetDocumentQCInboxForSectionInteractor =
    getDocumentQCInboxForSectionInteractor as jest.Mock;
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];

  beforeAll(() => {
    mockGetDocumentQCInboxForSectionInteractor.mockReturnValue(mockWorkItems);
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call getDocumentQCInboxForSectionInteractor with the judge user from state', async () => {
    const judgeId = '123456';
    await runAction(getDocumentQCInboxForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser: {
          userId: judgeId,
        },
        user: {
          section: 'judgy section',
        },
      },
    });

    expect(
      mockGetDocumentQCInboxForSectionInteractor.mock.calls[0][0],
    ).toMatchObject({
      judgeId,
      section: 'judgy section',
    });
  });

  it('should throw an error if the logged-in user does not have a section', async () => {
    await expect(
      runAction(getDocumentQCInboxForSectionAction, {
        modules: {
          presenter,
        },
        state: {
          user: { userId: '123' },
        },
      }),
    ).rejects.toThrow('Unable to fetch work items without a section');
  });
});
