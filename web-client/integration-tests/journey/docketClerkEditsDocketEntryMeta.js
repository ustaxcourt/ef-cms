export default (test, docketRecordIndex = 1) => {
  return it('docket clerk edits docket entry meta', async () => {
    await test.runSequence('openEditDocketEntryMetaModalSequence', {
      index: docketRecordIndex,
    });

    expect(test.getState('showModal')).toEqual('EditDocketEntryMetaModal');

    await test.runSequence('updateModalValueSequence', {
      key: 'form.description',
      value: 'New Docket Entry Description',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.filedBy',
      value: 'New Filer',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.servedParties',
      value: 'Party One, Party Two',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence');

    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'You can view your updates to the Docket Record below.',
      title: 'Your changes have been saved.',
    });
  });
};
