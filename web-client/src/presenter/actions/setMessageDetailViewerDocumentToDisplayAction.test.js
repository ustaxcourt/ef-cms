import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setMessageDetailViewerDocumentToDisplayAction } from './setMessageDetailViewerDocumentToDisplayAction';

describe('setMessageDetailViewerDocumentToDisplayAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the viewerDocumentToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
          viewerDocumentToDisplay: { documentId: '1234' },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [{ docketEntryId: '1234' }],
            docketNumber: '123-45',
          },
          viewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.viewerDocumentToDisplay).toEqual({
      documentId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.viewerDocumentToDisplay is null', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
          viewerDocumentToDisplay: null,
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [{ docketEntryId: '1234' }],
            docketNumber: '123-45',
          },
          viewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.iframeSrc).toBeUndefined();
  });

  it('does not set iframeSrc when the document to display has been archived', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
          viewerDocumentToDisplay: { documentId: '1234' },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [{ archived: true, docketEntryId: '1234' }],
            correspondence: [],
            docketEntries: [],
            docketNumber: '123-45',
          },
          viewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.iframeSrc).toBeUndefined();
  });
});
