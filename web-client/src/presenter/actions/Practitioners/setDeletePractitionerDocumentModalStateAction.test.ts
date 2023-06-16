import { runAction } from '@web-client/presenter/test.cerebral';
import { setDeletePractitionerDocumentModalStateAction } from './setDeletePractitionerDocumentModalStateAction';

describe('setDeletePractitionerDocumentModalStateAction', () => {
  it('sets the practitionerDocumentFileId and barNumber to delete the practitioner document', async () => {
    const practitionerDocumentFileId = 'e5707e16-0013-4718-bf8e-5088c9a969fa';
    const barNumber = 'AB7654';
    const result = await runAction(
      setDeletePractitionerDocumentModalStateAction,
      {
        props: {
          barNumber,
          practitionerDocumentFileId,
        },
      },
    );

    expect(result.state).toMatchObject({
      modal: {
        barNumber,
        practitionerDocumentFileId,
      },
    });
  });
});
