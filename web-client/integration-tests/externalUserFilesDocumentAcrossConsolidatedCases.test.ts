import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { externalUserFilesDocumentAcrossConsolidatedCase } from './journey/externalUserFilesDocumentForOwnedCaseForFilingAcrossConsolidatedCases';
import { fakeFile, loginAs, setupTest } from './helpers';
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

  beforeAll(async () => {
    await seedDatabase(seedData);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await seedFullDataset();
  });

  describe('irsPractitioner', () => {
    loginAs(cerebralTest, 'irspractitioner@example.com');
    it('should set case detail on state for each case in the consolidated cases group', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const consolidatedCases = cerebralTest.getState(
        'caseDetail.consolidatedCases',
      );

      const consolidatedCaseDetailGroup = await Promise.all(
        consolidatedCases.map(async consolidatedCase => {
          await cerebralTest.runSequence('gotoCaseDetailSequence', {
            docketNumber: consolidatedCase.docketNumber,
          });
          return cerebralTest.getState('caseDetail');
        }),
      );

      cerebralTest.consolidatedCaseDetailGroup = consolidatedCaseDetailGroup;
    });
    it('should file an external document across a consolidated cases group in a case they are associated with. (File Document flow)', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      cerebralTest.docketNumber = docketNumber;

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
    it('should verify docket entry was filed across the entire consolidated case group', async () => {
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

    loginAs(cerebralTest, 'irspractitioner@example.com');
    it('should set case detail on state for each case in the consolidated cases group', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const consolidatedCases = cerebralTest.getState(
        'caseDetail.consolidatedCases',
      );

      const consolidatedCaseDetailGroup = await Promise.all(
        consolidatedCases.map(async consolidatedCase => {
          await cerebralTest.runSequence('gotoCaseDetailSequence', {
            docketNumber: consolidatedCase.docketNumber,
          });
          return cerebralTest.getState('caseDetail');
        }),
      );

      cerebralTest.consolidatedCaseDetailGroup = consolidatedCaseDetailGroup;
    });
    it('file on a case in the group where no irsPractitioner is associated (File First Document flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '104-23',
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
    it('should file an external document across a consolidated cases group in a case they are associated with. (File Document flow)', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      cerebralTest.docketNumber = docketNumber;

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

    loginAs(cerebralTest, 'irspractitioner2@example.com');
    it('should set case detail on state for each case in the consolidated cases group', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const consolidatedCases = cerebralTest.getState(
        'caseDetail.consolidatedCases',
      );

      const consolidatedCaseDetailGroup = await Promise.all(
        consolidatedCases.map(async consolidatedCase => {
          await cerebralTest.runSequence('gotoCaseDetailSequence', {
            docketNumber: consolidatedCase.docketNumber,
          });
          return cerebralTest.getState('caseDetail');
        }),
      );

      cerebralTest.consolidatedCaseDetailGroup = consolidatedCaseDetailGroup;
    });
    it('file on a case where at least one irsPractitioner, but not themselves, is already associated (Request Access flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '105-23',
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
    it('should file an external document across a consolidated cases group in a case they are associated with. (File Document flow)', async () => {
      const docketNumber = '103-23';
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      cerebralTest.docketNumber = docketNumber;

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
  });
});
