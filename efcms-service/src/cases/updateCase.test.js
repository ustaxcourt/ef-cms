const aws = require('aws-sdk-mock');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const updateCase = require('./updateCase');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Update case function', function() {

  let documents =  [
      {
        documentId: '123456789',
        documentType: 'stin'
      },
      {
        documentId: '123456780',
        documentType: 'stin'
      },
      {
        documentId: '123456781',
        documentType: 'stin'
      }
    ];

  const item = {
      caseId: '123',
      userId: 'userId',
      docketNumber: '456789-18',
      documents: documents,
      createdAt: ''
  };



  describe ('success', function() {
    before(function () {
      aws.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
        callback(null, { Item: item });
      });
    });

    after(function () {
      aws.restore('DynamoDB.DocumentClient');
    });


    [
      {
        httpMethod: 'PUT',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: '123'
        },
        headers: { 'Authorization': 'Bearer petitionsclerk' }
      }
    ].forEach(function (documentBody) {
      it('should update a case', function () {
        return lambdaTester(updateCase.put).
          event(documentBody).
          expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data.userId).
              to.
              equal('userId');
            expect(data.documents.length).
              to.
              equal(3);
            expect(data.caseId).not.to.be.null;
          });
      });
    });
  });

  // describe('error', function() {
  //   before(function () {
  //     aws.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
  //       callback(null, {
  //         Item: {
  //           userId: 'userId',
  //           docketNumber: '456789-18',
  //           documents: documents,
  //           createdAt: '',
  //         },
  //       });
  //     });
  //
  //   });
  //
  //   after(function () {
  //     aws.restore('DynamoDB.DocumentClient');
  //   });
  //
  //   [
  //     {
  //       httpMethod: 'PUT',
  //       body: JSON.stringify(documents),
  //       headers: {'Authorization': 'Bearer'}
  //     },
  //     {
  //       httpMethod: 'PUT'
  //     }
  //   ].forEach(function(put) {
  //     it('should return an error on a PUT without a Authorization header', function() {
  //       return lambdaTester(updateCase.create)
  //       .event(put)
  //       .expectResult(err => {
  //         expect(err.body).to.startsWith('"Error:');
  //       });
  //     });
  //   });
  //
  //   [
  //     {
  //       httpMethod: 'POST',
  //       body: JSON.stringify(documents),
  //       headers: {'Authorization': 'Bearer userId'}
  //     }
  //   ].forEach(function(post) {
  //     it('should return an error on a POST without the required case initiation documents', function() {
  //       return lambdaTester(createCase.create)
  //       .event(post)
  //       .expectResult(err => {
  //         expect(err.body).to.startsWith('"Three case initiation');
  //       });
  //     });
  //   });
  // })
});
