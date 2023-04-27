import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { externalUserRequestAccessToFileAcrossConsolidatedCasesGroup } from './journey/externalUserRequestAccessToFileAcrossConsolidatedCasesGroup';
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

const verifyCorrectFileDocumentButton = (
  cerebralTest,
  {
    docketNumber,
    shouldShowFileDocumentButton = false,
    shouldShowFileFirstDocumentButton = false,
    shouldShowRequestAccessToCaseButton = false,
  },
) => {
  return it('file on a case where at least one irsPractitioner, but not themselves, is already associated (Request Access flow)', async () => {
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

describe('External User files a document across a consolidated case group', () => {
  const cerebralTest = setupTest();

  const consolidatedCaseDocketNumber1 = '103-23';
  const consolidatedCaseDocketNumber2 = '104-23';
  const consolidatedCaseDocketNumber3 = '105-23';

  const overrides = {
    fileAcrossConsolidatedGroup: true,
  };

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
    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile, overrides);
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    loginAs(cerebralTest, 'irspractitioner@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber2);
    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber2,
      shouldShowFileFirstDocumentButton: true,
    });
    externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);

    loginAs(cerebralTest, 'irspractitioner2@example.com');
    getConsolidatedCasesDetails(cerebralTest, consolidatedCaseDocketNumber3);
    verifyCorrectFileDocumentButton(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber3,
      shouldShowRequestAccessToCaseButton: true,
    });
    externalUserRequestAccessToFileAcrossConsolidatedCasesGroup(cerebralTest, {
      docketNumber: consolidatedCaseDocketNumber3,
      fakeFile,
    });
    verifyDocumentWasFiledAcrossConsolidatedCaseGroup(cerebralTest);
  });
});
