import { generateTitleForSupportingDocumentsAction } from './generateTitleForSupportingDocumentsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generateTitleForSupportingDocumentsAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateDocumentTitleInteractor: generateDocumentTitleStub,
      }),
    };
  });

  it('should call generateDocumentTitle with correct data for supporting documents', async () => {
    generateDocumentTitleStub = jest.fn().mockReturnValue(null);
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
      generateDocumentTitleStub.mock.calls[0][0].documentMetadata.documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleStub.mock.calls[1][0].documentMetadata.documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
