import { getFormattedDocketEntriesForTest } from '../helpers';

export const irsSuperuserSearchForUnservedCase = cerebralTest => {
  return it('irsSuperuser searches for an unserved case by docket number from dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    cerebralTest.setState('header.searchTerm', cerebralTest.docketNumber);
    await cerebralTest.runSequence('submitCaseSearchSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const petitionDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Petition',
    );
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    // irsSuperuser should NOT see a link to a petition
    // document that has not been served
    expect(petitionDocketEntry.showLinkToDocument).toBeFalsy();
  });
};
