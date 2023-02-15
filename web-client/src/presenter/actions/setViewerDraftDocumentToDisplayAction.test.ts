import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setViewerDraftDocumentToDisplayAction } from './setViewerDraftDocumentToDisplayAction';

describe('setViewerDraftDocumentToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the viewerDraftDocumentToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(setViewerDraftDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDraftDocumentToDisplay: { docketEntryId: '1234' },
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        viewerDraftDocumentToDisplay: null,
      },
    });
    expect(result.state.viewerDraftDocumentToDisplay).toEqual({
      docketEntryId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('sets the state.screenMetadata.draftDocumentViewerDocketEntryId from props on state from viewerDraftDocumentToDisplay if set', async () => {
    const result = await runAction(setViewerDraftDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDraftDocumentToDisplay: { docketEntryId: '1234' },
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        viewerDraftDocumentToDisplay: null,
      },
    });
    expect(
      result.state.screenMetadata.draftDocumentViewerDocketEntryId,
    ).toEqual('1234');
  });

  it('does not set state.screenMetadata.draftDocumentViewerDocketEntryId or iframeSrc if props.viewerDraftDocumentToDisplay is null', async () => {
    const result = await runAction(setViewerDraftDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        viewerDraftDocumentToDisplay: null,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        screenMetadata: {},
        viewerDraftDocumentToDisplay: null,
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
    expect(
      result.state.screenMetadata.draftDocumentViewerDocketEntryId,
    ).toBeUndefined();
  });
});
