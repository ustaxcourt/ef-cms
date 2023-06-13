import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { decodeTokenAction } from './decodeTokenAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import jwt from 'jsonwebtoken';

describe('decodeTokenAction', () => {
  let mockUser = {
    'custom:role': ROLES.privatePractitioner,
    'custom:userId': '188a5b0f-e7ae-4647-98a1-43a0d4d00eee',
  };

  let token = jwt.sign(mockUser, 'secret');

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should decode the userId and role from props.token', async () => {
    const result = await runAction(decodeTokenAction, {
      modules: {
        presenter,
      },
      props: {
        token,
      },
    });

    expect(result.output.user.role).toBe(mockUser['custom:role']);
    expect(result.output.user.userId).toBe(mockUser['custom:userId']);
    expect(result.output.token).toBe(token);
  });

  it('should decode the sub and return it as result.user.userId when custom:userId is not present in the token', async () => {
    mockUser = {
      'custom:role': ROLES.privatePractitioner,
      sub: '332ca24c-2f8a-475b-afdd-86d03ae09db4',
    };

    token = jwt.sign(mockUser, 'secret');

    const result = await runAction(decodeTokenAction, {
      modules: {
        presenter,
      },
      props: {
        token,
      },
    });

    expect(result.output.user.userId).toBe(mockUser.sub);
  });
});
