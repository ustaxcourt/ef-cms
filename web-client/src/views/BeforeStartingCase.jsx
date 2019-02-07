import { connect } from '@cerebral/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default connect(
  {},
  function BeforeStartingCase() {
    return (
      <section className="usa-section usa-grid before-starting-case">
        <h1 tabIndex="-1">Before you begin ...</h1>
        <p>
          There are a few things you need to do before you can submit your case
          online.
        </p>
        <div role="list">
          <div role="listitem">
            <FontAwesomeIcon
              icon="arrow-alt-circle-left"
              className="usa-width-one-sixth fa-10x fa-before"
            />
            <div className="usa-width-five-sixths">
              <div className="before-label">
                Have the IRS Notice(s) You've Received Available to Submit
              </div>
              <div className="before-explanation">words go here.</div>
            </div>
          </div>
        </div>

        {/* 
        <div>
          <div role="listitem">
            {' '}
            <FontAwesomeIcon icon="arrow-alt-circle-left" size="lg" />
            <div className="before-label">Fill Out Your Petition Form</div>
            <div className="before-explanation">words go here.</div>
          </div>
          <div role="listitem">
            {' '}
            <FontAwesomeIcon icon="arrow-alt-circle-left" size="sm" />
            <div className="before-label">
              Remove Personal Information From Your Petition and IRS Notice(s)
            </div>
            <div className="before-explanation">words go here.</div>
          </div>
          <div role="listitem">
            {' '}
            <FontAwesomeIcon icon="arrow-alt-circle-left" size="sm" />
            <div className="before-label">
              Combine Your Petition and IRS Notice(s) Into a Single PDF
            </div>
            <div className="before-explanation">words go here.</div>
          </div>
          <div role="listitem">
            {' '}
            <FontAwesomeIcon icon="arrow-alt-circle-left" size="sm" />
            <div className="before-label">
              Don't Submit Extra Documents With Your Petition
            </div>
            <div className="before-explanation">words go here.</div>
          </div>
        </div>
        */}
        <a className="usa-button" href="/start-a-case">
          Got It, Let's Start My Case
        </a>
        <a className="usa-button usa-button-secondary" href="/">
          Cancel
        </a>
      </section>
    );
  },
);
