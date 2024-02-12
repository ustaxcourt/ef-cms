import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createConfirmLinkAction } from '@web-client/presenter/actions/createConfirmLinkAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import React from 'react';
import qs from 'qs';

describe('createConfirmLinkAction', () => {
  const email = 'something@example.com';
  const oldEnv = process.env;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should return immediately if IS_LOCAL is not defined', async () => {
    delete process.env.IS_LOCAL;
    const result = await runAction(createConfirmLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });
    expect(result.output).toBeUndefined();
  });

  it('should construct an alertSuccess message when IS_LOCAL is "true"', async () => {
    process.env.IS_LOCAL = 'true';

    const queryString = qs.stringify({ email }, { encode: true });

    const confirmationLink = `http://localhost:1234/confirm-signup?${queryString}`;

    const expectedMessage = (
      <>
        {' '}
        New user account created successfully for {email}! Please click the link
        below to verify your email address.
        <br />
        <a href={confirmationLink} rel="noopener noreferrer">
          Verify Email Address
        </a>
      </>
    );
    const result = await runAction(createConfirmLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });

    const { message, title } = result.output!.alertSuccess;

    expect(message).toEqual(expectedMessage);
    expect(title).toEqual('Account Created Locally');
  });
});
