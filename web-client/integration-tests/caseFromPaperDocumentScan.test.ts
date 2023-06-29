import { loginAs, setupTest } from './helpers';
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

describe('Case from Paper Document Scan journey', () => {
  const cerebralTest = setupTest();

  let scannerSourceIndex = 0;
  let scannerSourceName = 'scanner A';

  beforeEach(() => {
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

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCreateNewCase(cerebralTest);
  petitionsClerkViewsScanView(cerebralTest);
  petitionsClerkSelectsScannerSource(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesScannedBatch(cerebralTest);
  petitionsClerkAddsScannedBatch(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkAddsScannedBatch(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkDeletesMultipleScannedBatches(cerebralTest, { numBatches: 2 });
  petitionsClerkAddsScannedBatch(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkRescansAddedBatch(cerebralTest);
  petitionsClerkAddsScannedBatch(cerebralTest, {
    scannerSourceIndex,
    scannerSourceName,
  });
  petitionsClerkCreatesScannedPDF(cerebralTest);
  petitionsClerkCreatesNewCase(cerebralTest, { shouldServe: false });
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  practitionerViewsCaseDetailWithPaperService(cerebralTest);
});
