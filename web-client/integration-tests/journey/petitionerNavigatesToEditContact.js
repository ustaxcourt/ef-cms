import { contactPrimaryFromState } from '../helpers';

export const petitionerNavigatesToEditContact = cerebralTest => {
  it('petitioner views contact edit page', async () => {
    const contactPrimary = contactPrimaryFromState(cerebralTest);
    const contactIdToUse = contactPrimary.contactId;

    await cerebralTest.runSequence('gotoContactEditSequence', {
      contactId: contactIdToUse,
      docketNumber: cerebralTest.getState('caseDetail.docketNumber'),
    });

    const currentPage = cerebralTest.getState('currentPage');
    expect(currentPage).toEqual('ContactEdit');
  });
};
