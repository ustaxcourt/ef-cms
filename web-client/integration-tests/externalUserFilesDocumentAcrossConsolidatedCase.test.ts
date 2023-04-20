import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { loginAs, setupTest } from './helpers';
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
    it('should file an external document across a consolidated case group in a case they are associated with. (File Document flow)', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '103-23',
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

    loginAs(cerebralTest, 'irspractitioner@example.com');
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

    loginAs(cerebralTest, 'irspractitioner2@example.com');
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
  });
});
