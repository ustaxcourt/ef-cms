import { contactPrimaryFromState } from '../helpers';

export const petitionerNavigatesToEditContact = test => {
  it('petitioner views contact edit page', async () => {
    const contactPrimary = contactPrimaryFromState(test);
    const contactIdToUse = contactPrimary.contactId;

    await test.runSequence('gotoContactEditSequence', {
      contactId: contactIdToUse,
      docketNumber: test.getState('caseDetail.docketNumber'),
    });

    const currentPage = test.getState('currentPage');
    expect(currentPage).toEqual('ContactEdit');
  });
};
