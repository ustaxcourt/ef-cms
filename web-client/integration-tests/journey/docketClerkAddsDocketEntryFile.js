export const docketClerkAddsDocketEntryFile = (test, fakeFile) => {
  return it('Adds a file to the current docket record form', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 1,
    });
  });
};
