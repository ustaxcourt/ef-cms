import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateTitlePreviewAction } from './generateTitlePreviewAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('generateTitlePreviewAction', () => {
  it('should call generateExternalDocumentTitle with correct data for only a primary document', async () => {
    const documentType = 'Motion for Judgment on the Pleadings';
    applicationContext
      .getUtilities()
      .generateExternalDocumentTitle.mockReturnValue(documentType);

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
      applicationContext.getUtilities().generateExternalDocumentTitle.mock.calls
        .length,
    ).toEqual(1);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      documentType,
    );
  });

  it('should reset the document title back to the bracketed title', async () => {
    const documentType = 'Certificate of Service';
    applicationContext
      .getUtilities()
      .generateExternalDocumentTitle.mockReturnValue(
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
      applicationContext.getUtilities().generateExternalDocumentTitle.mock.calls
        .length,
    ).toEqual(1);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      'Certificate of Service 01/01/20',
    );
  });
});
