import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    constants: state.constants,
    practitionerDetailHelper: state.practitionerDetailHelper,
  },
  function PractitionerDocumentation({ constants, practitionerDetailHelper }) {
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th>
                <th aria-label="Date Uploaded" className="small" colSpan="2">
                  <SortableColumnHeaderButton
                    ascText={constants.CHRONOLOGICALLY_ASCENDING}
                    defaultSort={constants.DESCENDING}
                    descText={constants.CHRONOLOGICALLY_DESCENDING}
                    hasRows={true}
                    sortField="dateUploaded"
                    title="Date Uploaded"
                    onClickSequence={() => console.log('clicked!!!')}
                  />
                </th>
              </th>
              <th>File Name</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
        </table>
      </>
    );
  },
);
