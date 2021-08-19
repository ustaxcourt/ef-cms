import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTitleForSupportingDocumentsAction } from './generateTitleForSupportingDocumentsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateTitleForSupportingDocumentsAction', () => {
  const { generateDocumentTitleInteractor } = applicationContext.getUseCases();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateDocumentTitle with correct data for supporting documents', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
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
      generateDocumentTitleInteractor.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleInteractor.mock.calls[1][1].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
