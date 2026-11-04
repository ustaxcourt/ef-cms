import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { goToCase } from '../caseDetail/go-to-case';
import {
  BRIEF_IN_SUPPORT_EVENT_CODE,
  MEMORANDA_IN_SUPPORT_EVENT_CODE,
  MOTION_FOR_CONTINUANCE_EVENT_CODE,
  MOTION_FOR_LEAVE_EVENT_CODE,
} from './motion-visibility-constants';
import {
  getMotionVisibilityPublicDocketEntry,
  MotionForLeaveDocketEntries,
  MotionVisibilityDocketEntries,
  MotionVisibilityPublicDocketEntry,
} from './motion-visibility-types';

export function getMotionForLeaveEntriesFromDocketEntries(
  docketEntries: PublicDocketEntry[],
): MotionForLeaveDocketEntries {
  const motionForLeaveDocketEntry = docketEntries.find(entry =>
    [MOTION_FOR_LEAVE_EVENT_CODE, 'M014'].includes(entry.eventCode ?? ''),
  );

  if (!motionForLeaveDocketEntry) {
    throw new Error('Motion for leave docket entry was not found');
  }

  const lodgedSecondaryDocketEntry = docketEntries.find(
    entry =>
      entry.lodged === true &&
      !entry.isPaper &&
      !entry.previousDocument &&
      entry.docketEntryId !== motionForLeaveDocketEntry.docketEntryId,
  );

  if (!lodgedSecondaryDocketEntry) {
    throw new Error('Lodged secondary motion docket entry was not found');
  }

  const motionForLeave = getMotionVisibilityPublicDocketEntry(
    motionForLeaveDocketEntry,
  );
  const lodgedSecondary = getMotionVisibilityPublicDocketEntry(
    lodgedSecondaryDocketEntry,
  );
  const primarySupportingEntries: MotionVisibilityPublicDocketEntry[] = [];
  const lodgedSecondarySupportingEntries: MotionVisibilityPublicDocketEntry[] =
    [];

  docketEntries.forEach(entry => {
    if (
      entry.eventCode !== BRIEF_IN_SUPPORT_EVENT_CODE &&
      entry.eventCode !== MEMORANDA_IN_SUPPORT_EVENT_CODE
    ) {
      return;
    }

    const supportingEntry = getMotionVisibilityPublicDocketEntry(entry);

    if (
      entry.previousDocument?.docketEntryId === motionForLeave.docketEntryId
    ) {
      primarySupportingEntries.push(supportingEntry);
      return;
    }

    if (
      entry.previousDocument?.docketEntryId === lodgedSecondary.docketEntryId
    ) {
      lodgedSecondarySupportingEntries.push(supportingEntry);
    }
  });

  primarySupportingEntries.sort((a, b) => a.index - b.index);
  lodgedSecondarySupportingEntries.sort((a, b) => a.index - b.index);

  return {
    motionForLeave,
    lodgedSecondary,
    primarySupportingEntries,
    lodgedSecondarySupportingEntries,
  };
}

const filterDocketEntriesByEventCode = (
  docketEntries: PublicDocketEntry[],
  eventCode: string,
  isPaper?: boolean,
): PublicDocketEntry[] => {
  return docketEntries.filter(entry => {
    if (entry.eventCode !== eventCode) {
      return false;
    }

    if (isPaper === true && !entry.isPaper) {
      return false;
    }

    return !(isPaper === false && entry.isPaper);
  });
};

/**
 * The intercept is registered after visiting the home page so that it cannot
 * match an in-flight request from the previous page, which the visit aborts.
 */
function getDocketEntriesForCase(
  docketNumber: string,
): Cypress.Chainable<PublicDocketEntry[]> {
  cy.visit('/');
  cy.intercept('GET', `**/cases/${docketNumber}/docket-entries**`).as(
    'getDocketEntries',
  );
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    expect(response?.statusCode).to.eq(200);
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    expect(docketEntries).to.be.an('array');
    return docketEntries;
  });
}

export function getDocketEntriesByEventCodeForCase(
  docketNumber: string,
  eventCode: string,
  isPaper?: boolean,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry[]> {
  return getDocketEntriesForCase(docketNumber).then(docketEntries => {
    return filterDocketEntriesByEventCode(
      docketEntries,
      eventCode,
      isPaper,
    ).map(getMotionVisibilityPublicDocketEntry);
  });
}

export function getEFiledMotionEntryForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getDocketEntriesByEventCodeForCase(
    docketNumber,
    motionEventCode,
    false,
  ).then(entries => {
    if (entries.length === 0) {
      throw new Error(
        `Docket entry with event code ${motionEventCode} was not found`,
      );
    }

    return entries[0];
  });
}

export function getMotionVisibilityDocketEntriesForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityDocketEntries> {
  return getEFiledMotionEntryForCase(docketNumber, motionEventCode).then(
    motion =>
      getDocketEntriesByEventCodeForCase(
        docketNumber,
        BRIEF_IN_SUPPORT_EVENT_CODE,
        false,
      ).then(briefEntries => {
        const briefInSupport = briefEntries.find(
          entry => entry.index > motion.index,
        );

        return getDocketEntriesByEventCodeForCase(
          docketNumber,
          MEMORANDA_IN_SUPPORT_EVENT_CODE,
          false,
        ).then(memorandumEntries => {
          const memorandaInSupport = memorandumEntries.find(
            entry => entry.index > motion.index,
          );

          if (!briefInSupport || !memorandaInSupport) {
            throw new Error('Supporting documents for motion were not found');
          }

          return {
            motion,
            briefInSupport,
            memorandaInSupport,
          };
        });
      }),
  );
}

export function getMotionForLeaveEntriesForCase(
  docketNumber: string,
): Cypress.Chainable<MotionForLeaveDocketEntries> {
  return getDocketEntriesForCase(docketNumber).then(
    getMotionForLeaveEntriesFromDocketEntries,
  );
}
