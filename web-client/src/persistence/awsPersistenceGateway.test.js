import assert from 'assert';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import dev from '../environments/dev';
import Petition from '../entities/Petition';
import awsPersistenceGateway from './awsPersistenceGateway';

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
    it('Success', async () => {
      const user = awsPersistenceGateway.getUser('Test, Taxpayer');
      assert.equal(user, 'Test, Taxpayer');
    });
    it('Failure', async () => {
      try {
        awsPersistenceGateway.getUser('Bad actor');
      } catch (e) {
        assert.equal(e.message, 'Username is incorrect');
      }
    });
  });

  describe('Create PDF petition', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.restore();
    });

    it('Uploads all 3 PDFs successfully', async done => {
      mock.onGet(dev.getBaseUrl() + '/documents/policy').reply(200, fakePolicy);
      mock.onPost(dev.getBaseUrl() + '/documents').reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(204);
      const petition = new Petition({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      await awsPersistenceGateway.filePdfPetition(
        'Username',
        petition,
        dev.getBaseUrl(),
        () => {},
      );
      done();
    });

    it('Fails to get the document policy', async done => {
      mock.onGet(dev.getBaseUrl() + '/documents/policy').reply(500);
      mock.onPost(dev.getBaseUrl() + '/documents').reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(204);
      const petition = new Petition({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.filePdfPetition(
          'Username',
          petition,
          dev.getBaseUrl(),
        );
      } catch (error) {
        done();
      }
    });

    it('Fails to get the document id', async done => {
      mock.onGet(dev.getBaseUrl() + '/documents/policy').reply(200, fakePolicy);
      mock.onPost(dev.getBaseUrl() + '/documents').reply(500);
      mock.onPost(fakePolicy.url).reply(204);
      const petition = new Petition({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.filePdfPetition(
          'Username',
          petition,
          dev.getBaseUrl(),
        );
      } catch (error) {
        done();
      }
    });

    it('Fails to upload to S3', async done => {
      mock.onGet(dev.getBaseUrl() + '/documents/policy').reply(200, fakePolicy);
      mock.onPost(dev.getBaseUrl() + '/documents').reply(200, fakeDocumentId);
      mock.onPost(fakePolicy.url).reply(500);
      const petition = new Petition({
        petitionFile: new Blob(['blob']),
        requestForPlaceOfTrial: new Blob(['blob']),
        statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
      });
      try {
        await awsPersistenceGateway.filePdfPetition(
          'Username',
          petition,
          dev.getBaseUrl(),
        );
      } catch (error) {
        done();
      }
    });
  });
});
