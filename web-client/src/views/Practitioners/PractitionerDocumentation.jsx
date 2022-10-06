import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    constants: state.constants,
    practitionerDetailHelper: state.practitionerDetailHelper,
    showSortableHeaders: state.showSortableHeaders,
  },
  function PractitionerDocumentation({
    constants,
    practitionerDetailHelper,
    showSortableHeaders,
  }) {
    return (
      <>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th>Date Uploaded</th>
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
