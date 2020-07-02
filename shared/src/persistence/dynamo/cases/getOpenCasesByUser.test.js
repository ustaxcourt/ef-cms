const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getOpenCasesByUser } = require('./getOpenCasesByUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

jest.mock('./getUserCases', () => ({
  // TODO - can't replace status with EntityConstants CASE_STATUS_TYPES due to jest.mock error
  getUserCases: jest.fn().mockReturnValue([
    {
      caseId: '123',
      pk: 'case|123',
      sk: 'case|123',
      status: 'New',
    },
    {
      caseId: '121',
      pk: 'case|121',
      sk: 'case|121',
      status: 'Closed',
    },
  ]),
}));

const user = {
  role: ROLES.petitioner,
  userId: '522573b0-dc40-47f7-96fd-64758da315f5',
};

describe('getOpenCasesByUser', () => {
  it('should filter out cases that are closed', async () => {
    const result = await getOpenCasesByUser({
      applicationContext,
      user,
    });

    expect(result).toMatchObject([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
  });
});
