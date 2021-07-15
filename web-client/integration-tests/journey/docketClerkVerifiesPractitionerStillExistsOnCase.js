import { contactPrimaryFromState } from '../helpers';

export const docketClerkVerifiesPractitionerStillExistsOnCase =
  cerebralTest => {
    return it('docket clerk verifies practitioner is still on case', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const caseDetail = cerebralTest.getState('caseDetail');

      // checking that removing the represented petitioner did not disassociate the counsel from other petitioners
      expect(caseDetail.privatePractitioners[0].representing).toEqual([
        contactPrimaryFromState(cerebralTest).contactId,
      ]);
      expect(caseDetail.privatePractitioners[0].representing).not.toContain(
        cerebralTest.intervenorContactId,
      );
    });
  };
