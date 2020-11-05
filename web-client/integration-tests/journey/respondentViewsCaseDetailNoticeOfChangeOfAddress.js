import { refreshElasticsearchIndex } from '../helpers';
export const respondentViewsCaseDetailNoticeOfChangeOfAddress = (
  test,
  createdDocketNumberIndex,
) => {
  return it('respondent views case detail notice of change of address', async () => {
    await refreshElasticsearchIndex(5000);
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.createdDocketNumbers[createdDocketNumberIndex],
    });

    const currentUser = test.getState('user');
    const irsPractitioners = test.getState('caseDetail.irsPractitioners');
    const irsPractitioner = irsPractitioners.find(
      practitioner => practitioner.userId === currentUser.userId,
    );

    expect(irsPractitioner.contact).toMatchObject({
      address1: test.updatedRespondentAddress,
    });

    const documents = test.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(changeOfAddressDocument.servedAt).toBeDefined();

    expect(changeOfAddressDocument).toBeDefined();

    expect(changeOfAddressDocument.documentTitle).toBe(
      'Notice of Change of Address',
    );
    expect(changeOfAddressDocument.additionalInfo).toBe(
      'for Test IRS Practitioner',
    );
    expect(changeOfAddressDocument.filedBy).toBeUndefined();
  });
};
