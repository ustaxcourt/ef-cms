import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateTitleForPaperFilingAction } from './generateTitleForPaperFilingAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateTitleForPaperFilingAction', () => {
  const { generateExternalDocumentTitle } = applicationContext.getUtilities();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateExternalDocumentTitle with correct data and replace a previously generated documentTitle with an ungenerated one', async () => {
    generateExternalDocumentTitle.mockReturnValue('First Amended Answer');
    await runAction(generateTitleForPaperFilingAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentTitle: 'First Amended Petition',
          documentType: 'Amended [Document Name]',
          eventCode: 'AMAT',
          previousDocument: {
            documentType: 'Answer',
          },
        },
      },
    });

    expect(generateExternalDocumentTitle.mock.calls.length).toEqual(1);
    expect(
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata,
    ).toMatchObject({
      documentTitle: '[First, Second, etc. ] Amended [Document Name]',
    });
  });

  it('should not overwrite original documentTitle if a matching document is not found in the internal documents array', async () => {
    await runAction(generateTitleForPaperFilingAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'to do something',
        },
      },
    });

    expect(generateExternalDocumentTitle.mock.calls.length).toEqual(1);
    expect(
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata,
    ).toMatchObject({
      documentTitle: 'Order to do something',
    });
  });
});
