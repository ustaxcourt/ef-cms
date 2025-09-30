import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Case } from '@shared/business/entities/cases/Case';

export const IndividualWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueueOutbox({ formattedWorkQueue, workQueueHelper }) {
    const consolidatedWorkItems = formattedWorkQueue
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

          memberCasesUniqueForDoc.sort((a: any, b: any) => {
            return Case.docketNumberSort(a.docketNumber, b.docketNumber);
          })

          return {
            key: `${group.lead}-${docGroup.key}`,
            groupLead: group.lead,
            docGroupKey: docGroup.key,
            item: representative,
            leadItemForIcons,
            memberCasesUniqueForDoc,
          };
        });
      });

    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {consolidatedWorkItems.length}
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
          <tbody >
            {consolidatedWorkItems.map(rowData => (
              <tr
                key={rowData.key}
                data-testid={`work-item-outbox-row-${rowData.groupLead}-${rowData.docGroupKey}`}
              >
                <td className="consolidated-case-column">
                  {rowData.memberCasesUniqueForDoc.length > 1 ? (
                    <div
                      className="consolidated-icons-stack"
                      aria-hidden="true"
                    >
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          rowData.leadItemForIcons.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={
                          rowData.leadItemForIcons.inConsolidatedGroup
                        }
                        showLeadCaseIcon={
                          rowData.leadItemForIcons.leadDocketNumber ===
                          rowData.leadItemForIcons.docketNumber
                        }
                      />
                      {rowData.memberCasesUniqueForDoc
                        .filter(
                          (c: any) =>
                            c.docketNumber !==
                            rowData.leadItemForIcons.docketNumber,
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
                        rowData.leadItemForIcons.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={
                        rowData.leadItemForIcons.inConsolidatedGroup
                      }
                      showLeadCaseIcon={
                        rowData.leadItemForIcons.leadDocketNumber ===
                        rowData.leadItemForIcons.docketNumber
                      }
                    />
                  )}
                </td>
                <td
                  className="message-queue-row small"
                  data-testid={`section-work-item-outbox-${rowData.item.workItemId}`}
                >
                  {rowData.memberCasesUniqueForDoc.length > 1 ? (
                    <div className="grouped-cases-row">
                      <div className="member-case-links">
                        {rowData.memberCasesUniqueForDoc
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
                    <CaseLink formattedCase={rowData.leadItemForIcons} />
                  )}
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {rowData.leadItemForIcons.caseTitle}
                </td>
                <td className="message-queue-row message-queue-document">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      data-testid="work-item-outbox-document-link"
                      href={rowData.leadItemForIcons.editLink}
                    >
                      {(rowData.leadItemForIcons.docketEntry &&
                        rowData.leadItemForIcons.docketEntry
                          .descriptionDisplay) ||
                        (rowData.leadItemForIcons.docketEntry &&
                          rowData.leadItemForIcons.docketEntry.documentType)}
                    </a>
                  </div>
                </td>
                {workQueueHelper.showFiledByColumn && (
                  <td className="message-queue-row">
                    {rowData.item.docketEntry.filedBy}
                  </td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">
                    {rowData.item.formattedCaseStatus}
                  </td>
                )}
                <td className="message-queue-row">
                  {rowData.item.completedAtFormatted}
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

IndividualWorkQueueOutbox.displayName = 'IndividualWorkQueueOutbox';
