import { caseAssociationRequestHelper as caseAssociationRequestHelperComputed } from '../../src/presenter/computeds/caseAssociationRequestHelper';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const practitionerRequestsAccessToCaseAutoGenerated = cerebralTest => {
  return it('Practitioner requests access to case by filing an auto generated EA', async () => {
    const caseDetailHeaderHelper = withAppContextDecorator(
      caseDetailHeaderHelperComputed,
    );
    const caseAssociationRequestHelper = withAppContextDecorator(
      caseAssociationRequestHelperComputed,
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

    const requestHelper = runCompute(caseAssociationRequestHelper, {
      state: cerebralTest.getState(),
    });

    expect(requestHelper.showSecondaryParty).toBeTruthy();

    expect(contactSecondaryFromState(cerebralTest).name).toEqual(
      'Jimothy Schultz',
    );

    await cerebralTest.runSequence('reviewCaseAssociationRequestSequence');

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

    await cerebralTest.runSequence('reviewCaseAssociationRequestSequence');

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'Entry of Appearance for Petrs. Mona Schultz & Jimothy Schultz',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    const createdDocketEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.eventCode === 'EA');

    expect(createdDocketEntry.filedBy).toEqual('Test Private Practitioner');
  });
};
