// import { SortableColumnHeaderButton } from '../../ustc-ui/SortableColumnHeaderButton/SortableColumnHeaderButton';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerDocumentation = connect(
  {
    constants: state.constants,
    practitionerDetailHelper: state.practitionerDetailHelper,
  },
  function PractitionerDocumentation() {
    return (
      <>
        <div className="display-flex flex-justify-end">
          <Button
            link
            className="push-right margin-bottom-1"
            href="*"
            icon="plus"
          >
            Add file
          </Button>
        </div>
        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th>
                <th aria-label="Date Uploaded" className="small" colSpan="2">
                  Date Uploaded
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
