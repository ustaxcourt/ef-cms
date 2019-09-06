import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { JSDOM } from 'jsdom';
import { MAX_FILE_SIZE_MB } from '../../shared/src/persistence/s3/getUploadPolicy';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import {
  addBatchesForScanning,
  createPDFFromScannedBatches,
  selectScannerSource,
} from './scanHelpers.js';
import { applicationContext } from '../src/applicationContext';
import { getScannerInterface } from '../../shared/src/persistence/dynamsoft/getScannerMockInterface';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
import docketClerkAddsDocketEntryFile from './journey/docketClerkAddsDocketEntryFile';
import docketClerkAddsDocketEntryWithoutFile from './journey/docketClerkAddsDocketEntryWithoutFile';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSavesDocketEntry from './journey/docketClerkSavesDocketEntry';
import docketClerkViewsEditDocketRecord from './journey/docketClerkViewsEditDocketRecord';
import docketClerkViewsQCInProgress from './journey/docketClerkViewsQCInProgress';
import docketClerkViewsSectionQCInProgress from './journey/docketClerkViewsSectionQCInProgress';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerSignsOut from './journey/taxpayerSignsOut';

let test;
global.FormData = FormData;
presenter.providers.applicationContext = Object.assign(applicationContext, {
  getScanner: getScannerInterface,
});
presenter.providers.router = {
  createObjectURL: () => {},
  externalRoute: () => {},
  revokeObjectURL: () => {},
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const dom = new JSDOM(`<!DOCTYPE html>
<body>
  <input type="file" />
</body>`);

const { window } = dom;
const { Blob, File } = window;

test = CerebralTest(presenter);

describe('Create Docket Entry From Scans', () => {
  let scannerSourceIndex = 0;
  let scannerSourceName = 'scanner A';

  beforeEach(() => {
    jest.setTimeout(30000);
    global.alert = () => null;
    global.URL = {
      createObjectURL: () => {
        return fakeData;
      },
      revokeObjectURL: () => null,
    };
    global.window = {
      URL: global.URL,
      localStorage: {
        getItem: key => {
          if (key === 'scannerSourceIndex') {
            return `"${scannerSourceIndex}"`;
          }

          if (key === 'scannerSourceName') {
            return `"${scannerSourceName}"`;
          }

          return null;
        },
        removeItem: () => null,
        setItem: () => null,
      },
    };

    global.File = File;
    global.Blob = Blob;

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      MAX_FILE_SIZE_MB,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test, { procedureType: 'Regular' });
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile, { caseType: 'CDP (Lien/Levy)' });
  taxpayerSignsOut(test);

  docketClerkLogIn(test);
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
