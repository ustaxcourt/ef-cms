import { ExternalDocumentInformationFactory } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesDocumentForCase = (cerebralTest, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('petitioner files document for case', async () => {
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
        value: 'Answer (filed by respondent only)',
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .documentType[1],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentType',
        value: 'Answer',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Answer',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'eventCode',
        value: 'A',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'scenario',
        value: 'Standard',
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual('Answer');

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Motion',
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .documentType[1],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentType',
        value: 'Motion for Leave to File Out of Time',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Motion for Leave to File Out of Time [Document Name]',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'eventCode',
        value: 'M014',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'scenario',
        value: 'Nonstandard H',
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      secondaryDocument: {
        category:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .documentType[1],
      },
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.category',
        value: 'Statement',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.documentType',
        value: 'Statement',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.documentTitle',
        value: 'Statement [anything]',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.eventCode',
        value: 'STAT',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.scenario',
        value: 'Nonstandard B',
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      secondaryDocument: {
        freeText:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .freeText[0].message,
      },
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.freeText',
        value: 'Anything',
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
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

    expect(cerebralTest.getState('form.filers')).toEqual([
      contactPrimary.contactId,
    ]);

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
        value: true,
      },
    );

    await cerebralTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .certificateOfServiceDate[1],
      objections:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocument,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .certificateOfServiceDate[1],
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocument,
        },
      ],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/5000',
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .certificateOfServiceDate[0].message,
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocument,
        },
      ],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2000',
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocument,
        },
      ],
    });

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
        value: 'Affidavit in Support',
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
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocument',
        value: 'Affidavit in Support',
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocumentFile,
          supportingDocumentFreeText:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocumentFreeText,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFreeText',
        value: 'Affidavit in Support',
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      secondaryDocumentFile:
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
          .secondaryDocumentFile,
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
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocumentFile',
        value: fakeFile,
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary',
    });

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocument:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocument,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.category',
        value: 'Supporting Document',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.documentType',
        value: 'Declaration in Support',
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.previousDocument',
        value: {
          documentTitle: cerebralTest.getState(
            'form.secondaryDocument.documentTitle',
          ),
          documentType: cerebralTest.getState(
            'form.secondaryDocument.documentType',
          ),
        },
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocument',
        value: 'Declaration in Support',
      },
    );

    await cerebralTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocumentFile,
          supportingDocumentFreeText:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .supportingDocumentFreeText,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocumentFreeText',
        value: 'Declaration in Support',
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
