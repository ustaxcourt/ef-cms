const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { getClosedCasesByUser } = require('./getClosedCasesByUser');

jest.mock('./getUserCases', () => ({
  // TODO - can't replace status with EntityConstants CASE_STATUS_TYPES due to jest.mock error
  getUserCases: jest.fn().mockReturnValue([
    {
      docketNumber: '123-20',
      pk: 'case|123-20',
      sk: 'case|123-20',
      status: 'New',
    },
    {
      docketNumber: '121-20',
      pk: 'case|121-20',
      sk: 'case|121-20',
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
        docketNumber: '121-20',
        pk: 'case|121-20',
        sk: 'case|121-20',
        status: CASE_STATUS_TYPES.closed,
      },
    ]);
  });
});
