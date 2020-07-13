import { setBatchPages } from './helpers';

export const addBatchesForScanning = (
  test,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Adds a batch of scanned documents', async () => {
    await test.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    expect(
      test.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(test.getState('scanner.batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
export const createPDFFromScannedBatches = test => {
  return it('Creates a PDF from added batches', async () => {
    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    setBatchPages({ test });

    await test.runSequence('generatePdfFromScanSessionSequence', {
      documentType: selectedDocumentType,
      documentUploadMode: 'preview',
    });

    expect(test.getState(`form.${selectedDocumentType}Size`)).toBeGreaterThan(
      0,
    );
    expect(test.getState(`form.${selectedDocumentType}`)).toBeDefined();
  });
};

export const selectScannerSource = (
  test,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Selects a scanner', async () => {
    await test.runSequence('openChangeScannerSourceModalSequence');

    expect(test.getState('modal.showModal')).toEqual(
      'SelectScannerSourceModal',
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'scanner',
      value: scannerSourceName,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'index',
      value: scannerSourceIndex,
    });

    await test.runSequence('selectScannerSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    expect(test.getState('scanner.scannerSourceIndex')).toEqual(
      scannerSourceIndex,
    );
    expect(test.getState('scanner.scannerSourceName')).toEqual(
      scannerSourceName,
    );

    expect(test.getState('modal')).toMatchObject({});
  });
};
