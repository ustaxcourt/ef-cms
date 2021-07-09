import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const practitionerViewsCaseDetailOfOwnedCase = cerebralTest => {
  return it('Practitioner views case detail of owned case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual('Test Private Practitioner');
    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
  });
};
