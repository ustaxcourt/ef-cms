import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const Login = connect(
  {
    alertError: state.alertError,
  },
  ({ alertError }) => {
    return (
      <>
        <div className="grid-container grid-gap-lg padding-x-4">
          {alertError && (
            <div
              className="grid-row margin-bottom-2"
              style={{ width: 'fit-content' }}
            >
              {/* <MessageAlert
                alertType={alertError.alertType}
                message={alertError.message}
                title={alertError.title}
              ></MessageAlert> */}
            </div>
          )}
          <div className="grid-row bg-white padding-x-5 padding-y-4">
            <div className="grid-col">
              <h1 className="margin-bottom-1">Log in to DAWSON</h1>
              <span>Email address and password are case sensitive.</span>

              <form>
                <label className="usa-label" htmlFor="email">
                  Email address
                </label>
                <input
                  required
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="usa-input"
                  id="email"
                  name="email"
                  type="text"
                  onBlur={() => {
                    // setInFocusEmail(false);
                  }}
                  onChange={e => {
                    // updateFormValueSequence({
                    //   key: 'email',
                    //   value: e.target.value,
                    // });
                  }}
                  // onFocus={() => setInFocusEmail(true)}
                />
                <label className="usa-label" htmlFor="password">
                  Password
                </label>
                <input
                  required
                  className="usa-input"
                  id="password"
                  name="password"
                  // type={showPassword ? 'text' : 'password'}
                  onChange={e => {
                    // updateFormValueSequence({
                    //   key: 'password',
                    //   value: e.target.value,
                    // });
                  }}
                />
                <button
                  aria-controls="password password-create-account-confirm"
                  className="usa-show-password"
                  data-hide-text="Hide password"
                  data-show-text="Show password"
                  type="button"
                >
                  Show password
                </button>
                <Button className="usa-button margin-top-2" id="submit-button">
                  Log in
                </Button>
              </form>

              <div>
                <Button
                  aria-controls="password password-create-account-confirm"
                  className=""
                  link={true}
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>

              <div>
                <span>Don't have an account?</span>{' '}
                <Button
                  aria-controls="password password-create-account-confirm"
                  link={true}
                  type="button"
                >
                  Create your account now.
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

Login.displayName = 'Login';
