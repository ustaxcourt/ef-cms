import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Interstitial = () => (
  <div
    aria-label="please wait"
    aria-live="assertive"
    className="progress-indicator"
  >
    <FontAwesomeIcon icon="sync" className="fa-spin spinner" size="6x" />
  </div>
);
