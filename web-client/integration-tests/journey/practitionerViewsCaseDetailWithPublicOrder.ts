import { getFormattedDocketEntriesForTest } from '../helpers';

export const practitionerViewsCaseDetailWithPublicOrder = cerebralTest => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    cerebralTest.setState('caseDetail', {});

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const publicallyAvailableOrderDocketEntry =
      formattedDocketEntriesOnDocketRecord.find(d => d.eventCode === 'O');

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
