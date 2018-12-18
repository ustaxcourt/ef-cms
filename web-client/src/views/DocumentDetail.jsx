import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

export default connect(
  {},
  function DocumentDetail() {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket number: 101-18
          </h1>
          <p>
            Tax Payer Petitioner v. Commissioner of Internal Revenue, Respondent
          </p>
          <p>
            <span
              className="usa-label case-status-label"
              aria-label={'status: general docket'}
            >
              <span aria-hidden="true">general docket</span>
            </span>
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          <div className="usa-grid-full">
            <div className="usa-width-one-third card">
              <h2>Stipulated decision</h2>
              <div className="usa-grid-full subsection">
                <div className="usa-width-one-half">
                  <span className="label">Date filed</span>
                  <p>12/12/2019</p>
                </div>
                <div className="usa-width-one-half">
                  <span className="label">Filed by</span>
                  <p>Respondent</p>
                </div>
              </div>
              <span className="label">Messages</span>
              <div className="card">
                <div className="subsection">
                  <span className="label">Respondent</span>
                  <span className="float-right">12/12/2019</span>
                </div>
                <p>Stipulated decision filed by Respondent</p>
                <div className="subsection">
                  <span>
                    {' '}
                    <FontAwesomeIcon
                      icon="flag"
                      className="action-flag"
                      size="sm"
                    />{' '}
                    Docket clerk name
                  </span>
                  <span className="float-right">
                    <a href="/">Forward</a>
                  </span>
                  <div id="forward-form">
                    <b>Send to</b>
                    <br />
                    <select>
                      <option value=""> -- Select -- </option>
                    </select>
                    <b>Add document message</b>
                    <br />
                    <textarea />
                    <button
                      type="submit"
                      className="usa-button"
                      aria-disabled="false"
                    >
                      <span>Forward</span>
                    </button>
                    <button type="button" className="usa-button-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="usa-width-two-thirds">
              <iframe src="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf" />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
