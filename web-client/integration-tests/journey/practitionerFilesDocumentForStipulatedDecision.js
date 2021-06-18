import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const practitionerFilesDocumentForStipulatedDecision = (
  test,
  fakeFile,
) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Practitioner files document for stipulated decision', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    const documentToSelect = {
      category: 'Decision',
      documentTitle: 'Proposed Stipulated Decision',
      documentType: 'Proposed Stipulated Decision',
      eventCode: 'PSDE',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await test.runSequence('updateFileDocumentWizardFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Proposed Stipulated Decision',
    );

    expect(test.getState('form.partyPrimary')).toEqual(undefined);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'attachments',
      value: false,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
