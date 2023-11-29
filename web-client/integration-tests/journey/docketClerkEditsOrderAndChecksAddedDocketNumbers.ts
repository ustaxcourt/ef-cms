import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

export const docketClerkEditsOrderAndChecksAddedDocketNumbers =
  cerebralTest => {
    return it('Docket Clerk confirms the added docket number when editing the draft document', async () => {
      cerebralTest.setState('addedDocketNumbers', undefined);

      await cerebralTest.runSequence('gotoEditOrderSequence', {
        docketEntryIdToEdit: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('openAddDocketNumbersModalSequence');

      const consolidatedCasesWithCheckboxInfo = cerebralTest.getState(
        'modal.form.consolidatedCasesToMultiDocketOn',
      );

      const consolidatedCasesToMultiDocketOnMetaData =
        consolidatedCasesWithCheckboxInfo.map(caseInfo => ({
          checked: caseInfo.checked,
          docketNumberWithSuffix: caseInfo.docketNumberWithSuffix,
        }));

      const addedDocketNumbers = applicationContext
        .getUtilities()
        .getSelectedConsolidatedCasesToMultiDocketOn(
          consolidatedCasesToMultiDocketOnMetaData,
        );

      expect(addedDocketNumbers).toEqual(
        expect.arrayContaining(['111-19L', '112-19L', '113-19L']),
      );
    });
  };
