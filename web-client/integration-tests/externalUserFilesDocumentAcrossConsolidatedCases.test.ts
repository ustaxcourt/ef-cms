import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { externalUserFilesDocumentAcrossConsolidatedCase } from './journey/externalUserFilesDocumentForOwnedCaseForFilingAcrossConsolidatedCases';
import { fakeFile, loginAs, setupTest } from './helpers';
import { getConsolidatedCasesDetails } from './journey/consolidation/getConsolidatedCasesDetails';
import { runCompute } from 'cerebral/test';
import { seedData } from './fixtures/consolidated-case-group-for-external-multidocketing';
import { seedDatabase, seedFullDataset } from './utils/database';
import { withAppContextDecorator } from '../src/withAppContext';

// Feature flag: consolidated-cases-group-access-petitioner, CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderComputed,
);

// const externalConsolidatedCaseGroupHelper = withAppContextDecorator(
//   externalConsolidatedCaseGroupHelperComputed,
// );

describe('External User files a document across a consolidated case group', () => {
  const cerebralTest = setupTest();

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
    it('should file an external document across a consolidated cases group in a case they are associated with. (File Document flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCaseDocketNumber1,
      });

      const {
        showFileDocumentButton,
        showFileFirstDocumentButton,
        showRequestAccessToCaseButton,
      } = runCompute(caseDetailHeaderHelper, {
        state: cerebralTest.getState(),
      });
      expect(showFileFirstDocumentButton).toBe(false);
      expect(showRequestAccessToCaseButton).toBe(false);
      expect(showFileDocumentButton).toBe(true);
    });
    externalUserFilesDocumentAcrossConsolidatedCase(cerebralTest, fakeFile);
    verifyConsolidatedGroupFiling(cerebralTest);

    loginAs(cerebralTest, 'irspractitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber2);
    it('file on a case in the group where no irsPractitioner is associated (File First Document flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCaseDocketNumber2,
      });

      const {
        showFileDocumentButton,
        showFileFirstDocumentButton,
        showRequestAccessToCaseButton,
      } = runCompute(caseDetailHeaderHelper, {
        state: cerebralTest.getState(),
      });
      expect(showRequestAccessToCaseButton).toBe(false);
      expect(showFileDocumentButton).toBe(false);
      expect(showFileFirstDocumentButton).toBe(true);
    });
    externalUserFilesDocumentAcrossConsolidatedCase(cerebralTest, fakeFile);
    verifyConsolidatedGroupFiling(cerebralTest);

    loginAs(cerebralTest, 'irspractitioner2@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber3);
    it('file on a case where at least one irsPractitioner, but not themselves, is already associated (Request Access flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCaseDocketNumber3,
      });

      const {
        showFileDocumentButton,
        showFileFirstDocumentButton,
        showRequestAccessToCaseButton,
      } = runCompute(caseDetailHeaderHelper, {
        state: cerebralTest.getState(),
      });
      expect(showFileFirstDocumentButton).toBe(false);
      expect(showFileDocumentButton).toBe(false);
      expect(showRequestAccessToCaseButton).toBe(true);
    });
    externalUserFilesDocumentAcrossConsolidatedCase(cerebralTest, fakeFile);
    verifyConsolidatedGroupFiling(cerebralTest);
  });
});

const verifyConsolidatedGroupFiling = cerebralTest => {
  return it('should verify docket entry was filed across the entire consolidated case group', async () => {
    cerebralTest.consolidatedCaseDetailGroup.forEach(
      async consolidatedCaseBefore => {
        await cerebralTest.runSequence('gotoCaseDetailSequence', {
          docketNumber: consolidatedCaseBefore.docketNumber,
        });

        const consolidatedCaseAfter = cerebralTest.getState('caseDetail');

        expect(consolidatedCaseAfter.docketEntries.length).toEqual(
          consolidatedCaseBefore.docketEntries.length + 1,
        );
      },
    );
  });
};
