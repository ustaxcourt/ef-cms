import { refreshElasticsearchIndex } from '../helpers';

export const practitionerViewsCaseDetailNoticeOfChangeOfAddress = (
  test,
  createdDocketNumberIndex,
) => {
  return it('practitioner views case detail notice of change of address', async () => {
    await refreshElasticsearchIndex(5000);

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.createdDocketNumbers[createdDocketNumberIndex],
    });

    const currentUser = test.getState('user');
    const privatePractitioners = test.getState(
      'caseDetail.privatePractitioners',
    );
    const privatePractitioner = privatePractitioners.find(
      practitioner => practitioner.userId === currentUser.userId,
    );

    expect(privatePractitioner.contact).toMatchObject({
      address1: test.updatedPractitionerAddress,
    });

    const documents = test.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(changeOfAddressDocument.servedAt).toBeDefined();

    expect(changeOfAddressDocument.documentTitle).toBe(
      'Notice of Change of Address',
    );
    expect(changeOfAddressDocument.additionalInfo).toBe(
      'for Test Private Practitioner',
    );
    expect(changeOfAddressDocument.filedBy).toBeUndefined();

    expect(changeOfAddressDocument).toBeDefined();
  });
};
