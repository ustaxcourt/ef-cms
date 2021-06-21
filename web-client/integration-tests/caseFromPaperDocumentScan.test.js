import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAddsScannedBatch } from './journey/petitionsClerkAddsScannedBatch';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkCreatesScannedPDF } from './journey/petitionsClerkCreatesScannedPDF';
import { petitionsClerkDeletesMultipleScannedBatches } from './journey/petitionsClerkDeletesMultipleScannedBatches';
import { petitionsClerkDeletesScannedBatch } from './journey/petitionsClerkDeletesScannedBatch';
import { petitionsClerkRescansAddedBatch } from './journey/petitionsClerkRescansAddedBatch';
import { petitionsClerkSelectsScannerSource } from './journey/petitionsClerkSelectsScannerSource';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { petitionsClerkViewsCreateNewCase } from './journey/petitionsClerkViewsCreateNewCase';
import { petitionsClerkViewsScanView } from './journey/petitionsClerkViewsScanView';
import { practitionerViewsCaseDetailWithPaperService } from './journey/practitionerViewsCaseDetailWithPaperService';

const test = setupTest();

describe('Case from Paper Document Scan journey', () => {
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

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCreateNewCase(test);
  petitionsClerkViewsScanView(test);
  petitionsClerkSelectsScannerSource(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesScannedBatch(test);
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesMultipleScannedBatches(test, { numBatches: 2 });
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkRescansAddedBatch(test);
  petitionsClerkAddsScannedBatch(test, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkCreatesScannedPDF(test);
  petitionsClerkCreatesNewCase(test, fakeFile, undefined, false);
  petitionsClerkSubmitsPaperCaseToIrs(test);

  loginAs(test, 'irsPractitioner@example.com');
  practitionerViewsCaseDetailWithPaperService(test);
});
