import {
  CASE_DISMISSAL_ORDER_TYPES,
  CASE_STATUS_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { NotFoundError } from '@web-api/errors/errors';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { isLeadCase } from '../../../../../shared/src/business/entities/cases/Case';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { deleteCaseDeadline } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { deleteCasesFromTrialSession } from '@web-api/persistence/postgres/trialSessions/deleteCasesFromTrialSession';
import { removeCaseFromTrialSession } from '@web-api/persistence/postgres/trialSessions/removeCaseFromTrialSession';
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

export const closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments =
  async ({ applicationContext, caseEntity, eventCode }) => {
    let closedStatus:
      | typeof CASE_STATUS_TYPES.closed
      | typeof CASE_STATUS_TYPES.closedDismissed = CASE_STATUS_TYPES.closed;

    if (CASE_DISMISSAL_ORDER_TYPES.includes(eventCode)) {
      closedStatus = CASE_STATUS_TYPES.closedDismissed;
    }

    caseEntity.setCaseStatus({
      date: applicationContext.getUtilities().createISODateString(),
      updatedCaseStatus: closedStatus,
    });

    const caseDeadlines = await getCaseDeadlinesByDocketNumber({
      docketNumber: caseEntity.docketNumber,
    });

    const DEADLINE_TASKS: Promise<any>[] = caseDeadlines.map(async deadline => {
      return deleteCaseDeadline({
        caseDeadlineId: deadline.caseDeadlineId,
      });
    });

    const LEAD_CASE_DEADLINES = caseDeadlines.map(cd => cd.caseDeadlineId);
    if (
      isLeadCase(caseEntity) &&
      LEAD_CASE_DEADLINES.length
    ) {
      const CHILDREN_DEADLINES =
        await getCaseDeadlinesByConsolidatedCaseDeadlineIds(
          LEAD_CASE_DEADLINES,
        );

      DEADLINE_TASKS.push(
        ...CHILDREN_DEADLINES.map(async childCaseDeadline => {
          return upsertCaseDeadlines([
            {
              ...childCaseDeadline,
              consolidatedCaseDeadlineId: undefined,
            },
          ]);
        }),
      );
    }

    await settlePromises(DEADLINE_TASKS);
    caseEntity.updateAutomaticBlocked({ hasCaseDeadline: false });

    if (caseEntity.trialSessionId) {
      const trialSession = await getTrialSessionById({
        trialSessionId: caseEntity.trialSessionId,
      });

      if (!trialSession) {
        throw new NotFoundError(
          `Trial session ${caseEntity.trialSessionId} was not found.`,
        );
      }

      const trialSessionEntity = new TrialSession(trialSession);

      if (trialSessionEntity.isCalendared) {
        trialSessionEntity.removeCaseFromCalendar({
          disposition: 'Status was changed to Closed',
          docketNumber: caseEntity.docketNumber,
        });
        await removeCaseFromTrialSession({
          docketNumber: caseEntity.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
          disposition: 'Status was changed to Closed',
        });

        await updateTrialSession({
          trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
        });
      } else {
        trialSessionEntity.deleteCaseFromCalendar({
          docketNumber: caseEntity.docketNumber,
        });

        await deleteCasesFromTrialSession({
          docketNumbers: [caseEntity.docketNumber],
          trialSessionId: trialSessionEntity.trialSessionId,
        });
      }
    }
  };
