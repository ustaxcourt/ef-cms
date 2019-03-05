import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const WhatToExpect = () => (
  <>
    <h2>What to Expect When Filing a Case Online</h2>
    <div className="icon-list">
      <div className="icon-item">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              icon={'file-pdf'}
              size="lg"
              className="bullet-icon"
            />
          </div>
        </div>
        <span className="description-wrapper">
          You’ll provide the information we need to create your case
        </span>
        <span className="placeholder" />
      </div>
      <div className="icon-description">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              icon={'dollar-sign'}
              size="lg"
              className="bullet-icon"
            />
          </div>
        </div>
        <span className="description-wrapper">
          You’ll be asked to pay the $60 filing fee after you submit your case
        </span>
      </div>
      <div className="icon-description">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              icon={'laptop'}
              size="lg"
              className="bullet-icon"
            />
          </div>
        </div>
        <span className="description-wrapper">
          You’ll be able to log in to this portal at any time to view the status
          and take action on your case
        </span>
      </div>
    </div>
    <a
      className="usa-button"
      href="/before-starting-a-case"
      id="init-file-petition"
    >
      Start a Case
    </a>
  </>
);
