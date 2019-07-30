export default test => {
  return it('Petitions clerk selects a scanner', async () => {
    await test.runSequence('openChangeScannerSourceModalSequence');

    expect(test.getState('showModal')).toEqual('SelectScannerSourceModal');

    const scannerSourceIndex = 0;
    const scannerSourceName = 'scanner A';

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
