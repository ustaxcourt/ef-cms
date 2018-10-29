import { CerebralTest } from 'cerebral/test';
import assert from 'assert';
import nock from 'nock';
import { JSDOM } from 'jsdom';

import mainModule from './';
import environment from '../environments/dev';

mainModule.providers.environment = environment;
mainModule.providers.router = {
  route: () => {
    // no-op, we have no URLs!
  },
};

const jsdom = new JSDOM('');
global.window = jsdom.window;
global.FormData = jsdom.window.FormData;
global.Blob = jsdom.window.Blob;

const test = CerebralTest(mainModule);

const fakePolicy = {
  url: 'https://s3.us-east-1.amazonaws.com/efcms-documents-will-us-east-1',
  fields: {
    bucket: 'efcms-documents-will-us-east-1',
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential':
      'ASIAXQCLQG6G4FDXSSVO/20181026/us-east-1/s3/aws4_request',
    'X-Amz-Date': '20181026T180011Z',
    'X-Amz-Security-Token':
      'FQoGZXIvYXdzEDEaDLXweCFr7xAozoAKWSL0AZpKChRo509jGhDKeXxEmvzIymlH8mTXXTJoQcxBHeLnijfWmno/LJpqlgfbda0T6pQQev8n7QRY6OTcw6VdVhQ6Y1tpKJ7l47w6bQlB1JggcmwyWrVDWfvC05yyNucEfPt5edLvhOul7M5DiuscK683av1/OqPjHLHAOlE+ZUYC42d0kji2hftmDGhKakpv/no440at1mKM1UlVb3iLTv7khSHKFo5iokPWDWcpL01OVK1j1+tu2Qo3kbTk0neTvJ1J7aNxjfRCv/gF0or3/e6Q9MDBq0YxK+U39qgFosxEcVmO4vLpSAKDAm+jRUJIHLwmIDUonuPM3gU=',
    Policy:
      'eyJleHBpcmF0aW9uIjoiMjAxOC0xMC0yNlQxOTowMDoxMVoiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCIiXSx7ImJ1Y2tldCI6ImVmY21zLWRvY3VtZW50cy13aWxsLXVzLWVhc3QtMSJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFTSUFYUUNMUUc2RzRGRFhTU1ZPLzIwMTgxMDI2L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDE4MTAyNlQxODAwMTFaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IkZRb0daWEl2WVhkekVERWFETFh3ZUNGcjd4QW96b0FLV1NMMEFacEtDaFJvNTA5akdoREtlWHhFbXZ6SXltbEg4bVRYWFRKb1FjeEJIZUxuaWpmV21uby9MSnBxbGdmYmRhMFQ2cFFRZXY4bjdRUlk2T1RjdzZWZFZoUTZZMXRwS0o3bDQ3dzZiUWxCMUpnZ2Ntd3lXclZEV2Z2QzA1eXlOdWNFZlB0NWVkTHZoT3VsN001RGl1c2NLNjgzYXYxL09xUGpITEhBT2xFK1pVWUM0MmQwa2ppMmhmdG1ER2hLYWtwdi9ubzQ0MGF0MW1LTTFVbFZiM2lMVHY3a2hTSEtGbzVpb2tQV0RXY3BMMDFPVksxajErdHUyUW8za2JUazBuZVR2SjFKN2FOeGpmUkN2L2dGMG9yMy9lNlE5TURCcTBZeEsrVTM5cWdGb3N4RWNWbU80dkxwU0FLREFtK2pSVUpJSEx3bUlEVW9udVBNM2dVPSJ9XX0=',
    'X-Amz-Signature':
      '446ea8b85f9c472b186aada62cd780f2cd4733ade7384ce5e2b16e1ce47c45f7',
  },
};

describe('Main cerebral module', () => {
  it('Handles routing', async () => {
    await test.runSequence('gotoStyleGuide');
    assert.equal(test.getState('currentPage'), 'StyleGuide');
    await test.runSequence('gotoHome');
    assert.equal(test.getState('currentPage'), 'Home');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), true);
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), false);
  });

  it('document policy success', async () => {
    nock(environment.getBaseUrl())
      .get('/documents/policy')
      .reply(200, fakePolicy);
    await test.runSequence('submitFilePetition');
    assert.deepEqual(test.getState('petition.policy'), fakePolicy);
  });

  it('document policy error', async () => {
    nock(environment.getBaseUrl())
      .get('/documents/policy')
      .reply(403);
    await test.runSequence('submitFilePetition');
    assert.equal(
      test.getState('alertError'),
      'Document policy retrieval failed',
    );
  });

  it('document policy success', async () => {
    test.setState('petition.petitionFile.file', new Blob(['blob']));
    test.setState('petition.requestForPlaceOfTrial.file', new Blob(['blob']));
    test.setState(
      'petition.statementOfTaxpayerIdentificationNumber.file',
      new Blob(['blob']),
    );

    const fakeDocument = {
      documentId: '691ca306-b30f-429c-b785-17754b8fd019',
      createdAt: '2018-10-26T22:13:31.830Z',
      userId: '1234',
      documentType: 'test',
    };

    nock(environment.getBaseUrl())
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/documents/policy')
      .reply(200, fakePolicy)
      .post('/documents')
      .reply(200, fakeDocument)
      .post(fakePolicy.url)
      .reply(204)
      .post('/documents')
      .reply(200, fakeDocument)
      .post(fakePolicy.url)
      .reply(204)
      .post('/documents')
      .reply(200, fakeDocument)
      .post(fakePolicy.url)
      .reply(204);

    await test.runSequence('submitFilePetition');
    assert.deepEqual(test.getState('petition.policy'), fakePolicy);
    assert.equal(
      test.getState('petition.petitionFile.documentId'),
      fakeDocument.documentId,
      'petitionFile has an ID',
    );
    assert.equal(
      test.getState('petition.requestForPlaceOfTrial.documentId'),
      fakeDocument.documentId,
      'requestForPlaceOfTrial has an ID',
    );
    assert.equal(
      test.getState(
        'petition.statementOfTaxpayerIdentificationNumber.documentId',
      ),
      fakeDocument.documentId,
      'statementOfTaxpayerIdentificationNumber has an ID',
    );
    assert.equal(test.getState('alertError'), '');
    assert.equal(
      test.getState('alertSuccess'),
      'Your files were uploaded successfully.',
    );
  });
});
