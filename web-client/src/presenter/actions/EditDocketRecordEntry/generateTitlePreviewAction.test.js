import { generateTitlePreviewAction } from './generateTitlePreviewAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('generateTitlePreviewAction', () => {
  let generateDocumentTitleStub;

  beforeEach(() => {
    generateDocumentTitleStub = sinon.stub();

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
    generateDocumentTitleStub.returns(documentType);
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

    expect(generateDocumentTitleStub.calledOnce).toEqual(true);
    expect(result.state.screenMetadata.documentTitlePreview).toEqual(
      documentType,
    );
  });
});
