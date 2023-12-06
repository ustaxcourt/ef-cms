import { FORMATS } from '@shared/business/utilities/DateHandler';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { requestAccessHelper as requestAccessHelperComputed } from '../../src/presenter/computeds/requestAccessHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const practitionerRequestsAccessToCaseManual = (
  cerebralTest,
  fakeFile,
) => {
  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderHelperComputed,
  );
  const requestAccessHelper = withAppContextDecorator(
    requestAccessHelperComputed,
  );

  return it('Practitioner requests access to case', async () => {
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
      documentTitleTemplate: 'Select a document',
      documentType: 'Select a document type',
      eventCode: 'Select a document',
      filers: 'Select a party',
      primaryDocumentFile: 'Upload a document',
      scenario: 'Select a document',
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
      filers: 'Select a party',
      primaryDocumentFile: 'Upload a document',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers: 'Select a party',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter date of service',
      filers: 'Select a party',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/5000',
      },
    );

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        'Certificate of Service date cannot be in the future. Enter a valid date.',
      filers: 'Select a party',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2000',
      },
    );

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      filers: 'Select a party',
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
