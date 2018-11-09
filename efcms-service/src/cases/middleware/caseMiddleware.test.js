const sinon = require('sinon');
const proxyquire =  require('proxyquire').noCallThru();

const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

describe('createCaseMiddleware', function() {

  const documents = [{ documentId: '123456789', documentType: 'stin' },{ documentId: '123456780', documentType: 'stin' },{ documentId: '123456781', documentType: 'stin' }]
  const stub = sinon.stub();
  const docketNumberStub = sinon.stub();
  let caseMiddleWare;
  let item;

  before(function() {
    item = {
      caseId: '123456',
      userId: 'userId',
      docketNumber: '456789-18',
      documents: [],
      createdAt: '2018-11-09T15:25:32.977Z',
    };

    stub.resolves(item);
    docketNumberStub.resolves('00123-18');

    process.env = {};
    process.env.STAGE = 'test';

    caseMiddleWare = proxyquire('./caseMiddleware', {
      '../../middleware/dynamodbClientService' : {
        put: stub
      },
      './docketNumberGenerator' : {
        createDocketNumber: docketNumberStub
      }
    });
  });


  it('should create a case on a POST', async () => {
    const result = await caseMiddleWare.create('user', documents);
    expect(result).to.equal(item);
  });
});

describe('get CaseMiddleware', function() {

  const documents = [{ documentId: '123456789', documentType: 'stin' },{ documentId: '123456780', documentType: 'stin' },{ documentId: '123456781', documentType: 'stin' }]
  const stub = sinon.stub();
  const docketNumberStub = sinon.stub();
  let caseMiddleWare;
  let item;

  before(function() {
    item = {
      caseId: '123456',
      userId: 'userId',
      docketNumber: '456789-18',
      documents: [],
      createdAt: '2018-11-09T15:25:32.977Z',
    };

    stub.resolves(item);
    docketNumberStub.resolves('00123-18');

    process.env = {};
    process.env.STAGE = 'test';

    caseMiddleWare = proxyquire('./caseMiddleware', {
      '../../middleware/dynamodbClientService' : {
        put: stub
      },
      './docketNumberGenerator' : {
        createDocketNumber: docketNumberStub
      }
    });
  });


  it('should create a case on a POST', async () => {
    const result = await caseMiddleWare.create('user', documents);
    expect(result).to.equal(item);
  });
});
