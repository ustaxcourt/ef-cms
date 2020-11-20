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
      generateDocumentTitleInteractor.mock.calls[0][0].documentMetadata,
    ).toMatchObject({
      documentTitle: '[First, Second, etc. ] Amended [Document Name]',
    });
  });
});
