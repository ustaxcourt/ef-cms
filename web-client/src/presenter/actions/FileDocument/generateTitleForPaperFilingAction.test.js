import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTitleForPaperFilingAction } from './generateTitleForPaperFilingAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateTitleForPaperFilingAction', () => {
  const { generateDocumentTitleInteractor } = applicationContext.getUseCases();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateDocumentTitle with correct data and replace a previously generated documentTitle with an ungenerated one', async () => {
    generateDocumentTitleInteractor.mockReturnValue('First Amended Answer');
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

    expect(generateDocumentTitleInteractor.mock.calls.length).toEqual(1);
    expect(
      generateDocumentTitleInteractor.mock.calls[0][1].documentMetadata,
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

    expect(generateDocumentTitleInteractor.mock.calls.length).toEqual(1);
    expect(
      generateDocumentTitleInteractor.mock.calls[0][1].documentMetadata,
    ).toMatchObject({
      documentTitle: 'Order to do something',
    });
  });
});
