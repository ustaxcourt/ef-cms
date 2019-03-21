export default test => {
  return it('Petitions clerk updates case caption', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent',
    );

    await test.runSequence('openCaseCaptionModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseCaptionModalDialog');
    expect(test.getState('caseCaption')).toEqual(
      'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner',
    );

    test.setState('caseCaption', 'Mark Althavan Andrews');

    await test.runSequence('dismissCaseCaptionModalSequence');

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent',
    );
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('caseCaption')).toEqual('');

    await test.runSequence('openCaseCaptionModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseCaptionModalDialog');
    expect(test.getState('caseCaption')).toEqual(
      'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner',
    );

    test.setState('caseCaption', 'Sisqo');

    await test.runSequence('updateCaseDetailSequence');

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Sisqo v. Commissioner of Internal Revenue, Respondent',
    );
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('caseCaption')).toEqual('');
  });
};
