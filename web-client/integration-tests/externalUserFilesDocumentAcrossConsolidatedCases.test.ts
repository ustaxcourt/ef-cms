import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { getConsolidatedCasesDetails } from './journey/consolidation/getConsolidatedCasesDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

const verifyCorrectFileDocumentButton = (
  cerebralTest,
  {
    docketNumber,
    shouldShowFileDocumentButton = false,
    shouldShowFileFirstDocumentButton = false,
    shouldShowRequestAccessToCaseButton = false,
  },
) => {
  return it('should verify the correct filing button is displayed', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    const caseDetailHeaderHelper = withAppContextDecorator(
      caseDetailHeaderComputed,
    );

    const {
      showFileDocumentButton,
      showFileFirstDocumentButton,
      showRequestAccessToCaseButton,
    } = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });
    expect(showFileFirstDocumentButton).toBe(shouldShowFileFirstDocumentButton);
    expect(showFileDocumentButton).toBe(shouldShowFileDocumentButton);
    expect(showRequestAccessToCaseButton).toBe(
      shouldShowRequestAccessToCaseButton,
    );
  });
};

const verifyDocumentWasFiledAcrossConsolidatedCaseGroup = cerebralTest => {
  return it('should verify docket entry was filed across the entire consolidated case group', async () => {
    for (let consolidatedCase of cerebralTest.consolidatedCaseDetailGroup) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCase.docketNumber,
      });

      const consolidatedCaseAfter = cerebralTest.getState('caseDetail');
      expect(consolidatedCaseAfter.docketEntries.length).toEqual(
        consolidatedCase.docketEntries.length + 1,
      );
    }
  });
};

const verifyPractitionerAssociationAcrossConsolidatedCaseGroup = (
  cerebralTest,
  {
    expectedAssociation,
    practitionerRole,
  }: { expectedAssociation: boolean; practitionerRole: string },
) => {
  return it(`should verify that ${practitionerRole} is ${
    expectedAssociation ? '' : 'not'
  } associated with all of the cases in the consolidated group`, () => {
    const userId: string = cerebralTest.getState('user.userId');
    const consolidatedCases = cerebralTest.getState(
      'caseDetail.consolidatedCases',
    );

    consolidatedCases.forEach(aCase => {
      const practitioners =
        practitionerRole === 'irsPractitioner'
          ? aCase.irsPractitioners
          : aCase.privatePractitioners;
      const isAssociated = !!practitioners.find(
        practitioner => practitioner.userId === userId,
      );

      expect(isAssociated).toBe(expectedAssociation);
    });
  });
};

describe('External User files a document across a consolidated case group', () => {
  const cerebralTest = setupTest();

  const leadCaseDocketNumber = '102-67';
  const consolidatedCaseDocketNumber1 = '103-67';
  const consolidatedCaseDocketNumber2 = '104-67';
  const consolidatedCaseDocketNumber3 = '105-67';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('irsPractitioner', () => {
    loginAs(cerebralTest, 'irspractitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber1);
    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber1,
      shouldShowFileDocumentButton: true,
    });
    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile, true);
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber2);
    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber2,
      shouldShowFileDocumentButton: true,
    });
    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    loginAs(cerebralTest, 'irspractitioner2@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber3);

    verifyPractitionerAssociationAcrossConsolidatedCaseGroup(cerebralTest, {
      expectedAssociation: false,
      practitionerRole: 'irsPractitioner',
    });

    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber3,
      shouldShowRequestAccessToCaseButton: true,
    });
  });

  describe('privatePractitioner', () => {
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, leadCaseDocketNumber);

    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: leadCaseDocketNumber,
      shouldShowFileDocumentButton: true,
    });

    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile, true);

    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber3);

    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    verifyPractitionerAssociationAcrossConsolidatedCaseGroup(cerebralTest, {
      expectedAssociation: false,
      practitionerRole: 'privatePractitioner',
    });

    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber3,
      shouldShowRequestAccessToCaseButton: true,
    });

    it('practitioner requests access to case', async () => {
      await cerebralTest.runSequence('gotoRequestAccessSequence', {
        docketNumber: consolidatedCaseDocketNumber3,
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

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'primaryDocumentFile',
        value: fakeFile,
      });

      const contactPrimary = contactPrimaryFromState(cerebralTest);
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      });

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

      const createdDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(entry => entry.eventCode === 'LEA');

      expect(createdDocketEntry.filedBy).toEqual('Lilah Gilbert');
    });

    it('practitioner verifies association only with one case in the consolidated group', () => {
      const userId: string = cerebralTest.getState('user.userId');
      const consolidatedCases = cerebralTest.getState(
        'caseDetail.consolidatedCases',
      );

      consolidatedCases.forEach(aCase => {
        let expectedAssociation = false;
        if (aCase.docketNumber === consolidatedCaseDocketNumber3) {
          expectedAssociation = true;
        }

        const practitioners = aCase.privatePractitioners;
        const isAssociated = !!practitioners.find(
          practitioner => practitioner.userId === userId,
        );

        expect(isAssociated).toBe(expectedAssociation);
      });
    });
  });

  describe('petitioner', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber1);

    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile, true);

    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);
  });
});
