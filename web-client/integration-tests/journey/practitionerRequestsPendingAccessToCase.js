import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactSecondaryFromState } from '../helpers';

export const practitionerRequestsPendingAccessToCase = (
  cerebralTest,
  fakeFile,
) => {
  const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Practitioner requests access to pending case', async () => {
    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
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
      filers: VALIDATION_ERROR_MESSAGES.filers,
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
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
