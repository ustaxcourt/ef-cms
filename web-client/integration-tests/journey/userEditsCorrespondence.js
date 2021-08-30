import { fakeFile1 } from '../helpers';
import axios from 'axios';

export const userEditsCorrespondence = (cerebralTest, user) =>
  it(`${user} edits the documentTitle for a correspondence`, async () => {
    const { docketNumber } = cerebralTest.getState('caseDetail');
    let docketEntryId = cerebralTest.getState('docketEntryId');

    await cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId,
      docketNumber,
      isForIFrame: true,
    });

    let iframeSrc = cerebralTest.getState('iframeSrc');
    let response = await axios.get(iframeSrc, { contentType: 'blob' });

    const initialDocumentLength = response.data.length;

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My edited correspondence',
    });

    await cerebralTest.runSequence('clearExistingDocumentSequence');
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile1,
    });

    await cerebralTest.runSequence('editCorrespondenceDocumentSequence');

    response = await axios.get(iframeSrc, { contentType: 'blob' });
    const updatedDocumentLength = response.data.length;

    expect(initialDocumentLength).not.toEqual(updatedDocumentLength);

    expect(cerebralTest.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          correspondenceId:
            cerebralTest.correspondenceDocument.correspondenceId,
          documentTitle: 'My edited correspondence',
        }),
      ]),
    );
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });
