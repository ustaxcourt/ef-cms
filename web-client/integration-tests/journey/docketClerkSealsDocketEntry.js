import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkSealsDocketEntry = cerebralTest => {
  return it('Docket clerk seals a docket entry', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // need to pass in the docketEntryId to pass to modal, can get from draftOrderIndex
    await cerebralTest.runSequence('openSealDocketEntryModalSequence');
    await cerebralTest.runSequence('sealDocketEntrySequence');

    // const { formattedDocketEntriesOnDocketRecord } =
    //   await getFormattedDocketEntriesForTest(cerebralTest);

    // const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
    //   docketEntry => docketEntry.isSealed,
    // );

    // expect(cerebralTest.getState('caseDetail.docketEntries')).not.toBeDefined();

    await refreshElasticsearchIndex();
  });
};
