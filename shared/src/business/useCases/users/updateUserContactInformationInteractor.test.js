const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');

describe('updateUserContactInformationInteractor', () => {
  it('updates the user and respondents in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                respondents: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo: {
        addressLine1: '999',
        addressLine2: 'circle st.',
      },
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      addressLine1: '999',
      addressLine2: 'circle st.',
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      respondents: [
        {
          addressLine1: '999',
          addressLine2: 'circle st.',
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('updates the user and practitioners in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                practitioners: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo: {
        addressLine1: '999',
        addressLine2: 'circle st.',
      },
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      addressLine1: '999',
      addressLine2: 'circle st.',
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      practitioners: [
        {
          addressLine1: '999',
          addressLine2: 'circle st.',
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('returns unauthorized error when user not authorized', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: {
          addressLine1: '999',
          addressLine2: 'circle st.',
        },
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorized error when the user attempts to update a different user not owned by themself', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: {
          addressLine1: '999',
          addressLine2: 'circle st.',
        },
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });
});
