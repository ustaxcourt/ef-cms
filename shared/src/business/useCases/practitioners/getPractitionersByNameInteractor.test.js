const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPractitionersByNameInteractor,
} = require('./getPractitionersByNameInteractor');
const { User } = require('../../entities/User');

describe('getPractitionersByNameInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getPractitionersByNameInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized for searching practitioners');
  });

  it('throws an error if name is not passed in', async () => {
    await expect(
      getPractitionersByNameInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Name must be provided to search');
  });

  it('calls search function with correct params and returns records for a name search', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      hits: {
        hits: [
          {
            _source: {
              barNumber: { S: 'PT1234' },
              name: { S: 'Test Practitioner1' },
              role: { S: 'irsPractitioner' },
              userId: { S: '8190d648-e643-4964-988e-141e4e0db861' },
            },
          },
          {
            _source: {
              barNumber: { S: 'PT5432' },
              name: { S: 'Test Practitioner2' },
              role: { S: 'privatePractitioner' },
              userId: { S: '12d5bb3a-e867-4066-bda5-2f178a76191f' },
            },
          },
        ],
      },
    });

    const results = await getPractitionersByNameInteractor({
      applicationContext,
      name: 'Test Practitioner',
    });

    expect(applicationContext.getSearchClient().search).toBeCalled();
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual([
      {
        bool: {
          must: [
            {
              match: {
                'pk.S': 'user|',
              },
            },
            {
              match: {
                'sk.S': 'user|',
              },
            },
          ],
        },
      },
      {
        bool: {
          should: [
            {
              match: {
                'role.S': 'irsPractitioner',
              },
            },
            {
              match: {
                'role.S': 'privatePractitioner',
              },
            },
          ],
        },
      },
      {
        bool: {
          minimum_should_match: 2,
          should: [
            {
              term: {
                'name.S': 'test',
              },
            },
            {
              term: {
                'name.S': 'practitioner',
              },
            },
          ],
        },
      },
    ]);
    expect(results).toMatchObject([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner1',
        role: 'irsPractitioner',
        userId: '8190d648-e643-4964-988e-141e4e0db861',
      },
      {
        barNumber: 'PT5432',
        name: 'Test Practitioner2',
        role: 'privatePractitioner',
        userId: '12d5bb3a-e867-4066-bda5-2f178a76191f',
      },
    ]);
  });

  it('calls search function with correct params and returns empty array if no records are found for a name search', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      hits: {
        hits: [],
      },
    });

    const results = await getPractitionersByNameInteractor({
      applicationContext,
      name: 'Test Practitioner',
    });

    expect(applicationContext.getSearchClient().search).toBeCalled();
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual([
      {
        bool: {
          must: [
            {
              match: {
                'pk.S': 'user|',
              },
            },
            {
              match: {
                'sk.S': 'user|',
              },
            },
          ],
        },
      },
      {
        bool: {
          should: [
            {
              match: {
                'role.S': 'irsPractitioner',
              },
            },
            {
              match: {
                'role.S': 'privatePractitioner',
              },
            },
          ],
        },
      },
      {
        bool: {
          minimum_should_match: 2,
          should: [
            {
              term: {
                'name.S': 'test',
              },
            },
            {
              term: {
                'name.S': 'practitioner',
              },
            },
          ],
        },
      },
    ]);
    expect(results).toMatchObject([]);
  });
});
