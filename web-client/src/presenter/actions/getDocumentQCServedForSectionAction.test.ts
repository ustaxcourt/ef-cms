import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentQCServedForSectionAction } from './getDocumentQCServedForSectionAction';
import { getDocumentQCServedForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCServedForSectionProxy';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/workitems/getDocumentQCServedForSectionProxy');

describe('getDocumentQCServedForSectionAction', () => {
  const mockGetDocumentQCServedForSectionInteractor =
    getDocumentQCServedForSectionInteractor as jest.Mock;
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockSection = 'A side section';

  beforeAll(() => {
    mockGetDocumentQCServedForSectionInteractor.mockReturnValue(mockWorkItems);
    presenter.providers.applicationContext = applicationContext;
  });

  it("should make a call to getDocumentQCServedForSectionInteractor with the current user's section", async () => {
    await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: mockSection,
        },
      },
    });

    expect(
      mockGetDocumentQCServedForSectionInteractor.mock.calls[0][1],
    ).toMatchObject({ section: mockSection });
  });

  it('should call getDocumentQCServedForSectionInteractor with the selectedSection when section exists off workQueueToDisplay', async () => {
    const mockSelectedSection = 'a selected section';
    await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: mockSection,
        },
        workQueueToDisplay: {
          section: mockSelectedSection,
        },
      },
    });

    expect(
      mockGetDocumentQCServedForSectionInteractor.mock.calls[0][1],
    ).toMatchObject({
      section: mockSelectedSection,
    });
  });
  it('should return the retrieved work items as props', async () => {
    const { output } = await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          section: mockSection,
        },
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
