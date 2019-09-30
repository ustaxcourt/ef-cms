import { ButtonLink } from '../../ustc-ui/Buttons/ButtonLink';
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
    <ButtonLink>Button Link</ButtonLink>
    <ButtonLink icon="question-circle">Button Link</ButtonLink>
    <ButtonLink secondary>Button Link</ButtonLink>
    <ButtonLink secondary icon="question-circle">
      Button Link
    </ButtonLink>
    <ButtonLink link>Button Link</ButtonLink>
    <ButtonLink link icon="question-circle">
      Button Link
    </ButtonLink>

    <hr />
    <ButtonLink href="/">Button Link</ButtonLink>
    <ButtonLink href="/" icon="question-circle">
      Button Link
    </ButtonLink>
    <ButtonLink secondary href="/">
      Button Link
    </ButtonLink>
    <ButtonLink secondary href="/" icon="question-circle">
      Button Link
    </ButtonLink>
    <ButtonLink link href="/">
      Button Link
    </ButtonLink>
    <ButtonLink link href="/" icon="question-circle">
      Button Link
    </ButtonLink>
  </section>
);
