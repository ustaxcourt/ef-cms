import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateTitleForSupportingDocumentsAction } from './generateTitleForSupportingDocumentsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateTitleForSupportingDocumentsAction', () => {
  const { generateExternalDocumentTitle } = applicationContext.getUtilities();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateExternalDocumentTitle with correct data for supporting documents', async () => {
    generateExternalDocumentTitle.mockReturnValue(null);
    await runAction(generateTitleForSupportingDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          secondarySupportingDocuments: [
            {
              category: 'Application',
              documentType: 'Application for Waiver of Filing Fee',
            },
          ],
          supportingDocuments: [
            {
              category: 'Motion',
              documentType: 'Motion for a New Trial',
            },
          ],
        },
      },
    });

    expect(
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateExternalDocumentTitle.mock.calls[1][1].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
