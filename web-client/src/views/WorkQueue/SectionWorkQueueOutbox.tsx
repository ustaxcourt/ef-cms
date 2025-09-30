import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WorkQueueAssignments } from './WorkQueueAssignments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { Case } from '@shared/business/entities/cases/Case';

interface ConsolidatedWorkItem {
  key: string;
  leadItemForIcons: any;
  memberCasesUnique: any[];
  representative: any;
  docGroup: { key: string; items: any[] };
  groupLead: string;
}

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
    // Process and consolidate work items at the top
    const consolidatedWorkItems: ConsolidatedWorkItem[] = formattedWorkQueue
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
      .flatMap(group => {
        const docGroups: Record<string, { key: string; items: any[] }> = {};

        // Group items by document title
        group.items.forEach((it: any) => {
          const docketEntryId = it.docketEntry && it.docketEntry.docketEntryId;
          const key = docketEntryId || 'unknown';
          if (!docGroups[key]) {
            docGroups[key] = { key, items: [it] };
          } else {
            docGroups[key].items.push(it);
          }
        });

        // Process each document group
        return Object.values(docGroups).map(docGroup => {
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
                  docketNumberWithSuffix: leadItemForIcons.docketNumberWithSuffix,
                  inLeadCase: leadItemForIcons.inLeadCase,
                },
                ...leadItemForIcons.groupedCases.filter(
                  (c: any) => c.docketNumber !== leadItemForIcons.docketNumber,
                ),
              ]
              : docGroup.items;

          // Deduplicate member cases
          const memberCasesUnique: any[] = [];
          const seen = new Set();
          (memberCasesForDoc || []).forEach((c: any) => {
            if (!c) return;
            const k = c.docketNumberWithSuffix || c.docketNumber;
            if (!k) return;
            if (!seen.has(k)) {
              seen.add(k);
              memberCasesUnique.push(c);
            }
          });

          memberCasesUnique.sort((a: any, b: any) => {
            return Case.docketNumberSort(a.docketNumber, b.docketNumber);
          })

          return {
            key: `${group.lead}-${docGroup.key}`,
            leadItemForIcons,
            memberCasesUnique,
            representative,
            docGroup,
            groupLead: group.lead,
          };
        });
      });

    return (
      <React.Fragment>
        <WorkQueueAssignments users={users} count={consolidatedWorkItems.length} />
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
          <tbody>
            {consolidatedWorkItems.map(workItem => (
              <tr
                key={workItem.key}
                data-testid={`work-item-section-outbox-${workItem.groupLead}-${workItem.docGroup.key}`}
              >
                <td className="consolidated-case-column">
                  {workItem.memberCasesUnique.length > 1 ? (
                    <div
                      className="consolidated-icons-stack"
                      aria-hidden="true"
                    >
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          workItem.leadItemForIcons.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={
                          workItem.leadItemForIcons.inConsolidatedGroup
                        }
                        showLeadCaseIcon={
                          workItem.leadItemForIcons.leadDocketNumber ===
                          workItem.leadItemForIcons.docketNumber
                        }
                      />
                      {workItem.memberCasesUnique
                        .filter(
                          (c: any) =>
                            c.docketNumber !==
                            workItem.leadItemForIcons.docketNumber,
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
                        workItem.leadItemForIcons.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={
                        workItem.leadItemForIcons.inConsolidatedGroup
                      }
                      showLeadCaseIcon={
                        workItem.leadItemForIcons.leadDocketNumber ===
                        workItem.leadItemForIcons.docketNumber
                      }
                    />
                  )}
                </td>
                <td className="message-queue-row">
                  {workItem.memberCasesUnique.length > 1 ? (
                    <div className="grouped-cases-row">
                      <div className="member-case-links">
                        {workItem.memberCasesUnique
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
                    <CaseLink formattedCase={workItem.leadItemForIcons} />
                  )}
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {workItem.leadItemForIcons.caseTitle}
                </td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      href={workItem.leadItemForIcons.editLink}
                    >
                      {(workItem.leadItemForIcons.docketEntry &&
                        workItem.leadItemForIcons.docketEntry.descriptionDisplay) ||
                        (workItem.leadItemForIcons.docketEntry &&
                          workItem.leadItemForIcons.docketEntry.documentType)}
                    </a>
                  </div>
                </td>
                {workQueueHelper.showFiledByColumn && (
                  <td className="message-queue-row">
                    {workItem.representative.docketEntry.filedBy}
                  </td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">
                    {workItem.representative.formattedCaseStatus}
                  </td>
                )}
                <td className="message-queue-row">
                  {workItem.representative.completedBy}
                </td>
                <td className="message-queue-row">
                  {workItem.representative.completedAtFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);

SectionWorkQueueOutbox.displayName = 'SectionWorkQueueOutbox';
