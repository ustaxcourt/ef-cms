import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { editPractitionerDocument } from './editPractitionerDocument';

const barNumber = 'XY1234';
const practitionerDocumentFileId = 'c22b8f0c-3962-465b-a23d-ad9f9bc4264c';
const practitionerDocument = {
  categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
  categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
  fileName: 'testPdf.pdf',
  location: null,
  practitionerDocumentFileId,
};

describe('editPractitionerDocument', () => {
  it('attempts to update the practitioner document', async () => {
    const barNumberLowerCase = 'xy1234';

    await editPractitionerDocument({
      applicationContext,
      barNumber,
      practitionerDocument,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `practitioner|${barNumberLowerCase}`,
        sk: `document|${practitionerDocumentFileId}`,
        ...practitionerDocument,
      },
    });
  });
});
