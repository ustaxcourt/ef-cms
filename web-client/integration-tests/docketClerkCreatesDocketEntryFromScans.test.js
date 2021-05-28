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

const test = setupTest();

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
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile, { caseType: CASE_TYPES_MAP.cdp });

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsDocketEntryWithoutFile(test);

  docketClerkViewsQCInProgress(test, true);
  docketClerkViewsSectionQCInProgress(test, true);
  docketClerkViewsEditDocketRecord(test);

  selectScannerSource(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  addBatchesForScanning(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  createPDFFromScannedBatches(test);

  docketClerkAddsDocketEntryFile(test, fakeFile);
  docketClerkSavesAndServesDocketEntry(test);

  docketClerkViewsQCInProgress(test, false);
  docketClerkViewsSectionQCInProgress(test, false);
});
