import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueOutbox({
    formattedWorkQueue,
    users,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} />
        <table
          aria-describedby="tab-work-queue"
          className="usa-table ustc-table subsection"
          data-testid="section-work-queue-in-outbox"
          id="section-work-queue"
        >
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case title</th>
              <th>Document</th>
              {workQueueHelper.showFiledByColumn && <th>Filed By</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
              <th>{workQueueHelper.sentTitle} By</th>
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
              const docGroups: Record<string, { key: string; items: any[] }> =
                {};
              group.items.forEach((it: any) => {
                const docTitle =
                  (it.docketEntry && it.docketEntry.descriptionDisplay) ||
                  (it.docketEntry && it.docketEntry.documentType) ||
                  'Document';
                const key = docTitle;
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

                const leadItemForIconsLocal =
                  leaderWithGroupedInDoc ||
                  leaderWithGroupedInGroup ||
                  docGroup.items.find(
                    (it: any) => it.docketNumber === group.lead,
                  ) ||
                  docGroup.items[0];

                const memberCasesForDoc =
                  leadItemForIconsLocal && leadItemForIconsLocal.groupedCases
                    ? [
                        {
                          docketNumber: leadItemForIconsLocal.docketNumber,
                          docketNumberWithSuffix:
                            leadItemForIconsLocal.docketNumberWithSuffix,
                          inLeadCase: leadItemForIconsLocal.inLeadCase,
                        },
                        ...leadItemForIconsLocal.groupedCases.filter(
                          (c: any) =>
                            c.docketNumber !==
                            leadItemForIconsLocal.docketNumber,
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
                      data-testid={`work-item-section-outbox-${group.lead}-${docGroup.key}`}
                    >
                      <td className="consolidated-case-column">
                        {memberCasesUniqueForDoc.length > 1 ? (
                          <div
                            className="consolidated-icons-stack"
                            aria-hidden="true"
                          >
                            <ConsolidatedCaseIcon
                              consolidatedIconTooltipText={
                                leadItemForIconsLocal.consolidatedIconTooltipText
                              }
                              inConsolidatedGroup={
                                leadItemForIconsLocal.inConsolidatedGroup
                              }
                              showLeadCaseIcon={
                                leadItemForIconsLocal.leadDocketNumber ===
                                leadItemForIconsLocal.docketNumber
                              }
                            />
                            {memberCasesUniqueForDoc
                              .filter(
                                (c: any) =>
                                  c.docketNumber !==
                                  leadItemForIconsLocal.docketNumber,
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
                              leadItemForIconsLocal.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={
                              leadItemForIconsLocal.inConsolidatedGroup
                            }
                            showLeadCaseIcon={
                              leadItemForIconsLocal.leadDocketNumber ===
                              leadItemForIconsLocal.docketNumber
                            }
                          />
                        )}
                      </td>
                      <td className="message-queue-row">
                        {memberCasesUniqueForDoc.length > 1 ? (
                          <div className="grouped-cases-row">
                            <div className="member-case-links">
                              {memberCasesUniqueForDoc
                                .sort((a: any, b: any) => {
                                  if (a.inLeadCase && !b.inLeadCase) return -1;
                                  if (!a.inLeadCase && b.inLeadCase) return 1;
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
                          <CaseLink formattedCase={leadItemForIconsLocal} />
                        )}
                      </td>
                      <td className="message-queue-row message-queue-case-title">
                        {leadItemForIconsLocal.caseTitle}
                      </td>
                      <td className="message-queue-row">
                        <div className="message-document-title">
                          <a
                            className="case-link"
                            href={leadItemForIconsLocal.editLink}
                          >
                            {(leadItemForIconsLocal.docketEntry &&
                              leadItemForIconsLocal.docketEntry
                                .descriptionDisplay) ||
                              (leadItemForIconsLocal.docketEntry &&
                                leadItemForIconsLocal.docketEntry.documentType)}
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
                      <td className="message-queue-row">{item.completedBy}</td>
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

SectionWorkQueueOutbox.displayName = 'SectionWorkQueueOutbox';
