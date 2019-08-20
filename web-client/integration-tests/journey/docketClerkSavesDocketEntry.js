export default test => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isAddAnother: true,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('form')).toMatchObject({
      lodged: false,
      practitioner: [],
    });
    expect(test.getState('wizardStep')).toEqual('PrimaryDocumentForm');
    expect(test.getState('documentUploadMode')).toEqual('scan');
    expect(test.getState('documentSelectedForScan')).toEqual(
      'primaryDocumentFile',
    );
  });
};
