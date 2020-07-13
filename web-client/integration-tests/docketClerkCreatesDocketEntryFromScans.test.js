import {
  addBatchesForScanning,
  createPDFFromScannedBatches,
  selectScannerSource,
} from './scanHelpers';
import { docketClerkAddsDocketEntryFile } from './journey/docketClerkAddsDocketEntryFile';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkSavesDocketEntry } from './journey/docketClerkSavesDocketEntry';
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

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile, { caseType: 'CDP (Lien/Levy)' });

  loginAs(test, 'docketclerk');
  docketClerkAddsDocketEntryWithoutFile(test);
  docketClerkSavesDocketEntry(test, false);
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
  createPDFFromScannedBatches(test, {
    scannerSourceIndex,
    scannerSourceName,
  });

  docketClerkAddsDocketEntryFile(test, fakeFile);
  docketClerkSavesDocketEntry(test, true);
  docketClerkViewsQCInProgress(test, false);
  docketClerkViewsSectionQCInProgress(test, false);
});
