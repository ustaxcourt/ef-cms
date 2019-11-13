import { generateCourtIssuedDocumentTitleAction } from './generateCourtIssuedDocumentTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('generateCourtIssuedDocumentTitleAction', () => {
  let generateCourtIssuedDocumentTitleStub;

  beforeEach(() => {
    generateCourtIssuedDocumentTitleStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateCourtIssuedDocumentTitleInteractor: generateCourtIssuedDocumentTitleStub,
      }),
    };
  });

  it('should call generateCourtIssuedDocumentTitle with correct data', async () => {
    generateCourtIssuedDocumentTitleStub.returns(null);
    await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.calledOnce).toEqual(true);
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .date,
    ).toEqual('12-12-2019');
  });
});
