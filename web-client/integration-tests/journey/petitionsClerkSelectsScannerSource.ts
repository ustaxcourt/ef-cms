export const petitionsClerkSelectsScannerSource = (
  cerebralTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Petitions clerk selects a scanner', async () => {
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
