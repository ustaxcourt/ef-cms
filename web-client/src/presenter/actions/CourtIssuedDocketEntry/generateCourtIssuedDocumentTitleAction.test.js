import { generateCourtIssuedDocumentTitleAction } from './generateCourtIssuedDocumentTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('generateCourtIssuedDocumentTitleAction', () => {
  let generateCourtIssuedDocumentTitleStub;

  beforeEach(() => {
    jest.clearAllMocks();
    generateCourtIssuedDocumentTitleStub = jest
      .fn()
      .mockReturnValue('Order for something');

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateCourtIssuedDocumentTitleInteractor: generateCourtIssuedDocumentTitleStub,
      }),
    };
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned', async () => {
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.mock.calls.length).toEqual(1);
    expect(
      generateCourtIssuedDocumentTitleStub.mock.calls[0][0].documentMetadata,
    ).toMatchObject({
      date: '12-12-2019',
      documentType: 'Order',
    });
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned with Attachments added if it is true on the form', async () => {
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
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.mock.calls.length).toEqual(1);
    expect(
      generateCourtIssuedDocumentTitleStub.mock.calls[0][0].documentMetadata,
    ).toMatchObject({
      date: '12-12-2019',
      documentType: 'Order',
    });
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and unset state.form.generatedDocumentTitle if a document title is not returned', async () => {
    generateCourtIssuedDocumentTitleStub = jest.fn().mockReturnValue(null);
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '12-12-2019',
      },
      state: {
        form: {
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          generatedDocumentTitle: 'Order for something',
          scenario: 'Type A',
        },
      },
    });

    expect(generateCourtIssuedDocumentTitleStub.mock.calls.length).toEqual(1);
    expect(
      generateCourtIssuedDocumentTitleStub.mock.calls[0][0].documentMetadata,
    ).toMatchObject({
      date: '12-12-2019',
      documentType: 'Order',
    });
    expect(results.state.form.generatedDocumentTitle).toBeUndefined();
  });
});
