import { getFormattedDocketEntriesForTest } from '../helpers';

export const practitionerViewsCaseDetailWithPublicOrder = test => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const {
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test);

    const publicallyAvailableOrderDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      d => d.eventCode === 'O',
    );

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
