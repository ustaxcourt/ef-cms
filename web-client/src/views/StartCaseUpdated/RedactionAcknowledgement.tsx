import React from 'react';
import classNames from 'classnames';

export function RedactionAcknowledgement({
  handleChange,
  id,
  name,
  redactionAcknowledgement,
}) {
  return (
    <div className={classNames('card', 'max-width-fit-content')}>
      <div className="content-wrapper usa-checkbox">
        <input
          aria-describedby={`${id}-acknowledgement-label`}
          checked={redactionAcknowledgement || false}
          className="usa-checkbox__input"
          id={`${id}-acknowledgement`}
          name={name}
          type="checkbox"
          onChange={e => {
            handleChange({
              key: e.target.name,
              value: e.target.checked,
            });
          }}
        />
        <label
          className="usa-checkbox__label margin-top-0"
          data-testid={`${id}-acknowledgement-label`}
          htmlFor={`${id}-acknowledgement`}
          id={`${id}-acknowledgement-label`}
        >
          <b>
            All documents I am filing have been redacted in accordance with{' '}
            <a
              href="https://ustaxcourt.gov/resources/ropp/Rule-27_Amended_03202023.pdf"
              rel="noreferrer"
              target="_blank"
            >
              Rule 27
            </a>
            .
          </b>
        </label>
      </div>
    </div>
  );
}
