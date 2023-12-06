import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setViewerDocumentToDisplayAction } from './setViewerDocumentToDisplayAction';

describe('setViewerDocumentToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the viewerDocumentToDisplay from props on state, sets the docketEntryId from props on state, and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(setViewerDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDocumentToDisplay: { docketEntryId: '1234' },
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '1234' }],
          docketNumber: '123-45',
        },
        viewerDocumentToDisplay: null,
      },
    });

    expect(result.state.viewerDocumentToDisplay).toEqual({
      docketEntryId: '1234',
    });
    expect(result.state.docketEntryId).toEqual('1234');
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.viewerDocumentToDisplay is null', async () => {
    const result = await runAction(setViewerDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDocumentToDisplay: null,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: '1234' }],
          docketNumber: '123-45',
        },
        viewerDocumentToDisplay: null,
      },
    });

    expect(result.state.iframeSrc).toBeUndefined();
  });
});
