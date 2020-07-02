const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getClosedCasesByUser } = require('./getClosedCasesByUser');
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

describe('getClosedCasesByUser', () => {
  it('should filter out cases that are not closed', async () => {
    const result = await getClosedCasesByUser({
      applicationContext,
      user,
    });

    expect(result).toMatchObject([
      {
        caseId: '121',
        pk: 'case|121',
        sk: 'case|121',
        status: 'Closed',
      },
    ]);
  });
});
