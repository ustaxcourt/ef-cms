import { generateTitleForSupportingDocumentsAction } from './generateTitleForSupportingDocumentsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';

const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;
const { generateDocumentTitleInteractor } = applicationContext.getUseCases();

describe('generateTitleForSupportingDocumentsAction', () => {
  it('should call generateDocumentTitle with correct data for supporting documents', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
    await runAction(generateTitleForSupportingDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          secondarySupportingDocuments: [
            {
              category: 'Application',
              documentType: 'Application for Waiver of Filing Fee',
            },
          ],
          supportingDocuments: [
            {
              category: 'Motion',
              documentType: 'Motion for a New Trial',
            },
          ],
        },
      },
    });

    expect(
      generateDocumentTitleInteractor.mock.calls[0][0].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleInteractor.mock.calls[1][0].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
