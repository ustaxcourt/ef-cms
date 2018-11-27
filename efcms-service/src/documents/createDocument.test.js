const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createDocument = require('./createDocument');
const chai = require('chai');
const Case = require('ef-cms-shared/src/entities/Case');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');

chai.use(require('chai-string'));

describe('Create document', function() {
  before(function() {
    sinon.stub(client, 'put').resolves({
      documentId: '000987654',
      userId: 'user',
      createdAt: '',
    });
  });

  after(function() {
    client.put.restore();
  });

  [
    {
      httpMethod: 'POST',
      body: JSON.stringify({
        documentType: Case.documentTypes.petitionFile,
      }),
      headers: { Authorization: 'Bearer taxpayer' },
      result: {
        documentId: '000987654',
        userId: 'user',
        createdAt: '',
      },
    },
  ].forEach(function(documentBody) {
    it('should create a document on a POST', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResolve(result => {
          const data = JSON.parse(result.body);
          expect(data.documentType).to.equal(documentBody.result.documentType);
          expect(data.userId).to.equal(documentBody.result.userId);
        });
    });
  });

  [
    {
      httpMethod: 'POST',
      headers: { Authorization: 'Bearer taxpayer' },
      body: JSON.stringify({}),
    },
    {
      httpMethod: 'POST',
      headers: { Authorization: '' },
      body: JSON.stringify({ documentType: 'Petition' }),
      expected: '"Error: Authorization is required',
    },
    {
      httpMethod: 'POST',
      headers: { Authorization: 'Bearer taxpayer' },
      body: JSON.stringify({ documentType: '' }),
    },
    {
      httpMethod: 'POST',
      headers: { Authorization: 'Bearer taxpayer' },
      body: JSON.stringify({ documentType: null }),
    },
  ].forEach(function(documentBody) {
    it('should require documentType', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResolve(err => {
          expect(err.body).to.startsWith(
            documentBody.expected || '"The document was invalid',
          );
        });
    });
  });

  [
    {
      httpMethod: 'POST',
      body: 'some string',
    },
  ].forEach(function(documentBody) {
    it('should should throw an error if the body is not json', function() {
      return lambdaTester(createDocument.create)
        .event(documentBody)
        .expectResolve(err => {
          expect(err.body).to.startsWith(
            '"Unexpected token s in JSON at position 0',
          );
        });
    });
  });
});
