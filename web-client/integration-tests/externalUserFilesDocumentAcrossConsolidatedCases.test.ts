import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { getConsolidatedCasesDetails } from './journey/consolidation/getConsolidatedCasesDetails';
import { irsPractitionerRequestAccessToFileAcrossConsolidatedCasesGroup } from './journey/irsPractitionerRequestAccessToFileAcrossConsolidatedCasesGroup';
import { runCompute } from 'cerebral/test';
import { seedData } from './fixtures/consolidated-case-group-for-external-multidocketing';
import { seedDatabase, seedFullDataset } from './utils/database';
import { withAppContextDecorator } from '../src/withAppContext';

// Feature flag: consolidated-cases-group-access-petitioner, CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderComputed,
);

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
    await Promise.all(
      cerebralTest.consolidatedCaseDetailGroup.map(
        async consolidatedCaseBefore => {
          await cerebralTest.runSequence('gotoCaseDetailSequence', {
            docketNumber: consolidatedCaseBefore.docketNumber,
          });

          const consolidatedCaseAfter = cerebralTest.getState('caseDetail');

          expect(consolidatedCaseAfter.docketEntries.length).toEqual(
            consolidatedCaseBefore.docketEntries.length + 1,
          );
        },
      ),
    );
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

  const leadCaseDocketNumber = '102-23';
  const consolidatedCaseDocketNumber1 = '103-23';
  const consolidatedCaseDocketNumber2 = '104-23';
  const consolidatedCaseDocketNumber3 = '105-23';

  beforeAll(async () => {
    await seedDatabase(seedData);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await seedFullDataset();
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

    loginAs(cerebralTest, 'irspractitioner@example.com');
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
    irsPractitionerRequestAccessToFileAcrossConsolidatedCasesGroup(
      cerebralTest,
      {
        docketNumber: consolidatedCaseDocketNumber3,
        fakeFile,
      },
    );
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);
    verifyPractitionerAssociationAcrossConsolidatedCaseGroup(cerebralTest, {
      expectedAssociation: true,
      practitionerRole: 'irsPractitioner',
    });
  });

  describe('privatePractitioner', () => {
    loginAs(cerebralTest, 'privatepractitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, leadCaseDocketNumber);
    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: leadCaseDocketNumber,
      shouldShowFileDocumentButton: true,
    });
    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile, true);
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber3);

    loginAs(cerebralTest, 'privatepractitioner2@example.com');

    verifyPractitionerAssociationAcrossConsolidatedCaseGroup(cerebralTest, {
      expectedAssociation: false,
      practitionerRole: 'privatePractitioner',
    });

    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber3,
      shouldShowRequestAccessToCaseButton: true,
    });

    it('Practitioner requests access to case', async () => {
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

    it('Practitioner verifies association only with one case in the consolidated group', () => {
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
