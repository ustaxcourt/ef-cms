import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { contactSecondaryFromState } from '../helpers';

export const practitionerRequestsPendingAccessToCase = (
  cerebralTest,
  fakeFile,
) => {
  return it('Practitioner requests access to pending case', async () => {
    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitleTemplate: 'Select a document',
      documentType: 'Select a document type',
      eventCode: 'Select a document',
      filers: 'Select a party',
      primaryDocumentFile: 'Upload a document',
      scenario: 'Select a document',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'M107',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers: 'Select a party',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'Upload a document',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    const contactSecondary = contactSecondaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: `filersMap.${contactSecondary.contactId}`,
      value: true,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'Motion to Substitute Parties and Change Caption',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('wizardStep')).toBe('RequestAccessReview');

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    expect(cerebralTest.getState('wizardStep')).toBeUndefined();
  });
};
