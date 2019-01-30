export default test => {
  return it('Petitions clerk submits case to IRS holding queue', async () => {
    //click send to irs button
    await test.runSequence('toggleShowModalSequence');
    expect(test.getState('showModal')).toEqual(true);
    //await modal
    //click no
    //expect case detail page
    //change something in case detail and submit again
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });
    await test.runSequence('autoSaveCaseSequence');
    //check that modal loads
    //click yes
    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');

    expect(test.getState('caseDetailErrors')).toEqual({});

    //check that save occurred
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T00:00:00.000Z',
    );
    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
    expect(test.getState('alertSuccess.title')).toEqual(
      'The petition is now in the IRS Holding Queue',
    );
    expect(test.getState('caseDetailErrors')).toEqual({});
  });
};
