import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ItemizedPenaltiesModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    statistic: state.modal,
  },
  function ItemizedPenaltiesModal({ clearModalSequence, statistic }) {
    return (
      <ModalDialog
        cancelSequence={clearModalSequence}
        showButtons={false}
        title="Itemized Penalties"
      >
        <div>
          <table
            aria-describedby="tab-work-queue"
            className="usa-table ustc-table itemized-penalties-modal"
            id="itemized-penalties-modal-id"
          >
            <thead className="itemized-penalties-modal">
              <tr>
                <th></th>
                <th>IRS Notice</th>
                <th>Determination</th>
              </tr>
            </thead>
            <tbody>
              {statistic.itemizedPenalties.map((penaltyObject, index) => {
                return (
                  <tr key={`Penalty ${index + 1}`}>
                    <td>
                      <b>{`Penalty ${index + 1}`}</b>
                    </td>
                    <td>{penaltyObject.irsPenaltyAmount}</td>
                    <td>{penaltyObject.determinationPenaltyAmount || ''}</td>
                  </tr>
                );
              })}
              <tr className="total-subsection" key="totals">
                <td>
                  <b className="font-sans-lg">Total:</b>
                </td>
                <td>
                  <span className="font-sans-lg">
                    {statistic.irsTotalPenalties}
                  </span>
                </td>
                <td>
                  <span className="font-sans-lg">
                    {statistic.determinationTotalPenalties}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalDialog>
    );
  },
);

ItemizedPenaltiesModal.displayName = 'ItemizedPenaltiesModal';
