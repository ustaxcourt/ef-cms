import { generateTitleAction } from './generateTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('generateTitleAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateDocumentTitleInteractor: generateDocumentTitleStub,
      }),
    };
  });

  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    generateDocumentTitleStub.returns(null);
    await runAction(generateTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(generateDocumentTitleStub.calledOnce).toEqual(true);
    expect(
      generateDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
  });

  it('should call generateDocumentTitle with correct data for all documents', async () => {
    generateDocumentTitleStub.returns(null);
    await runAction(generateTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Protective Order Pursuant to Rule 103',
          secondaryDocument: {
            category: 'Motion',
            documentType: 'Motion for Entry of Decision',
          },
          secondarySupportingDocuments: [
            {
              supportingDocumentMetadata: {
                category: 'Application',
                documentType: 'Application for Waiver of Filing Fee',
              },
            },
          ],
          supportingDocuments: [
            {
              supportingDocumentMetadata: {
                category: 'Motion',
                documentType: 'Motion for a New Trial',
              },
            },
          ],
        },
      },
    });

    expect(
      generateDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for Protective Order Pursuant to Rule 103');
    expect(
      generateDocumentTitleStub.getCall(1).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for Entry of Decision');
    expect(
      generateDocumentTitleStub.getCall(2).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleStub.getCall(3).args[0].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
