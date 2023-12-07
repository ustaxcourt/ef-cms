import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const Login = connect(
  {
    form: state.form,
    submitLoginSequence: sequences.submitLoginSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({ form, submitLoginSequence, updateFormValueSequence }) => {
    return (
      <>
        <div className="grid-container">
          <div className="grid-row bg-white padding-x-5 padding-y-3">
            <div className="grid-col">
              <h1 className="margin-bottom-1">Log in to DAWSON</h1>
              <span>Email address and password are case sensitive.</span>
              <form className="margin-top-4">
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
                  value={form.email}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <label className="usa-label" htmlFor="password">
                  Password
                </label>
                <input
                  required
                  className="usa-input"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button
                  className="usa-show-password"
                  data-hide-text="Hide password"
                  data-show-text="Show password"
                  type="button"
                >
                  Show password
                </button>
                <Button
                  className="usa-button margin-top-3"
                  onClick={() => submitLoginSequence()}
                >
                  Log in
                </Button>
              </form>
              <div>
                <Button className="margin-top-1" link={true} type="button">
                  Forgot password?
                </Button>
              </div>
              <div>
                <span>Don&apos;t have an account?</span>{' '}
                <Button className="padding-top-0" link={true} type="button">
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
