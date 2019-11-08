export default test => {
  return it('Docket clerk updates case caption', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Test Person, Deceased, Test Person 2, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent',
    );

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseModalDialog');

    expect(test.getState('modal.caseCaption')).toEqual(
      'Test Person, Deceased, Test Person 2, Surviving Spouse, Petitioner',
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Mark Althavan Andrews',
    });

    await test.runSequence('clearModalSequence');

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Test Person, Deceased, Test Person 2, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent',
    );
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('modal.caseCaption')).toBeUndefined();

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseModalDialog');
    expect(test.getState('modal.caseCaption')).toEqual(
      'Test Person, Deceased, Test Person 2, Surviving Spouse, Petitioner',
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Sisqo',
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('caseDetail.caseTitle')).toEqual(
      'Sisqo v. Commissioner of Internal Revenue, Respondent',
    );
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('modal.caseCaption')).toBeUndefined();
  });
};
