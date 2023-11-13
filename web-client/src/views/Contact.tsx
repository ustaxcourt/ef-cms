import { Icon } from '../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Contact = connect(
  {
    alertHelper: state.alertHelper,
    gotoPublicSearchSequence: sequences.gotoPublicSearchSequence,
    isPublic: state.isPublic,
  },
  function Contact() {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex={-1}>
                  Contact Us
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h2>Have a question or problem?</h2>
            </div>
          </div>

          <div className="display-flex margin-top-3">
            <Icon
              aria-label="email"
              className="dark-icon margin-right-2"
              icon={['fas', 'envelope']}
              size="lg"
            />
            <div className="inline-block">
              Email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              <br />
              <span className="usa-hint margin-top-1">
                No documents can be filed with the Court at this email address.
              </span>
            </div>
          </div>

          <div className="display-flex margin-top-3 margin-bottom-5">
            <Icon
              aria-label="phone"
              className="dark-icon margin-right-1"
              icon={['fas', 'phone']}
              size="lg"
            />
            <div className="inline-block">
              Call <a href="tel:202-521-0700">202-521-0700</a>
            </div>
          </div>
        </section>
      </>
    );
  },
);

Contact.displayName = 'Contact';
