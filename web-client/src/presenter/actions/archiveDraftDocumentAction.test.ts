import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { archiveDraftDocumentAction } from './archiveDraftDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('archiveDraftDocumentAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('archives a drafted document successfully', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
        },
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'Document deleted.',
    });
  });

  it('archives a drafted document successfully, saves alerts for navigation, and returns docketNumber if state.archiveDraftDocument.redirectToCaseDetail is true', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'Document deleted.',
    });
    expect(result.state.saveAlertsForNavigation).toEqual(true);
    expect(result.output.docketNumber).toEqual('101-20');
  });

  it('should unset state.viewerDraftDocumentToDisplay and state.draftDocumentViewerDocketEntryId so the viewer does not display an archived document', async () => {
    const { state } = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: '101-20',
        },
        draftDocumentViewerDocketEntryId: '99999999',
        viewerDraftDocumentToDisplay: { docketEntryId: '999999' },
      },
    });

    expect(state.draftDocumentViewerDocketEntryId).toBeUndefined();
    expect(state.viewerDraftDocumentToDisplay).toBeUndefined();
  });
});
