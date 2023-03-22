import { refreshElasticsearchIndex } from '../helpers';
export const respondentViewsCaseDetailNoticeOfChangeOfAddress = (
  cerebralTest,
  createdDocketNumberIndex,
  shouldExist = true,
) => {
  return it(`respondent views case detail notice of change of address ${
    shouldExist ? 'exists' : 'does not exist'
  }`, async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.createdDocketNumbers[createdDocketNumberIndex],
    });

    const currentUser = cerebralTest.getState('user');
    const irsPractitioners = cerebralTest.getState(
      'caseDetail.irsPractitioners',
    );
    const irsPractitioner = irsPractitioners.find(
      practitioner => practitioner.userId === currentUser.userId,
    );

    expect(irsPractitioner.contact).toMatchObject({
      address1: cerebralTest.updatedRespondentAddress,
    });

    const documents = cerebralTest.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );
    if (shouldExist) {
      expect(changeOfAddressDocument).toBeDefined();
      expect(changeOfAddressDocument.servedAt).toBeDefined();
      expect(changeOfAddressDocument.documentTitle).toBe(
        'Notice of Change of Address',
      );
      expect(changeOfAddressDocument.additionalInfo).toBe(
        'for Test IRS Practitioner',
      );
      expect(changeOfAddressDocument.filedBy).toBeUndefined();
    } else {
      expect(changeOfAddressDocument).not.toBeDefined();
    }
  });
};
