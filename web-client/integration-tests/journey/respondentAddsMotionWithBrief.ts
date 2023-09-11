import { ExternalDocumentInformationFactory } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const respondentAddsMotionWithBrief = (
  cerebralTest,
  fakeFile,
  overrides,
) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Respondent adds Motion with supporting Brief', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      category:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.category,
      documentType:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .documentType[1],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Motion',
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .documentType[1],
    });

    const documentToSelect = {
      category: 'Motion',
      documentTitle: 'Motion for Continuance',
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
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
      'Motion for Continuance',
    );

    expect(cerebralTest.getState('form.partyPrimary')).toBeUndefined();

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
        key: 'certificateOfService',
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

    await cerebralTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocument',
        value: 'Brief in Support',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.category',
        value: 'Supporting Document',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.documentType',
        value: 'Brief in Support',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.previousDocument',
        value: {
          documentTitle: cerebralTest.getState('form.documentTitle'),
          documentType: cerebralTest.getState('form.documentType'),
        },
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

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.objections,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocumentFile,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.YES,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      overrides.documentCount,
    );
  });
};
