import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';

export const IndividualWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueOutbox({ formattedWorkQueue, workQueueHelper }) {
    const rowsCount = workQueueHelper.outboxRenderedRowCount || 0;

    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {rowsCount}
        </div>
        <div className="padding-1"></div>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table ustc-table subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case Title</th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && (
                <th>{workQueueHelper.outboxFiledByColumnLabel} By</th>
              )}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && (
                <th className="max-width-7">Assigned To</th>
              )}
              <th>{workQueueHelper.sentTitle} Date</th>
            </tr>
          </thead>
          {formattedWorkQueue
            .reduce((acc: any[], item: any) => {
              const lead = item.leadDocketNumber || item.docketNumber;
              const existing = acc.find(group => group.lead === lead);
              if (existing) {
                existing.items.push(item);
              } else {
                acc.push({ lead, items: [item] });
              }
              return acc;
            }, [])
            .map(group => {
              const leaderWithGrouped = group.items.find(
                (it: any) => it.groupedCases && it.groupedCases.length > 0,
              );
              const leadItemForIcons =
                leaderWithGrouped ||
                group.items.find((it: any) => it.docketNumber === group.lead) ||
                group.items[0];

              const memberCases = leaderWithGrouped
                ? [
                  {
                    docketNumber: leadItemForIcons.docketNumber,
                    docketNumberWithSuffix:
                      leadItemForIcons.docketNumberWithSuffix,
                    inLeadCase: leadItemForIcons.inLeadCase,
                  },
                  ...leadItemForIcons.groupedCases.filter(
                    (c: any) =>
                      c.docketNumber !== leadItemForIcons.docketNumber,
                  ),
                ]
                : group.items;

              const memberCasesUnique: any[] = [];
              const _seen = new Set();
              (memberCases || []).forEach((c: any) => {
                if (!c || !c.docketNumber) return;
                if (!_seen.has(c.docketNumber)) {
                  _seen.add(c.docketNumber);
                  memberCasesUnique.push(c);
                }
              });

              const docGroups: Record<string, { key: string; items: any[] }> =
                {};
              group.items.forEach((it: any) => {
                const docketEntryId = it.docketEntry && it.docketEntry.docketEntryId;
                const key = docketEntryId || 'unknown';
                if (!docGroups[key]) {
                  docGroups[key] = { key, items: [it] };
                } else {
                  docGroups[key].items.push(it);
                }
              });

              const rows: any[] = [];
              Object.values(docGroups).forEach(docGroup => {
                const representative = docGroup.items[0];
                const leaderWithGroupedInDoc = docGroup.items.find(
                  (it: any) => it.groupedCases && it.groupedCases.length > 0,
                );
                const leaderWithGroupedInGroup = group.items.find(
                  (it: any) => it.groupedCases && it.groupedCases.length > 0,
                );

                const leadItemForIcons =
                  leaderWithGroupedInDoc ||
                  leaderWithGroupedInGroup ||
                  docGroup.items.find(
                    (it: any) => it.docketNumber === group.lead,
                  ) ||
                  docGroup.items[0];

                const memberCasesForDoc =
                  leadItemForIcons && leadItemForIcons.groupedCases
                    ? [
                      {
                        docketNumber: leadItemForIcons.docketNumber,
                        docketNumberWithSuffix:
                          leadItemForIcons.docketNumberWithSuffix,
                        inLeadCase: leadItemForIcons.inLeadCase,
                      },
                      ...leadItemForIcons.groupedCases.filter(
                        (c: any) =>
                          c.docketNumber !== leadItemForIcons.docketNumber,
                      ),
                    ]
                    : docGroup.items;

                const memberCasesUniqueForDoc: any[] = [];
                const _seenDoc = new Set();
                (memberCasesForDoc || []).forEach((c: any) => {
                  if (!c) return;
                  const k = c.docketNumberWithSuffix || c.docketNumber;
                  if (!k) return;
                  if (!_seenDoc.has(k)) {
                    _seenDoc.add(k);
                    memberCasesUniqueForDoc.push(c);
                  }
                });

                const item = representative;

                rows.push(
                  <tbody key={`${group.lead}-${docGroup.key}`}>
                    <tr
                      data-testid={`work-item-outbox-row-${group.lead}-${docGroup.key}`}
                    >
                      <td className="consolidated-case-column">
                        {memberCasesUniqueForDoc.length > 1 ? (
                          <div
                            className="consolidated-icons-stack"
                            aria-hidden="true"
                          >
                            <ConsolidatedCaseIcon
                              consolidatedIconTooltipText={
                                leadItemForIcons.consolidatedIconTooltipText
                              }
                              inConsolidatedGroup={
                                leadItemForIcons.inConsolidatedGroup
                              }
                              showLeadCaseIcon={
                                leadItemForIcons.leadDocketNumber ===
                                leadItemForIcons.docketNumber
                              }
                            />
                            {memberCasesUniqueForDoc
                              .filter(
                                (c: any) =>
                                  c.docketNumber !==
                                  leadItemForIcons.docketNumber,
                              )
                              .map((c: any) => (
                                <ConsolidatedCaseIcon
                                  key={`icon-${c.docketNumber}`}
                                  consolidatedIconTooltipText={
                                    c.inLeadCase
                                      ? 'Lead case'
                                      : 'Consolidated case'
                                  }
                                  inConsolidatedGroup={true}
                                  showLeadCaseIcon={c.inLeadCase}
                                />
                              ))}
                          </div>
                        ) : (
                          <ConsolidatedCaseIcon
                            consolidatedIconTooltipText={
                              leadItemForIcons.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={
                              leadItemForIcons.inConsolidatedGroup
                            }
                            showLeadCaseIcon={
                              leadItemForIcons.leadDocketNumber ===
                              leadItemForIcons.docketNumber
                            }
                          />
                        )}
                      </td>
                      <td
                        className="message-queue-row small"
                        data-testid={`section-work-item-outbox-${item.workItemId}`}
                      >
                        {memberCasesUniqueForDoc.length > 1 ? (
                          <div className="grouped-cases-row">
                            <div className="member-case-links">
                              {memberCasesUniqueForDoc
                                .sort((a: any, b: any) => {
                                  if (a.inLeadCase && !b.inLeadCase) return -1;
                                  const [an, ay] = (a.docketNumber || '').split(
                                    '-',
                                  );
                                  const [bn, by] = (b.docketNumber || '').split(
                                    '-',
                                  );
                                  const ani = parseInt(an, 10);
                                  const bni = parseInt(bn, 10);
                                  if (ani !== bni)
                                    return (
                                      (isNaN(ani)
                                        ? Number.MAX_SAFE_INTEGER
                                        : ani) -
                                      (isNaN(bni)
                                        ? Number.MAX_SAFE_INTEGER
                                        : bni)
                                    );
                                  return (ay || '').localeCompare(by || '');
                                })
                                .map((c: any) => (
                                  <div
                                    key={c.docketNumber}
                                    className="member-case-line"
                                  >
                                    <CaseLink formattedCase={c} />
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <CaseLink formattedCase={leadItemForIcons} />
                        )}
                      </td>
                      <td className="message-queue-row message-queue-case-title">
                        {leadItemForIcons.caseTitle}
                      </td>
                      <td className="message-queue-row message-queue-document">
                        <div className="message-document-title">
                          <a
                            className="case-link"
                            data-testid="work-item-outbox-document-link"
                            href={leadItemForIcons.editLink}
                          >
                            {(leadItemForIcons.docketEntry &&
                              leadItemForIcons.docketEntry
                                .descriptionDisplay) ||
                              (leadItemForIcons.docketEntry &&
                                leadItemForIcons.docketEntry.documentType)}
                          </a>
                        </div>
                      </td>
                      {workQueueHelper.showFiledByColumn && (
                        <td className="message-queue-row">
                          {item.docketEntry.filedBy}
                        </td>
                      )}
                      {!workQueueHelper.hideCaseStatusColumn && (
                        <td className="message-queue-row">
                          {item.formattedCaseStatus}
                        </td>
                      )}
                      <td className="message-queue-row">
                        {item.completedAtFormatted}
                      </td>
                    </tr>
                  </tbody>,
                );
              });

              return rows;
            })}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

IndividualWorkQueueOutbox.displayName = 'IndividualWorkQueueOutbox';
