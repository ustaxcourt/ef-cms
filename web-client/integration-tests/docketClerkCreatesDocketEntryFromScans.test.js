import {
  addBatchesForScanning,
  createPDFFromScannedBatches,
  selectScannerSource,
} from './scanHelpers';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFile } from './journey/docketClerkAddsDocketEntryFile';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkSavesAndServesDocketEntry } from './journey/docketClerkSavesAndServesDocketEntry';
import { docketClerkViewsEditDocketRecord } from './journey/docketClerkViewsEditDocketRecord';
import { docketClerkViewsQCInProgress } from './journey/docketClerkViewsQCInProgress';
import { docketClerkViewsSectionQCInProgress } from './journey/docketClerkViewsSectionQCInProgress';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('Create Docket Entry From Scans', () => {
  let scannerSourceIndex = 0;
  let scannerSourceName = 'scanner A';

  const { CASE_TYPES_MAP } = applicationContext.getConstants();

  beforeEach(() => {
    jest.setTimeout(30000);

    global.window.localStorage.getItem = key => {
      if (key === 'scannerSourceIndex') {
        return `"${scannerSourceIndex}"`;
      }

      if (key === 'scannerSourceName') {
        return `"${scannerSourceName}"`;
      }

      return null;
    };
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      caseType: CASE_TYPES_MAP.cdp,
      procedureType: 'Regular',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsDocketEntryWithoutFile(cerebralTest);

  docketClerkViewsQCInProgress(cerebralTest, true);
  docketClerkViewsSectionQCInProgress(cerebralTest, true);
  docketClerkViewsEditDocketRecord(cerebralTest);

  selectScannerSource(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  addBatchesForScanning(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  createPDFFromScannedBatches(cerebralTest);

  docketClerkAddsDocketEntryFile(cerebralTest, fakeFile);
  docketClerkSavesAndServesDocketEntry(cerebralTest);

  docketClerkViewsQCInProgress(cerebralTest, false);
  docketClerkViewsSectionQCInProgress(cerebralTest, false);
});
