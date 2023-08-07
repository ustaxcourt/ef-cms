import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deletePractitionerDocument } from './deletePractitionerDocument';

const barNumber = 'AB1234';
const practitionerDocumentFileId = 'c22b8f0c-3962-465b-a23d-ad9f9bc4264c';

describe('deletePractitionerDocument', () => {
  it('attempts to remove the practitioner document', async () => {
    const barNumberLowerCase = 'ab1234';

    await deletePractitionerDocument({
      applicationContext,
      barNumber,
      practitionerDocumentFileId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `practitioner|${barNumberLowerCase}`,
        sk: `document|${practitionerDocumentFileId}`,
      },
    });
  });
});
