import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesADocumentForCase = (cerebralTest, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Petitioner files a document for case', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Civil Penalty Approval Form',
      documentType: 'Civil Penalty Approval Form',
      eventCode: 'CIVP',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Civil Penalty Approval Form',
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
        value: true,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'hasSupportingDocuments',
        value: false,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'attachments',
        value: false,
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2000',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
