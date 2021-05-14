import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateTitleAction } from './generateTitleAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateTitleAction', () => {
  const { generateDocumentTitleInteractor } = applicationContext.getUseCases();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
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

    expect(generateDocumentTitleInteractor.mock.calls.length).toEqual(1);
    expect(
      generateDocumentTitleInteractor.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
  });

  it('should call generateDocumentTitle with correct data for all documents', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
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
        },
      },
    });

    expect(
      generateDocumentTitleInteractor.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Protective Order Pursuant to Rule 103');
    expect(
      generateDocumentTitleInteractor.mock.calls[1][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Entry of Decision');
  });
});
