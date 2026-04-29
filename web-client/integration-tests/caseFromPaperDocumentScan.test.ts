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

  const scannerSources = ['scanner A', 'scanner B'];
  let scannerSourceIndex = 0;
  let scannerSourceName = scannerSources[scannerSourceIndex];

  const incrementScannerSource = () => {
    scannerSourceIndex = (scannerSourceIndex + 1) % scannerSources.length;
    scannerSourceName = scannerSources[scannerSourceIndex];
  };

  const petitionsClerkAddsScannedBatchAndIncrement = () => {
    petitionsClerkAddsScannedBatch(cerebralTest, {
      scannerSourceIndex,
      scannerSourceName,
    });
    incrementScannerSource();
  };

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
  petitionsClerkAddsScannedBatchAndIncrement();
  petitionsClerkDeletesScannedBatch(cerebralTest);
  petitionsClerkAddsScannedBatchAndIncrement();
  petitionsClerkAddsScannedBatchAndIncrement();
  petitionsClerkDeletesMultipleScannedBatches(cerebralTest, { numBatches: 2 });
  petitionsClerkAddsScannedBatchAndIncrement();
  petitionsClerkRescansAddedBatch(cerebralTest);
  petitionsClerkAddsScannedBatchAndIncrement();
  petitionsClerkCreatesScannedPDF(cerebralTest);
  petitionsClerkCreatesNewCase(cerebralTest, { shouldServe: false });
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  practitionerViewsCaseDetailWithPaperService(cerebralTest);
});
