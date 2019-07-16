export default test => {
  return it('Taxpayer is shown a modal for Change of Address', async () => {
    await test.runSequence('openEditSecondaryContactModalSequence');

    expect(test.getState('showModal')).toEqual('EditSecondaryContact');

    await test.runSequence('dismissModalSequence');

    expect(test.getState('showModal')).toEqual('');
  });
};
