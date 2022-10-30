import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { editPractitionerDocumentAction } from './editPractitionerDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('editPractitionerDocumentAction', () => {
  const practitionerDocumentFileId = '9e8ec196-28df-4fd8-b8cd-7b903f4f6330';
  const barNumber = 'PT1234';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should try to upload the file on state to s3 if it exists', async () => {
    await runAction(editPractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          fileName: 'differentName.pdf',
          practitionerDocumentFile: {
            name: 'testing.pdf',
          },
          practitionerDocumentFileId,
        },
        practitionerDetail: {
          barNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadOrderDocumentInteractor.mock
        .calls[0][0],
    ).toMatchObject(applicationContext, {
      documentFile: { name: 'testing.pdf' },
      fileIdToOverwrite: practitionerDocumentFileId,
    });

    expect(
      applicationContext.getUseCases().editPractitionerDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      barNumber,
      documentMetadata: expect.objectContaining({
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        fileName: 'testing.pdf',
        practitionerDocumentFileId,
      }),
    });
  });

  it('should get practitionerDocument file name from form if file does not exist', async () => {
    await runAction(editPractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
          fileName: 'differentName.pdf',
          practitionerDocumentFileId,
        },
        practitionerDetail: {
          barNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadOrderDocumentInteractor,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().editPractitionerDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      barNumber,
      documentMetadata: expect.objectContaining({
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        fileName: 'differentName.pdf',
        practitionerDocumentFileId,
      }),
    });
  });
});
