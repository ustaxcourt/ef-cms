import { getFormattedDocketEntriesForTest } from '../helpers';

export const practitionerViewsCaseDetailWithPublicOrder = test => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    test.setState('caseDetail', {});

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const publicallyAvailableOrderDocketEntry =
      formattedDocketEntriesOnDocketRecord.find(d => d.eventCode === 'O');

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
