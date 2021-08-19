import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const externalUserFilesDocumentForOwnedCase = (
  cerebralTest,
  fakeFile,
) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('external user files a document for owned case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntriesBefore = cerebralTest.getState(
      'caseDetail.docketEntries',
    ).length;

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
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceMonth',
        value: '12',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceDay',
        value: '12',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '2000',
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

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      docketEntriesBefore + 1,
    );
  });
};
