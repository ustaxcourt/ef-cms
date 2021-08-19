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

  it('sets state.messageViewerDocumentToDisplay when props.messageViewerDocumentToDisplay is defined', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          messageViewerDocumentToDisplay: { documentId: '999000999' },
          mostRecentMessage: { attachments: [{ documentId: '999000999' }] },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [{ docketEntryId: '999000999' }],
            docketNumber: '123-45',
          },
        },
      },
    );

    expect(result.state.messageViewerDocumentToDisplay).toEqual({
      documentId: '999000999',
    });
  });

  it('sets the messageViewerDocumentToDisplay from props on state and sets the iframeSrc url from the return from the use case', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          messageViewerDocumentToDisplay: { documentId: '1234' },
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [{ docketEntryId: '1234' }],
            docketNumber: '123-45',
          },
          messageViewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.messageViewerDocumentToDisplay).toEqual({
      documentId: '1234',
    });
    expect(result.state.iframeSrc).toEqual('www.example.com');
  });

  it('does not set iframeSrc if props.messageViewerDocumentToDisplay is null', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          messageViewerDocumentToDisplay: null,
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [{ docketEntryId: '1234' }],
            docketNumber: '123-45',
          },
          messageViewerDocumentToDisplay: null,
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
          messageViewerDocumentToDisplay: { documentId: '1234' },
          mostRecentMessage: { attachments: [{ documentId: '1234' }] },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [{ archived: true, docketEntryId: '1234' }],
            correspondence: [],
            docketEntries: [],
            docketNumber: '123-45',
          },
          messageViewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.iframeSrc).toBeUndefined();
  });

  it('does not throw an error when mostRecentMessage does not contain attachments', async () => {
    const result = await runAction(
      setMessageDetailViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          messageViewerDocumentToDisplay: { documentId: '1234' },
          mostRecentMessage: { attachments: [] },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [{ archived: true, docketEntryId: '1234' }],
            correspondence: [],
            docketEntries: [],
            docketNumber: '123-45',
          },
          messageViewerDocumentToDisplay: null,
        },
      },
    );

    expect(result.state.iframeSrc).toBeUndefined();
  });
});
