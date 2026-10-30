import { Button } from '../../ustc-ui/Button/Button';
import { ItemizedPenaltiesModal } from './ItemizedPenaltiesModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Statistics = connect(
  {
    caseDetail: state.caseDetail,
    openItemizedPenaltiesModalSequence:
      sequences.openItemizedPenaltiesModalSequence,
    showModal: state.modal.showModal,
    statisticsHelper: state.statisticsHelper,
  },
  function Statistics({
    caseDetail,
    openItemizedPenaltiesModalSequence,
    showModal,
    statisticsHelper,
  }) {
    return (
      <>
        {statisticsHelper.showAddButtons && (
          <div className="grid-row grid-gap flex-justify-end margin-bottom-2">
            {statisticsHelper.showAddDeficiencyStatisticsButton && (
              <Button
                link
                className="push-right padding-0"
                href={`/case-detail/${caseDetail.docketNumber}/add-deficiency-statistics`}
                icon="plus-circle"
              >
                Add New Year/Period
              </Button>
            )}
            {statisticsHelper.showAddOtherStatisticsButton && (
              <Button
                link
                className="push-right padding-0"
                href={`/case-detail/${caseDetail.docketNumber}/add-other-statistics`}
                icon="plus-circle"
              >
                Add Other Statistics
              </Button>
            )}
          </div>
        )}
        {statisticsHelper.showNoStatistics && (
          <p>There are no statistics for this case.</p>
        )}
        {statisticsHelper.formattedStatistics &&
          statisticsHelper.formattedStatistics.map(statistic => (
            <div className="tw:flex tw:flex-wrap" key={statistic.statisticId}>
              <h4 className="tw:w-full">{statistic.formattedDate}</h4>
              <table
                className="usa-table ustc-table responsive-table tw:w-1/2"
                data-testid={`statistics-table-${statistic.statisticId}`}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>Deficiency</th>
                    <th>Penalties</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tw:font-semibold">IRS Notice</td>
                    <td>{statistic.formattedIrsDeficiencyAmount}</td>
                    <td>{statistic.formattedIrsTotalPenalties}</td>
                    <td>{statistic.formattedIrsTotal}</td>
                  </tr>
                  <tr>
                    <td className="tw:font-semibold">Determination</td>
                    <td>{statistic.formattedDeterminationDeficiencyAmount}</td>
                    <td>{statistic.formattedDeterminationTotalPenalties}</td>
                    <td>{statistic.formattedDeterminationTotal}</td>
                  </tr>
                </tbody>
              </table>
              {statisticsHelper.showEditButtons && (
                <Button
                  link
                  className="tw:self-start tw:ml-4"
                  href={statistic.editStatisticLink}
                  icon="edit"
                >
                  Edit Year/Period
                </Button>
              )}
              <Button
                link
                data-testid={`view-itemized-penalties-button-${statistic.statisticId}`}
                className="tw:self-start tw:ml-4"
                onClick={() => {
                  openItemizedPenaltiesModalSequence({
                    determinationTotalPenalties:
                      statistic.determinationTotalPenalties,
                    irsTotalPenalties: statistic.irsTotalPenalties,
                    penalties: statistic.penalties,
                  });
                }}
              >
                View Itemized Penalties
              </Button>
            </div>
          ))}
        {statisticsHelper.showOtherStatistics && (
          <div className="tw:flex tw:flex-wrap">
            <h4 className="tw:w-full">Other</h4>
            <table className="usa-table ustc-table responsive-table tw:w-1/2">
              <thead>
                <tr>
                  {statisticsHelper.showLitigationCosts && (
                    <th>Litigation costs</th>
                  )}
                  {statisticsHelper.showDamages && <th>Damages (IRC §6673)</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {statisticsHelper.showLitigationCosts && (
                    <td>{statisticsHelper.formattedLitigationCosts}</td>
                  )}
                  {statisticsHelper.showDamages && (
                    <td>{statisticsHelper.formattedDamages}</td>
                  )}
                </tr>
              </tbody>
            </table>
            {statisticsHelper.showEditButtons && (
              <Button
                link
                className="tw:self-start tw:ml-4"
                href={`/case-detail/${caseDetail.docketNumber}/edit-other-statistics`}
                icon="edit"
              >
                Edit Other Statistics
              </Button>
            )}
          </div>
        )}
        {showModal === 'ItemizedPenaltiesModal' && (
          <ItemizedPenaltiesModal cancelSequence="clearModalSequence" />
        )}
      </>
    );
  },
);

Statistics.displayName = 'Statistics';
