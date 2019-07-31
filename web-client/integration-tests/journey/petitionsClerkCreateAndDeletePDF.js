import { limitFileSize } from '../../src/views/limitFileSize.js';
import { setBatchPages } from '../helpers';

export default test => {
  return it('Petitions clerk creates and deletes a PDF from added batches', async () => {
    const selectedDocumentType = test.getState('documentSelectedForScan');
    const constants = test.getState('constants');

    setBatchPages({ test });

    await test.runSequence('completeScanSequence', {
      onComplete: file => {
        limitFileSize(file, constants.MAX_FILE_SIZE_MB, () => {
          test.runSequence('updateFormValueSequence', {
            key: selectedDocumentType,
            value: file,
          });
          test.runSequence('updateFormValueSequence', {
            key: `${selectedDocumentType}Size`,
            value: file.size,
          });
        });
      },
    });

    expect(test.getState(`form.${selectedDocumentType}Size`)).toBeGreaterThan(
      0,
    );

    // delete pdf
    test.runSequence('updateFormValueSequence', {
      key: selectedDocumentType,
      value: null,
    });
    test.runSequence('updateFormValueSequence', {
      key: `${selectedDocumentType}Size`,
      value: null,
    });
    test.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'scan',
    });

    expect(test.getState(`form.${selectedDocumentType}`)).toEqual(null);
    expect(test.getState(`form.${selectedDocumentType}Size`)).toEqual(null);
  });
};
