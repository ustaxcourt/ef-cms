import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { requestAccessHelper as requestAccessHelperComputed } from '../../src/presenter/computeds/requestAccessHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);
const requestAccessHelper = withAppContextDecorator(
  requestAccessHelperComputed,
);

export const practitionerRequestsAccessToCase = (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: test.getState(),
    });

    expect(headerHelper.showRequestAccessToCaseButton).toBeTruthy();

    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    const requestHelper = runCompute(requestAccessHelper, {
      state: test.getState(),
    });

    expect(requestHelper.showSecondaryParty).toBeTruthy();

    expect(contactSecondaryFromState(test).name).toEqual('Jimothy Schultz');

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Limited Entry of Appearance',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Limited Entry of Appearance for [Petitioner Names]',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'LEA',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    const contactPrimary = contactPrimaryFromState(test);
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    const contactSecondary = contactSecondaryFromState(test);
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: `filersMap.${contactSecondary.contactId}`,
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Limited Entry of Appearance for Petrs. Mona Schultz & Jimothy Schultz',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
