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

  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned', async () => {
    generateCourtIssuedDocumentTitleStub.returns('Order for something');
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          documentTitle: 'Order [Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.calledOnce).toEqual(true);
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Order');
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .date,
    ).toEqual('12-12-2019');
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned with Attachments added if it is true on the form', async () => {
    generateCourtIssuedDocumentTitleStub.returns('Order for something');
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          attachments: true,
          documentTitle: 'Order [Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.calledOnce).toEqual(true);
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Order');
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .date,
    ).toEqual('12-12-2019');
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and unset state.form.generatedDocumentTitle if a document title is not returned', async () => {
    generateCourtIssuedDocumentTitleStub.returns(null);
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          documentTitle: 'Order [Anything]',
          documentType: 'Order',
          freeText: 'for something',
          generatedDocumentTitle: 'Order for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.calledOnce).toEqual(true);
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .documentType,
    ).toEqual('Order');
    expect(
      generateCourtIssuedDocumentTitleStub.getCall(0).args[0].documentMetadata
        .date,
    ).toEqual('12-12-2019');
    expect(results.state.form.generatedDocumentTitle).toBeUndefined();
  });
});
