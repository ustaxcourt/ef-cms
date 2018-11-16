import assert from 'assert';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import applicationContext from '../environments/mock';
import awsPersistenceGateway from './awsPersistenceGateway';
import CaseInitiator from '../entities/CaseInitiator';

const UPLOAD_POLICY_ROUTE = `${applicationContext.getBaseUrl()}/documents/uploadPolicy`;
const CASES_BASE_ROUTE = `${applicationContext.getBaseUrl()}/cases`;
const CASE_ROUTE = `${applicationContext.getBaseUrl()}/cases/fakeCaseId`;

const fakeCase = {
  caseId: 'f41d33b2-3127-4256-a63b-a6ea7181645b',
  createdAt: '2018-11-14T18:26:20.121Z',
  userId: 'taxpayer',
  docketNumber: '00107-18',
  documents: [
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      createdAt: '2018-11-12T18:26:19.852Z',
      userId: { name: 'taxpayer' },
      documentType: 'petitionFile',
      type: 'petitionFile',
    },
    {
      documentId: '5f348cd1-ec42-4838-b58c-6fd3e8dbedb6',
      createdAt: '2018-11-12T18:26:19.897Z',
      userId: { name: 'taxpayer' },
      documentType: 'requestForPlaceOfTrial',
      type: 'requestForPlaceOfTrial',
    },
    {
      documentId: '0e0fadf0-1650-44e1-8c9e-bc19829219e7',
      createdAt: '2018-11-12T18:26:19.946Z',
      userId: { name: 'taxpayer' },
      documentType: 'statementOfTaxpayerIdentificationNumber',
      type: 'statementOfTaxpayerIdentificationNumber',
    },
  ],
  status: 'new',
};

let olderFakeCase = { ...fakeCase };
olderFakeCase.createdAt = '2018-11-12T18:26:20.121Z';
olderFakeCase.caseId = 'f41d33b2-3127-4256-a63b-a6ea7181645a';

const fakeCases = [fakeCase, olderFakeCase];

const fakePolicy = {
  url: 'https://s3.us-east-1.amazonaws.com/fakeBucket',
  fields: {
    bucket: 'efcms-documents-will-us-east-1',
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': 'fakeCredential',
    'X-Amz-Date': '20181026T180011Z',
    'X-Amz-Security-Token': 'fakeToken',
    Policy: 'fakePolicy',
    'X-Amz-Signature': 'fakeSignature',
  },
};

const fakeDocumentId = {
  documentId: '691ca306-b30f-429c-b785-17754b8fd019',
  createdAt: '2018-10-26T22:13:31.830Z',
  userId: '1234',
  documentType: 'test',
};

describe('AWS petition gateway', () => {
  describe('Get user', () => {
    it('Success taxpayer', async () => {
      const user = awsPersistenceGateway.getUser('taxpayer');
      assert.equal(user.userId, 'taxpayer');
      assert.equal(user.role, 'taxpayer');
    });
    it('Success petitionsclerk', async () => {
      const user = awsPersistenceGateway.getUser('petitionsclerk');
      assert.equal(user.userId, 'petitionsclerk');
      assert.equal(user.role, 'petitionsclerk');
    });
    it('Failure', async () => {
      try {
        awsPersistenceGateway.getUser('Bad actor');
      } catch (e) {
        assert.equal(e.message, 'Username is incorrect');
      }
    });
  });

  describe('Get cases for taxpayer', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('Success', async () => {
      mock.onGet(CASES_BASE_ROUTE).reply(200, fakeCases);

      const cases = await awsPersistenceGateway.getCases(
        applicationContext.getBaseUrl(),
        'taxpayer',
      );
      assert.deepEqual(cases[1], fakeCase);
      assert.equal(fakeCases[1].caseId, fakeCase.caseId);
    });

    it('Success', async () => {
      mock.onGet(CASES_BASE_ROUTE).reply(200, fakeCases);

      const cases = await awsPersistenceGateway.getCases(
        applicationContext.getBaseUrl(),
        'taxpayer',
      );
      assert.deepEqual(cases, fakeCases);
      assert.equal(cases[1].caseId, fakeCase.caseId);
    });

    it('Failure', async () => {
      mock.onGet(CASES_BASE_ROUTE).reply(403, 'failure');
      let error;
      try {
        await awsPersistenceGateway.getCases(
          applicationContext.getBaseUrl(),
          'Bad actor',
        );
      } catch (e) {
        error = e.message;
      }
      assert.equal(error, 'Request failed with status code 403');
    });
  });

  describe('Get cases for petitions clerk', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('Success', async () => {
      mock.onGet(`${CASES_BASE_ROUTE}?status=new`).reply(200, fakeCases);

      const cases = await awsPersistenceGateway.getPetitionsClerkCaseList(
        applicationContext.getBaseUrl(),
        'petitionsClerk',
      );
      assert.deepEqual(cases[1], fakeCase);
    });

    it('Failure', async () => {
      mock.onGet(CASES_BASE_ROUTE).reply(403, 'failure');
      let error;
      try {
        await awsPersistenceGateway.getCases(
          applicationContext.getBaseUrl(),
          'Bad actor',
        );
      } catch (e) {
        error = e.message;
      }
      assert.equal(error, 'Request failed with status code 403');
    });
  });

  describe('Initiate case', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('Uploads all 3 PDFs successfully', async done => {
      mock.onGet(UPLOAD_POLICY_ROUTE).reply(200, fakePolicy);
      mock
        .onPost(applicationContext.getBaseUrl() + '/documents')
        .reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(204);
      const caseInitiator = new CaseInitiator({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      await awsPersistenceGateway.uploadCasePdfs(
        applicationContext,
        caseInitiator,
        'taxpayer',
        () => {},
      );
      done();
    });

    it('Fails to get the document policy', async done => {
      mock.onGet(UPLOAD_POLICY_ROUTE).reply(500);
      mock
        .onPost(applicationContext.getBaseUrl() + '/documents')
        .reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(204);
      const caseInitiator = new CaseInitiator({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.uploadCasePdfs(
          applicationContext,
          caseInitiator,
          'taxpayer',
          () => {},
        );
      } catch (error) {
        done();
      }
    });

    it('Fails to get the document id', async done => {
      mock.onGet(UPLOAD_POLICY_ROUTE).reply(200, fakePolicy);
      mock.onPost(applicationContext.getBaseUrl() + '/documents').reply(500);
      mock.onPost(fakePolicy.url).reply(204);
      const caseInitiator = new CaseInitiator({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.uploadCasePdfs(
          applicationContext,
          caseInitiator,
          'taxpayer',
          () => {},
        );
      } catch (error) {
        done();
      }
    });

    it('Fails to upload to S3', async done => {
      mock.onGet(UPLOAD_POLICY_ROUTE).reply(200, fakePolicy);
      mock
        .onPost(applicationContext.getBaseUrl() + '/documents')
        .reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(500);
      const caseInitiator = new CaseInitiator({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.uploadCasePdfs(
          applicationContext,
          caseInitiator,
          'taxpayer',
          () => {},
        );
      } catch (error) {
        done();
      }
    });
  });

  describe('Create case', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('creates a case successfully', async done => {
      mock.onPost(CASES_BASE_ROUTE).reply(200);
      const uploadResults = {
        userId: 'fakeUserId',
        documents: [],
      };
      await awsPersistenceGateway.createCase(
        applicationContext,
        uploadResults,
        'taxpayer',
      );
      done();
    });
  });

  describe('Update case', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('Updates a case successfully', async done => {
      mock.onPut(CASE_ROUTE).reply(200);
      const caseDetail = {
        caseId: 'fakeCaseId',
      };
      await awsPersistenceGateway.updateCase(
        'Username',
        caseDetail,
        applicationContext.getBaseUrl(),
      );
      done();
    });
  });

  describe('View case', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('View a case successfully', async () => {
      mock.onGet(CASE_ROUTE).reply(200, fakeCase);
      const results = await awsPersistenceGateway.getCaseDetail(
        'fakeCaseId',
        applicationContext.getBaseUrl(),
        'Username',
      );
      assert.deepEqual(results, fakeCase);
    });
  });
});
