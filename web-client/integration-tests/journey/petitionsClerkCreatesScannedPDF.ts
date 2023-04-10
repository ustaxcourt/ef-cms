import { setBatchPages } from '../helpers';

export const petitionsClerkCreatesScannedPDF = cerebralTest => {
  return it('Petitions clerk creates a PDF from added batches', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    setBatchPages({ cerebralTest });

    await cerebralTest.runSequence('generatePdfFromScanSessionSequence', {
      documentType: selectedDocumentType,
      documentUploadMode: 'preview',
    });

    expect(
      cerebralTest.getState(`form.${selectedDocumentType}Size`),
    ).toBeGreaterThan(0);
    expect(cerebralTest.getState(`form.${selectedDocumentType}`)).toBeDefined();
  });
};
