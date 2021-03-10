import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTitlePreviewAction } from './generateTitlePreviewAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('generateTitlePreviewAction', () => {
  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    const documentType = 'Motion for Judgment on the Pleadings';
    applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor.mockReturnValue(documentType);

    const result = await runAction(generateTitlePreviewAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentType,
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateDocumentTitleInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      documentType,
    );
  });

  it('should reset the document title back to the bracketed title', async () => {
    const documentType = 'Certificate of Service';
    applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor.mockReturnValue(
        'Certificate of Service 01/01/20',
      );

    const result = await runAction(generateTitlePreviewAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentTitle: 'Random',
          documentType,
          serviceDate: '01/01/20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateDocumentTitleInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      'Certificate of Service 01/01/20',
    );
  });
});
