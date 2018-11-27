const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const getCases = require('./getCases');
const chai = require('chai');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
chai.use(require('chai-string'));

describe('Get cases lambda', function() {
  const documents = [
    {
      documentId: '123456789',
      documentType: 'stin',
    },
    {
      documentId: '123456780',
      documentType: 'stin',
    },
    {
      documentId: '123456781',
      documentType: 'stin',
    },
  ];

  describe('success', function() {
    before(function() {
      sinon.stub(client, 'query').resolves([
        {
          userId: 'userId',
          caseId: 'AAAAAAAA-AAAA-AAA-AAA-AAAAAAAAAAAA',
          docketNumber: '456789-18',
          documents,
          createdAt: '',
        },
      ]);
    });

    after(function() {
      client.query.restore();
    });

    [
      {
        httpMethod: 'GET',
        queryStringParameters: { status: 'new' },
        headers: { Authorization: 'Bearer petitionsclerk' },
      },
    ].forEach(function(documentBody) {
      it('should retrieve cases by status if authorized', function() {
        return lambdaTester(getCases.get)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.length).to.equal(1);
          });
      });
    });

    [
      {
        httpMethod: 'GET',
        headers: { Authorization: 'Bearer petitionsclerk' },
      },
    ].forEach(function(documentBody) {
      it('should retrieve cases by status if authorized', function() {
        return lambdaTester(getCases.get)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.length).to.equal(1);
          });
      });
    });

    [
      {
        httpMethod: 'GET',
        queryStringParameters: { status: 'new' },
        headers: { Authorization: 'Bearer notapetitionsclerk' },
      },
    ].forEach(function(documentBody) {
      it('should return a 403 and error if unauthorized', function() {
        return lambdaTester(getCases.get)
          .event(documentBody)
          .expectResolve(error => {
            expect(error.statusCode).to.equal(403);
            expect(error.body).to.equal('"Unauthorized for getCasesByStatus"');
          });
      });
    });

    [
      {
        httpMethod: 'GET',
        queryStringParameters: { status: 'new' },
        headers: { Authorization: 'Bearer' },
      },
      {
        httpMethod: 'GET',
        queryStringParameters: { status: 'new' },
        headers: { Authorization: '' },
      },
    ].forEach(function(documentBody) {
      it('should return a 403 if no user is present', function() {
        return lambdaTester(getCases.get)
          .event(documentBody)
          .expectResolve(error => {
            expect(error.statusCode).to.equal(403);
            expect(error.body).to.startWith('"Error: Authorization');
          });
      });
    });
  });
});
