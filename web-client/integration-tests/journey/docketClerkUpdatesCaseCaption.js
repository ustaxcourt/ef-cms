export const docketClerkUpdatesCaseCaption = test => {
  return it('Docket clerk updates case caption', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Deceased, Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2, Surviving Spouse, Petitioner',
    );

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');

    expect(test.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Deceased, Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2, Surviving Spouse, Petitioner',
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Mark Althavan Andrews',
    });

    await test.runSequence('clearModalSequence');

    expect(test.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Deceased, Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2, Surviving Spouse, Petitioner',
    );
    expect(test.getState('modal')).toEqual({});

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('modal.showModal')).toEqual('UpdateCaseModalDialog');
    expect(test.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons, Deceased, Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2, Surviving Spouse, Petitioner',
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Sisqo',
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('caseDetail.caseCaption')).toEqual('Sisqo');
    expect(test.getState('modal')).toEqual({});
  });
};
