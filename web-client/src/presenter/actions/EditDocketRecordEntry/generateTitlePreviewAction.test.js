import { generateTitlePreviewAction } from './generateTitlePreviewAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generateTitlePreviewAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateDocumentTitleInteractor: generateDocumentTitleStub,
      }),
      getUtilities: () => ({
        formatDocument: v => v,
        getFilingsAndProceedings: () => '',
      }),
    };
  });

  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    const documentType = 'Motion for Judgment on the Pleadings';
    generateDocumentTitleStub = jest.fn().mockReturnValue(documentType);
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

    expect(generateDocumentTitleStub.mock.calls.length).toEqual(1);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      documentType,
    );
  });
});
