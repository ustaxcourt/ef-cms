import { limitFileSize } from '../../src/views/limitFileSize.js';
import { setBatchPages } from '../helpers';

export default test => {
  return it('Petitions clerk creates a PDF from added batches', async () => {
    const selectedDocumentType = test.getState('documentSelectedForScan');
    const constants = test.getState('constants');

    setBatchPages({ test });

    await test.runSequence('completeScanSequence', {
      onComplete: file => {
        return limitFileSize(file, constants.MAX_FILE_SIZE_MB, () => {
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
    expect(test.getState(`form.${selectedDocumentType}`)).toBeDefined();
  });
};
