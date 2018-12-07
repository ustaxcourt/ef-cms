const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const createCase = require('./createCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Create case lambda', function() {
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

  describe('success', function() {
    beforeEach(function() {
      sinon.stub(client, 'put').resolves({
        userId: 'userId',
        docketNumber: '456789-18',
        documents,
        caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        createdAt: '',
      });
      sinon.stub(client, 'updateConsistent').resolves(1);
    });

    afterEach(function() {
      client.put.restore();
      client.updateConsistent.restore();
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify({
          documents,
        }),
        headers: { Authorization: 'Bearer userId' },
      },
    ].forEach(function(documentBody) {
      it('should create a case on a POST', function() {
        return lambdaTester(createCase.create)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.userId).to.equal('userId');
            expect(data.documents.length).to.equal(3);
            expect(data.caseId).not.to.be.null;
            expect(
              data.caseId &&
                /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
                  data.caseId,
                ),
            ).to.be.true;
          });
      });
    });
  });

  describe('error', function() {
    beforeEach(function() {
      sinon.stub(client, 'put').resolves({
        userId: 'userId',
        docketNumber: '456789-18',
        documents: documents,
        createdAt: '',
      });
      sinon.stub(client, 'updateConsistent').resolves(1);
    });

    afterEach(function() {
      client.put.restore();
      client.updateConsistent.restore();
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents),
        headers: { Authorization: 'Bearer' },
      },
      {
        httpMethod: 'POST',
        body: JSON.stringify(documents.slice(1)),
      },
      {
        httpMethod: 'POST',
      },
    ].forEach(function(post) {
      it('should return an error on a POST without a Authorization header', function() {
        return lambdaTester(createCase.create)
          .event(post)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"Error:');
          });
      });
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify({
          documents: [],
        }),
        headers: { Authorization: 'Bearer userId' },
      },
    ].forEach(function(post) {
      it('should return an error on a POST without the required case initiation documents', function() {
        return lambdaTester(createCase.create)
          .event(post)
          .expectResolve(err => {
            expect(err.body).to.startsWith('"The case was invalid');
          });
      });
    });
  });
});
