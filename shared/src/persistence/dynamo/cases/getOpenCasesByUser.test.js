const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { getOpenCasesByUser } = require('./getOpenCasesByUser');

jest.mock('./getUserCases', () => ({
  getUserCases: jest.fn().mockReturnValue([
    {
      caseId: '123',
      pk: 'case|123',
      sk: 'case|123',
      status: CASE_STATUS_TYPES.new,
    },
    {
      caseId: '121',
      pk: 'case|121',
      sk: 'case|121',
      status: CASE_STATUS_TYPES.closed,
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
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });
});
