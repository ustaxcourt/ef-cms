import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState } from '../helpers';
import { externalConsolidatedCaseGroupHelper as externalConsolidatedCaseGroupHelperComputed } from '../../src/presenter/computeds/externalConsolidatedCaseGroupHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

export const irsPractitionerRequestAccessToFileAcrossConsolidatedCasesGroup = (
  cerebralTest,
  { docketNumber, fakeFile },
) => {
  return it('IRS practitioner requests access to consolidated cases group', async () => {
    const caseDetailHeaderHelper = withAppContextDecorator(
      caseDetailHeaderComputed,
    );
    const externalConsolidatedCaseGroupHelper = withAppContextDecorator(
      externalConsolidatedCaseGroupHelperComputed,
    );

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showRequestAccessToCaseButton).toBe(true);

    const docketEntriesBefore = cerebralTest.getState(
      'caseDetail.docketEntries',
    ).length;

    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber,
    });

    const documentToSelect = {
      category: 'Appearance and Representation',
      certificateOfService: false,
      documentTitle: 'Entry of Appearance',
      documentTitleTemplate: 'Entry of Appearance for [Petitioner Names]',
      documentType: 'Entry of Appearance',
      eventCode: 'EA',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

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
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    let externalConsolidatedCasesHelper = runCompute(
      externalConsolidatedCaseGroupHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      externalConsolidatedCasesHelper.formattedConsolidatedCaseList.length,
    ).toEqual(4);

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    externalConsolidatedCasesHelper = runCompute(
      externalConsolidatedCaseGroupHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      externalConsolidatedCasesHelper.formattedConsolidatedCaseList.length,
    ).toEqual(4);
    expect(
      externalConsolidatedCasesHelper.consolidatedGroupServiceParties.length,
    ).toEqual(4);

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      docketEntriesBefore + 1,
    );
  });
};
