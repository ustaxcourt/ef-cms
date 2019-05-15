import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const DocumentType = connect(
  { addDocketEntryHelper: state.addDocketEntryHelper },
  ({ addDocketEntryHelper }) => {
    return (
      <React.Fragment>
        <input type="text" name="eventCode" onChange="" className="usa-input" />
        <button type="button">Search</button>
        <br />
        <Select options={addDocketEntryHelper.internalDocumentTypes} />
      </React.Fragment>
    );
  },
);
