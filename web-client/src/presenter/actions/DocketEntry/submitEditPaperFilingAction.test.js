import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditPaperFilingAction } from './submitEditPaperFilingAction';

describe('submitEditPaperFilingAction', () => {
  const clientConnectionId = '999999999';
  const docketEntryId = 'be944d7c-63ac-459b-8a72-1a3c9e71ef70';

  let caseDetail;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    caseDetail = {
      docketEntries: [],
      docketNumber: '123-45',
    };

    applicationContext.getUseCases().editPaperFilingInteractor.mockReturnValue({
      caseDetail,
      paperServicePdfUrl: '000',
    });
  });

  it('should make a call to edit a paper filed docket entry', async () => {
    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: docketEntryId,
      },
      state: {
        caseDetail,
        clientConnectionId,
        docketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().editPaperFilingInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      documentMetadata: {
        docketNumber: caseDetail.docketNumber,
        isFileAttached: true,
        isPaper: true,
      },
      primaryDocumentFileId: docketEntryId,
    });
  });

  it('should add a coversheet when props.isSavingForLater is false and there is a file attached', async () => {
    await runAction(submitEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: false,
        primaryDocumentFileId: docketEntryId,
      },
      state: {
        caseDetail,
        clientConnectionId,
        docketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });
  });
});
