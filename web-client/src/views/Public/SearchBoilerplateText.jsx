import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const SearchBoilerplateText = connect(
  {
    formTypeText: props.formTypeText,
    isOpinion: props.isOpinion,
  },
  function SearchBoilerplateText({ formTypeText, isOpinion = false }) {
    return (
      <>
        <p className="margin-top-0">
          Anyone can search for {formTypeText} in our system for cases filed{' '}
          <span className="text-semibold">on or after May 1, 1986</span>.
        </p>
        <ul>
          <li>
            {' '}
            If you aren’t affiliated with a case, you will only see limited
            information about that case.
          </li>
          {!isOpinion && (
            <li>
              Sealed cases and affiliated documents will not display in search
              results.
            </li>
          )}
        </ul>
      </>
    );
  },
);
