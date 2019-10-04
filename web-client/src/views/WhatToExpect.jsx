import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const WhatToExpect = () => (
  <>
    <h2>What to Expect When Filing a Petition Online</h2>
    <div className="icon-list">
      <div className="icon-item">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              className="bullet-icon"
              icon={['far', 'file-pdf']}
              size="lg"
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
              className="bullet-icon"
              icon={'dollar-sign'}
              size="lg"
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
              className="bullet-icon"
              icon={'laptop'}
              size="lg"
            />
          </div>
        </div>
        <span className="description-wrapper">
          You’ll be able to log in to this portal at any time to view the status
          and take action on your case
        </span>
      </div>
    </div>
    <Button
      className="margin-right-0"
      href="/before-filing-a-petition"
      icon="file"
      id="init-file-petition"
    >
      File a Petition
    </Button>
  </>
);
