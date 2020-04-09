import { generateTitleAction } from './generateTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generateTitleAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateDocumentTitleInteractor: generateDocumentTitleStub,
      }),
    };
  });

  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    generateDocumentTitleStub = jest.fn().mockReturnValue(null);
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

    expect(generateDocumentTitleStub.mock.calls.length).toEqual(1);
    expect(
      generateDocumentTitleStub.mock.calls[0][0].documentMetadata.documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
  });

  it('should call generateDocumentTitle with correct data for all documents', async () => {
    generateDocumentTitleStub = jest.fn().mockReturnValue(null);
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
          secondarySupportingDocumentMetadata: {
            category: 'Application',
            documentType: 'Application for Waiver of Filing Fee',
          },
          supportingDocumentMetadata: {
            category: 'Motion',
            documentType: 'Motion for a New Trial',
          },
        },
      },
    });

    expect(
      generateDocumentTitleStub.mock.calls[0][0].documentMetadata.documentType,
    ).toEqual('Motion for Protective Order Pursuant to Rule 103');
    expect(
      generateDocumentTitleStub.mock.calls[1][0].documentMetadata.documentType,
    ).toEqual('Motion for Entry of Decision');
    expect(
      generateDocumentTitleStub.mock.calls[2][0].documentMetadata.documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleStub.mock.calls[3][0].documentMetadata.documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
