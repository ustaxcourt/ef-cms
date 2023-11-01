import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateCourtIssuedDocumentTitleAction } from './generateCourtIssuedDocumentTitleAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateCourtIssuedDocumentTitleAction', () => {
  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned', async () => {
    applicationContext
      .getUtilities()
      .generateCourtIssuedDocumentTitle.mockReturnValue('Order for something');

    presenter.providers.applicationContext = applicationContext;
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      props: {
        judgeWithTitle: 'Judge Fieri',
      },
      state: {
        form: {
          date: '12-12-2019',
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls[0][0].documentMetadata,
    ).toMatchObject({
      documentType: 'Order',
      judgeWithTitle: 'Judge Fieri',
    });
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and set state.form.generatedDocumentTitle to what is returned with Attachments added if it is true on the form', async () => {
    applicationContext
      .getUtilities()
      .generateCourtIssuedDocumentTitle.mockReturnValue('Order for something');
    presenter.providers.applicationContext = applicationContext;
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          attachments: true,
          date: '12-12-2019',
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls[0][0].documentMetadata,
    ).toMatchObject({
      date: '12-12-2019',
      documentType: 'Order',
    });
    expect(results.state.form.generatedDocumentTitle).toEqual(
      'Order for something',
    );
  });

  it('should call generateCourtIssuedDocumentTitle with correct data and unset state.form.generatedDocumentTitle if a document title is not returned', async () => {
    applicationContext
      .getUtilities()
      .generateCourtIssuedDocumentTitle.mockReturnValue(null);
    presenter.providers.applicationContext = applicationContext;
    const results = await runAction(generateCourtIssuedDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          date: '12-12-2019',
          documentTitle: '[Anything]',
          documentType: 'Order',
          freeText: 'for something',
          generatedDocumentTitle: 'Order for something',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUtilities().generateCourtIssuedDocumentTitle.mock
        .calls[0][0].documentMetadata,
    ).toMatchObject({
      date: '12-12-2019',
      documentType: 'Order',
    });
    expect(results.state.form.generatedDocumentTitle).toBeUndefined();
  });
});
