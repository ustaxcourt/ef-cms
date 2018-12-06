const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const sendPetitionToIRS = require('./sendPetitionToIRS');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Send petition to IRS function', function() {
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
    caseId: '67274d05-1e30-469d-83a7-acadba72bd2d',
    userId: 'taxpayer',
    docketNumber: '00101-18',
    documents: documents,
    createdAt: new Date().toISOString(),
  };

  describe('success', function() {
    before(function() {
      sinon.stub(client, 'put').resolves(item);
      sinon.stub(client, 'delete').resolves(item);
      sinon.stub(client, 'get').resolves(item);
    });

    after(function() {
      client.put.restore();
      client.get.restore();
      client.delete.restore();
    });

    [
      {
        httpMethod: 'POST',
        body: JSON.stringify(item),
        pathParameters: {
          caseId: '67274d05-1e30-469d-83a7-acadba72bd2d',
        },
        headers: { Authorization: 'Bearer petitionsclerk' },
      },
    ].forEach(function(documentBody) {
      it('should update the irsSendDate on a case', function() {
        return lambdaTester(sendPetitionToIRS.post)
          .event(documentBody)
          .expectResolve(result => {
            const data = JSON.parse(result.body);
            expect(data).to.not.be.null;
          });
      });
    });
  });
});
