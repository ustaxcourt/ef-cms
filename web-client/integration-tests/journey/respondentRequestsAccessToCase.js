import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

export const respondentRequestsAccessToCase = (cerebralTest, fakeFile) => {
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
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
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

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
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
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
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
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
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

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');
  });
};
