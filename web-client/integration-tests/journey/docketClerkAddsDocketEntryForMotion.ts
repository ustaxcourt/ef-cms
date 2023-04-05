import { fakeFile } from '../../integration-tests-public/helpers';
import { waitForLoadingComponentToHide } from '../helpers';

export const docketClerkAddsDocketEntryForMotion = cerebralTest => {
  return it('Docket Clerk adds a docket entry for a Motion from the given draft', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const formFields = {
      dateReceivedDay: 12,
      dateReceivedMonth: 2,
      dateReceivedYear: 2002,
      eventCode: 'M000',
      freeText: 'making my way downtown, walking fast, all tests pass',
      hasOtherFilingParty: true,
      otherFilingParty: 'Vanessa Carlton',
    };

    for (const [key, value] of Object.entries(formFields)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest });
  });
};
