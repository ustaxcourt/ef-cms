// import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
// import { updateOpinionForm } from '../helpers';

export const userClicksDocketRecordLink = (
  cerebralTest,
  //   shouldUserSeeDocketEntries,
) => {
  return it('should navigate to case-detail page', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // get the state of the case detail to see if docket entries
    // const docketEntry = await cerebralTest.getState();

    // get the state of the case detail to see if docket entries
    //    - empty array = flag is false
    //    - !empty = flag is true
  });
};
