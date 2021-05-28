import { getContactPrimary } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkVerifiesPractitionerStillExistsOnCase = test => {
  return it('docket clerk verifies practitioner is still on case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');

    // checking that removing the represented petitioner did not disassociate the counsel from other petitioners
    expect(caseDetail.privatePractitioners[0].representing).toEqual([
      getContactPrimary(caseDetail).contactId,
    ]);
    expect(caseDetail.privatePractitioners[0].representing).not.toContain(
      test.intervenorContactId,
    );
  });
};
