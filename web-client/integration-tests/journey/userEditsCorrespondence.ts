import { fakeFile1 } from '../helpers';
import axios from 'axios';

export const userEditsCorrespondence = (cerebralTest, user) =>
  it(`${user} edits the documentTitle for a correspondence and replaces the document`, async () => {
    const { docketNumber } = cerebralTest.getState('caseDetail');
    const docketEntryId = cerebralTest.getState('docketEntryId');

    await cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId,
      docketNumber,
      isForIFrame: true,
    });

    const iframeSrc = cerebralTest.getState('iframeSrc');
    const initialDocumentLength = (
      await axios.get(iframeSrc, { contentType: 'blob' })
    ).data.length;

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: `My edited correspondence ${user}`,
    });

    await cerebralTest.runSequence('clearExistingDocumentSequence');

    expect(cerebralTest.getState('form.primaryDocumentFile')).toBe(undefined);
    expect(
      cerebralTest.getState('currentViewMetadata.documentUploadMode'),
    ).toBe('scan');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile1,
    });

    await cerebralTest.runSequence('editCorrespondenceDocumentSequence');

    const updatedDocumentLength = (
      await axios.get(iframeSrc, { contentType: 'blob' })
    ).data.length;

    expect(updatedDocumentLength).not.toEqual(initialDocumentLength);

    expect(cerebralTest.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          correspondenceId:
            cerebralTest.correspondenceDocument.correspondenceId,
          documentTitle: `My edited correspondence ${user}`,
        }),
      ]),
    );
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });
