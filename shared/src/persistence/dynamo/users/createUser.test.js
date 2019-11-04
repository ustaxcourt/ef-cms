const sinon = require('sinon');
const { createUserRecords } = require('./createUser');
const { User } = require('../../../business/entities/User');

describe('createUser', () => {
  let applicationContext;
  let putStub;

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist a petitionsclerk user with a section mapping record', async () => {
    const petitionsclerkUser = {
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
    };
    await createUserRecords({
      applicationContext,
      user: petitionsclerkUser,
      userId,
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'petitions|user',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...petitionsclerkUser,
      },
      TableName: 'efcms-dev',
    });
  });

  it('attempts to persist a judge user with a section mapping record for the chambers and the judge', async () => {
    const judgeUser = {
      name: 'Judge Adam',
      role: User.ROLES.judge,
      section: 'adamsChambers',
    };
    await createUserRecords({
      applicationContext,
      user: judgeUser,
      userId,
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'adamsChambers|user',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: 'judge|user',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(2).args[0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...judgeUser,
      },
      TableName: 'efcms-dev',
    });
  });

  it('attempts to persist a practitioner user with name and barNumber mapping records', async () => {
    const practitionerUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.practitioner,
      section: 'practitioner',
    };
    await createUserRecords({
      applicationContext,
      user: practitionerUser,
      userId,
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'practitioner|user',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...practitionerUser,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(2).args[0]).toMatchObject({
      Item: {
        pk: 'Test Practitioner|practitioner',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(3).args[0]).toMatchObject({
      Item: {
        pk: 'PT1234|practitioner',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
  });

  it('does not persist mapping records for practitioner without barNumber', async () => {
    const practitionerUser = {
      barNumber: '',
      name: 'Test Practitioner',
      role: User.ROLES.practitioner,
      section: 'practitioner',
    };
    await createUserRecords({
      applicationContext,
      user: practitionerUser,
      userId,
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'practitioner|user',
        sk: userId,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...practitionerUser,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(2)).toEqual(null);
  });
});
