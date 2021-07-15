export const docketClerkUpdatesCaseCaption = cerebralTest => {
  return it('Docket clerk updates case caption', async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    const judges = cerebralTest.getState('modal.judges');

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeFalsy();

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(cerebralTest.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Mark Althavan Andrews',
    });

    await cerebralTest.runSequence('clearModalSequence');

    expect(cerebralTest.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );
    expect(cerebralTest.getState('modal')).toEqual({});

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(cerebralTest.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Sisqo',
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    expect(cerebralTest.getState('caseDetail.caseCaption')).toEqual('Sisqo');
    expect(cerebralTest.getState('modal')).toEqual({});
  });
};
