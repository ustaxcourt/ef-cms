import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPractitionerDocumentFormForEditAction } from './setPractitionerDocumentFormForEditAction';

describe('setPractitionerDocumentFormForEditAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set up state.form to edit the practitioner document', async () => {
    const practitionerDocument = {
      categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
      description: 'words words words',
      fileName: 'testPdf.pdf',
      practitionerDocumentFileId: 'c939bc7b-01bf-4630-a32a-ade74d84b3a1',
    };
    const barNumber = '3c18f649-ed95-470a-9c6f-e96c3b50b537';

    const { state } = await runAction(
      setPractitionerDocumentFormForEditAction,
      {
        modules: {
          presenter,
        },
        props: {
          barNumber,
          practitionerDocument,
        },
      },
    );

    expect(state.form).toMatchObject({
      barNumber,
      categoryType: practitionerDocument.categoryType,
      description: practitionerDocument.description,
      existingFileName: practitionerDocument.fileName,
      fileName: practitionerDocument.fileName,
      isEditingDocument: true,
    });
  });
});
