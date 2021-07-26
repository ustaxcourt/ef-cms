import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCorrespondenceAction } from './submitCorrespondenceAction';

describe('submitCorrespondenceAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .fileCorrespondenceDocumentInteractor.mockResolvedValue({
        correspondence: [],
        docketNumber: '101-20',
      });

    applicationContext
      .getUseCases()
      .updateCorrespondenceDocumentInteractor.mockResolvedValue({
        correspondence: [],
        docketNumber: '101-20',
      });
  });

  it('submits a new document for correspondence', async () => {
    const result = await runAction(submitCorrespondenceAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'correspondence-document-id-123',
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {
          documentTitle: 'le document title',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toBeCalled();
    expect(applicationContext.getUseCases().validatePdfInteractor).toBeCalled();
    expect(
      applicationContext.getUseCases().fileCorrespondenceDocumentInteractor,
    ).toBeCalled();
    expect(result.output).toMatchObject({
      caseDetail: {
        correspondence: [],
        docketNumber: '101-20',
      },
      correspondenceId: 'correspondence-document-id-123',
      docketNumber: '101-20',
    });
  });

  it('updates an existing document for correspondence when state.form has a documentIdToEdit', async () => {
    const result = await runAction(submitCorrespondenceAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: 'correspondence-document-id-123',
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        form: {
          documentIdToEdit: 'correspondence-document-id-123',
          documentTitle: 'le document title',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toBeCalled();
    expect(applicationContext.getUseCases().validatePdfInteractor).toBeCalled();
    expect(
      applicationContext.getUseCases().updateCorrespondenceDocumentInteractor,
    ).toBeCalled();
    expect(result.output).toMatchObject({
      caseDetail: {
        correspondence: [],
        docketNumber: '101-20',
      },
      correspondenceId: 'correspondence-document-id-123',
      docketNumber: '101-20',
    });
  });
});
