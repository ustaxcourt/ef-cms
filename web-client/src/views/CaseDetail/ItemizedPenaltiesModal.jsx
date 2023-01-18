import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ItemizedPenaltiesModal = connect(
  { penalties: state.modal.itemizedPenaltiesModal },
  function ItemizedPenaltiesModal({ penalties }) {
    return (
      <ModalDialog
        className="text-center"
        showButtons={false}
        title="Itemized Penalties"
      >
        <div style={{ borderStyle: 'hidden' }}>
          <table
            aria-describedby="tab-work-queue"
            className="usa-table ustc-table subsection"
            id="section-work-queue"
          >
            <thead>
              <tr>
                <th></th>
                <th>IRS Notice</th>
                <th>Determination</th>
              </tr>
            </thead>
            <tbody>
              {penalties.map()}
              <tr>
                <td>Penalty 1</td>
                <td>{}</td>
                <td>{}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalDialog>
    );
  },
);

ItemizedPenaltiesModal.displayName = 'ItemizedPenaltiesModal';
