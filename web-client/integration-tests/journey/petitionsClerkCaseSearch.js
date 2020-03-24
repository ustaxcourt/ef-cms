import { wait } from '../helpers';

export default test => {
  return it('Petitions clerk searches for case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: test.docketNumber,
    });
    console.log('submitting case search sequence');
    await test.runSequence('submitCaseSearchSequence');
    await wait(100);
    console.log('done submitting case search seqeunce');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
  });
};
