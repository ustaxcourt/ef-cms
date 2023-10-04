import { CaseAssociationRequestDocumentBase } from '../../../shared/src/business/entities/caseAssociation/CaseAssociationRequestDocumentBase';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { requestAccessHelper as requestAccessHelperComputed } from '../../src/presenter/computeds/requestAccessHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const practitionerRequestsAccessToCaseManual = (
  cerebralTest,
  fakeFile,
) => {
  return it('Practitioner requests access to case', async () => {
    const caseDetailHeaderHelper = withAppContextDecorator(
      caseDetailHeaderHelperComputed,
    );
    const requestAccessHelper = withAppContextDecorator(
      requestAccessHelperComputed,
    );

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showRequestAccessToCaseButton).toBeTruthy();

    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const requestHelper = runCompute(requestAccessHelper, {
      state: cerebralTest.getState(),
    });

    expect(requestHelper.showSecondaryParty).toBeTruthy();

    expect(contactSecondaryFromState(cerebralTest).name).toEqual(
      'Jimothy Schultz',
    );

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitleTemplate:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .documentTitleTemplate,
      documentType:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .documentType[1],
      eventCode:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.eventCode,
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
      scenario:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.scenario,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Limited Entry of Appearance',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Limited Entry of Appearance for [Petitioner Names]',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'LEA',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .primaryDocumentFile,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .certificateOfServiceDate[1],
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES
          .certificateOfServiceDate[0].message,
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers:
        CaseAssociationRequestDocumentBase.VALIDATION_ERROR_MESSAGES.filers,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
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
      'Limited Entry of Appearance for Petrs. Mona Schultz & Jimothy Schultz',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    const createdDocketEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.eventCode === 'LEA');

    expect(createdDocketEntry.filedBy).toEqual('Test Private Practitioner');
  });
};
