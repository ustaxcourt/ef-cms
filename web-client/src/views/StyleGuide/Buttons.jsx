import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Buttons = () => (
  <section className="usa-section grid-container">
    <h1>Buttons</h1>
    <hr />
    <button className="usa-button">Primary Default</button>
    <button className="usa-button usa-button-hover">Primary Hover</button>
    <button className="usa-button usa-button-active">Primary Active</button>
    <button className="usa-button usa-focus">Primary Focus</button>
    <button className="usa-button" disabled>
      Primary Disabled
    </button>
    <button className="usa-button">
      <FontAwesomeIcon icon="check-circle" size="sm" />
      Primary Icon
    </button>
    <button className="usa-button usa-button--outline">
      Secondary Default
    </button>
    <button className="usa-button usa-button--outline usa-button--hover">
      Secondary Hover
    </button>
    <button className="usa-button usa-button--outline usa-button--active">
      Secondary Active
    </button>
    <button className="usa-button usa-button--outline usa-focus">
      Secondary Focus
    </button>
    <button className="usa-button usa-button--outline" disabled>
      Secondary Disabled
    </button>
  </section>
);
