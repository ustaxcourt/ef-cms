import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateTitleAction } from './generateTitleAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateTitleAction', () => {
  const { generateExternalDocumentTitle } = applicationContext.getUtilities();

  presenter.providers.applicationContext = applicationContext;

  it('should call generateExternalDocumentTitle with correct data for only a primary document', async () => {
    generateExternalDocumentTitle.mockReturnValue(null);
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

    expect(generateExternalDocumentTitle.mock.calls.length).toEqual(1);
    expect(
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
  });

  it('should call generateExternalDocumentTitle with correct data for all documents', async () => {
    generateExternalDocumentTitle.mockReturnValue(null);
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
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Protective Order Pursuant to Rule 103');
    expect(
      generateExternalDocumentTitle.mock.calls[1][1].documentMetadata
        .documentType,
    ).toEqual('Motion for Entry of Decision');
  });
});
