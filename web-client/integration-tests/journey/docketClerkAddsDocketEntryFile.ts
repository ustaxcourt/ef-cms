export const docketClerkAddsDocketEntryFile = (cerebralTest, fakeFile) => {
  return it('Adds a file to the current docket record form', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 1,
    });
  });
};
