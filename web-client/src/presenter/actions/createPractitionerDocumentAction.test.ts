import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createPractitionerDocumentAction } from './createPractitionerDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createPractitionerDocumentAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should try to upload the file on state to persist the new practitioner document', async () => {
    applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor.mockResolvedValue('123');

    applicationContext
      .getUseCases()
      .createPractitionerDocumentInteractor.mockResolvedValue(null);

    await runAction(createPractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          practitionerDocumentFile: {
            name: 'testing.pdf',
          },
        },
        practitionerDetail: {
          barNumber: 'PT1234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().createPractitionerDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      barNumber: 'PT1234',
      documentMetadata: expect.objectContaining({
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        fileName: 'testing.pdf',
        practitionerDocumentFileId: '123',
      }),
    });
  });
});
