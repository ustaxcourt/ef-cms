import {
  contactPrimaryFromState,
  fakeFile1,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Petitioner files an encrypted document', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner3@example.com');
  it('login as a petitioner and create a case', async () => {
    const { docketNumber } = await uploadPetition(
      cerebralTest,
      {},
      'petitioner3@example.com',
    );

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'petitioner3@example.com');
  it('petitioner files an encrypted document on their case', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { contactId } = contactPrimaryFromState(cerebralTest);
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const answerFormValues = {
      category: 'Answer',
      documentType: 'Answer',
      documentTitle: 'Answer - PDF is Encrypted',
      eventCode: 'A',
      scenario: 'Standard',
      primaryDocumentFile: fakeFile1,
      [`filersMap.${contactId}`]: true,
      certificateOfService: false,
      hasSupportingDocuments: false,
    };

    for (let [key, value] of Object.entries(answerFormValues)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'FileUploadErrorModal',
    );
  });
});
