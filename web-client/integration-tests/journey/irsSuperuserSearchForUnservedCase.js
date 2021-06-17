import { getFormattedDocketEntriesForTest } from '../helpers';

export const irsSuperuserSearchForUnservedCase = test => {
  return it('irsSuperuser searches for an unserved case by docket number from dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    test.setState('header.searchTerm', test.docketNumber);
    await test.runSequence('submitCaseSearchSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const petitionDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Petition',
    );
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    // irsSuperuser should NOT see a link to a petition
    // document that has not been served
    expect(petitionDocketEntry.showLinkToDocument).toBeFalsy();
  });
};
