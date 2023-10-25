import { CaseAssociationRequestDocumentBase } from '../../../shared/src/business/entities/caseAssociation/CaseAssociationRequestDocumentBase';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const customMessages = extractCustomMessages(
  CaseAssociationRequestDocumentBase.VALIDATION_RULES,
);

export const respondentRequestsAccessToCase = (cerebralTest, fakeFile) => {
  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderHelperComputed,
  );

  return it('Respondent requests access to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const helper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showFileFirstDocumentButton).toBeFalsy();

    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitleTemplate: customMessages.documentTitleTemplate[0],
      documentType: customMessages.documentType[0],
      eventCode: customMessages.eventCode[0],
      primaryDocumentFile: customMessages.primaryDocumentFile[0],
      scenario: customMessages.scenario[0],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Entry of Appearance',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Entry of Appearance for [Petitioner Names]',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'EA',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'generationType',
      value: GENERATION_TYPES.MANUAL,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: customMessages.primaryDocumentFile[0],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate: customMessages.certificateOfServiceDate[0],
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
      certificateOfServiceDate: customMessages.certificateOfServiceDate[0],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'Entry of Appearance for Respondent',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('openPdfPreviewModalSequence', {
      file: fakeFile,
      modalId: 'PDFPreviewModal-Entry of Appearance for Respondent',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
