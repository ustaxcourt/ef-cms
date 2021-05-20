import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCServedForSectionAction } from './getDocumentQCServedForSectionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentQCServedForSectionAction', () => {
  const mockWorkItems = [{ docketEntryId: 1 }, { docketEntryId: 2 }];
  const mockSection = 'A side section';

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: mockSection,
    });

    applicationContext
      .getUseCases()
      .getDocumentQCServedForSectionInteractor.mockReturnValue(mockWorkItems);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to get the current user', async () => {
    await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
    });

    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it("should make a call to getDocumentQCServedForSectionInteractor with the current user's section", async () => {
    await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCServedForSectionInteractor
        .mock.calls[0][1],
    ).toMatchObject({ section: mockSection });
  });

  it('should return the retrieved work items as props', async () => {
    const { output } = await runAction(getDocumentQCServedForSectionAction, {
      modules: {
        presenter,
      },
    });

    expect(output).toEqual({ workItems: mockWorkItems });
  });
});
