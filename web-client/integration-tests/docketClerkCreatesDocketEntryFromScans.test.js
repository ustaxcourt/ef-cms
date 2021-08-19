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
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';

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
  petitionerChoosesProcedureType(cerebralTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile, {
    caseType: CASE_TYPES_MAP.cdp,
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
