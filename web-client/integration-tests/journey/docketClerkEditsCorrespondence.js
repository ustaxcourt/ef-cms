import { fakeFile1 } from '../helpers';
import axios from 'axios';

export const docketClerkEditsCorrespondence = test =>
  it('docketclerk edits the documentTitle for a correspondence', async () => {
    const { docketNumber } = test.getState('caseDetail');
    let docketEntryId = test.getState('docketEntryId');

    await test.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId,
      docketNumber,
      isForIFrame: true,
    });

    let iframeSrc = test.getState('iframeSrc');
    let response = await axios.get(iframeSrc, { contentType: 'blob' });

    const initialDocumentLength = response.data.length;

    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My edited correspondence',
    });

    await test.runSequence('clearExistingDocumentSequence');
    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile1,
    });

    await test.runSequence('editCorrespondenceDocumentSequence');

    response = await axios.get(iframeSrc, { contentType: 'blob' });
    const updatedDocumentLength = response.data.length;

    expect(initialDocumentLength).not.toEqual(updatedDocumentLength);

    expect(test.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          correspondenceId: test.correspondenceDocument.correspondenceId,
          documentTitle: 'My edited correspondence',
        }),
      ]),
    );
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
