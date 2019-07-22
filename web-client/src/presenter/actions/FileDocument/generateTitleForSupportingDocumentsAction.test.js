import { generateTitleForSupportingDocumentsAction } from './generateTitleForSupportingDocumentsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('generateTitleForSupportingDocumentsAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateDocumentTitleInteractor: generateDocumentTitleStub,
      }),
    };
  });

  it('should call generateDocumentTitle with correct data for supporting documents', async () => {
    generateDocumentTitleStub.returns(null);
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
      generateDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleStub.getCall(1).args[0].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
