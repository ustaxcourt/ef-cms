import { BigHeader } from './BigHeader';
import { Button } from '../ustc-ui/Button/Button';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ChangeLoginAndServiceEmail = connect(
  {
    user: state.user,
  },
  function ChangeLoginAndServiceEmail({ user }) {
    return (
      <React.Fragment>
        <BigHeader text={'Change Login & Service Email Address'} />
        <section className="usa-section grid-container">
          <p>
            This is the email you will use to log in to the system and where you
            will receive service.
          </p>

          <div className="blue-container margin-bottom-5">
            <div className="margin-bottom-6">
              <p className="usa-label margin-bottom-05">
                Current email address
              </p>
              {user.email}
            </div>
            <div>
              <h4>Change Login & Service Email</h4>
              <FormGroup>
                <label className="usa-label" htmlFor="email">
                  New email address
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="email"
                  name="email"
                  type="text"
                  value={''}
                />
              </FormGroup>
              <FormGroup>
                <label className="usa-label" htmlFor="confirm-email">
                  Re-enter new email address
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="confirm-email"
                  name="confirmEmail"
                  type="text"
                  value={''}
                />
              </FormGroup>
            </div>
          </div>
          <div className="grid-row margin-bottom-6">
            <div className="grid-col-12">
              <Button>Save</Button>
              <Button link>Cancel</Button>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
