import { connect } from '@web-client/presenter/shared.cerebral';
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
          {isOpinion && (
            <>
              {' '}
              Any online sourced citations in opinions filed after July 1, 2016
              can be viewed directly from the associated docket record.
            </>
          )}
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

SearchBoilerplateText.displayName = 'SearchBoilerplateText';
