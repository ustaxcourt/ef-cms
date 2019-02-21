import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const WhatToExpect = () => (
  <>
    <h2>What to Expect When Filing a Case Online</h2>
    <div className="icon-description">
      <div className="bullet-icon-wrapper">
        <FontAwesomeIcon icon={'file-pdf'} size="lg" className="bullet-icon" />
      </div>
      You’ll provide the information we need to create your case
    </div>
    <div className="icon-description">
      <div className="bullet-icon-wrapper">
        <FontAwesomeIcon
          icon={'dollar-sign'}
          size="lg"
          className="bullet-icon"
        />
      </div>
      You’ll be asked to pay the $60 filing fee after you submit your case
    </div>
    <div className="icon-description">
      <div className="bullet-icon-wrapper">
        <FontAwesomeIcon icon={'laptop'} size="lg" className="bullet-icon" />
      </div>
      You’ll be able to log in to this portal at any time to view the status and
      take action on your case
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
