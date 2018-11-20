const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const client = require('../../../business/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const updateCase = require('./updateCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Update case function', function() {
  let documents = [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
  ];

  const item = {
    caseId: 'AAAAAAAA-AAAA-AAA-AAA-AAAAAAAAAAAA',
    userId: 'taxpayer',
    docketNumber: '00101-18',
    documents: documents,
    createdAt: new Date().toISOString(),
  };

  describe('success', function() {
    before(function() {
      sinon.stub(client, 'put').resolves(item);
    });

    after(function() {
      client.put.restore();
    });

    [
      {
        httpMethod: 'PUT',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: 'AAAAAAAA-AAAA-AAA-AAA-AAAAAAAAAAAA',
        },
        headers: { Authorization: 'Bearer petitionsclerk' },
      },
    ].forEach(function(documentBody) {
      it('should update a case', function() {
        return lambdaTester(updateCase.put)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.userId).to.equal('taxpayer');
            expect(data.documents.length).to.equal(3);
            expect(data.caseId).not.to.be.null;
          });
      });
    });
  });

  describe('error', function() {
    before(function() {
      sinon.stub(client, 'put').resolves(item);
    });

    after(function() {
      client.put.restore();
    });

    [
      {
        httpMethod: 'PUT',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: '123',
        },
        headers: { Authorization: 'Bearer' },
      },
      {
        httpMethod: 'PUT',
      },
    ].forEach(function(put) {
      it('should return an error on a PUT without a Authorization header', function() {
        return lambdaTester(updateCase.put)
          .event(put)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"Error:');
          });
      });
    });

    [
      {
        httpMethod: 'PUT',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: '123',
        },
        headers: { Authorization: 'Bearer invalidUser' },
      },
    ].forEach(function(put) {
      it('should return an error on a PUT when the user in the header does not have authorization', function() {
        return lambdaTester(updateCase.put)
          .event(put)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"Unauthorized for update case');
          });
      });
    });

    [
      {
        httpMethod: 'PUT',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: 'BBBB',
        },
        headers: { Authorization: 'Bearer petitionsclerk' },
      },
    ].forEach(function(put) {
      it('should return an error on a PUT when the item caseId does not match the path caseId', function() {
        return lambdaTester(updateCase.put)
          .event(put)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"problem in body or url');
          });
      });
    });
  });
});
