import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Buttons = () => (
  <section className="usa-section grid-container">
    <h1>Buttons</h1>
    <hr />
    <button className="usa-button margin-right-205 margin-bottom-205">
      Primary Default
    </button>
    <button className="usa-button usa-button--hover margin-right-205 margin-bottom-205">
      Primary Hover
    </button>
    <button className="usa-button usa-button--active margin-right-205 margin-bottom-205">
      Primary Active
    </button>
    <button className="usa-button usa-focus margin-right-205 margin-bottom-205">
      Primary Focus
    </button>
    <button disabled className="usa-button margin-right-205 margin-bottom-205">
      Primary Disabled
    </button>
    <button className="usa-button margin-right-205 margin-bottom-205">
      <FontAwesomeIcon icon="check-circle" size="1x" />
      Primary Icon
    </button>
    <button className="usa-button usa-button--outline margin-right-205 margin-bottom-205">
      Secondary Default
    </button>
    <button className="usa-button usa-button--outline usa-button--hover margin-right-205 margin-bottom-205">
      Secondary Hover
    </button>
    <button className="usa-button usa-button--outline usa-button--active margin-right-205 margin-bottom-205">
      Secondary Active
    </button>
    <button className="usa-button usa-button--outline usa-focus margin-right-205 margin-bottom-205">
      Secondary Focus
    </button>
    <button
      disabled
      className="usa-button usa-button--outline margin-right-205 margin-bottom-205"
    >
      Secondary Disabled
    </button>
    <hr />
    <Button>Button Link</Button>
    <Button icon="question-circle">Button Link</Button>
    <Button secondary>Button Link</Button>
    <Button secondary icon="question-circle">
      Button Link
    </Button>
    <Button link>Button Link</Button>
    <Button link icon="question-circle">
      Button Link
    </Button>

    <hr />
    <Button href="/">Button Link</Button>
    <Button href="/" icon="question-circle">
      Button Link
    </Button>
    <Button secondary href="/">
      Button Link
    </Button>
    <Button secondary href="/" icon="question-circle">
      Button Link
    </Button>
    <Button link href="/">
      Button Link
    </Button>
    <Button link href="/" icon="question-circle">
      Button Link
    </Button>
  </section>
);
