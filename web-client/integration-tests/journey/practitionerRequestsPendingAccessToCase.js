import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

export const practitionerRequestsPendingAccessToCase = (test, fakeFile) => {
  return it('Practitioner requests access to pending case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'M107',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'exhibits',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion to Substitute Parties and Change Caption',
    );
    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('wizardStep')).toBe('RequestAccessReview');

    await test.runSequence('submitCaseAssociationRequestSequence');

    expect(test.getState('wizardStep')).toBeUndefined();
  });
};
