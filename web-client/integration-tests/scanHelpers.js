import { setBatchPages } from './helpers';

export const addBatchesForScanning = (
  cerebralTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Adds a batch of scanned documents', async () => {
    await cerebralTest.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    expect(
      cerebralTest.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(cerebralTest.getState('scanner.batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
export const createPDFFromScannedBatches = cerebralTest => {
  return it('Creates a PDF from added batches', async () => {
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

export const selectScannerSource = (
  cerebralTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Selects a scanner', async () => {
    await cerebralTest.runSequence('openChangeScannerSourceModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'SelectScannerSourceModal',
    );

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'scanner',
      value: scannerSourceName,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'index',
      value: scannerSourceIndex,
    });

    await cerebralTest.runSequence('selectScannerSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    expect(cerebralTest.getState('scanner.scannerSourceIndex')).toEqual(
      scannerSourceIndex,
    );
    expect(cerebralTest.getState('scanner.scannerSourceName')).toEqual(
      scannerSourceName,
    );

    expect(cerebralTest.getState('modal')).toMatchObject({});
  });
};
