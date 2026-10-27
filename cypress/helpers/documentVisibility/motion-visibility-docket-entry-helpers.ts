import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { goToCase } from '../caseDetail/go-to-case';
import {
  getMotionVisibilityPublicDocketEntry,
  MOTION_FOR_LEAVE_EVENT_CODE,
  MotionForLeaveDocketEntries,
  MotionVisibilityPublicDocketEntry,
} from './practitioner-filed-motion-visibility-helpers';

const BRIEF_IN_SUPPORT_EVENT_CODE = 'BRF';
const MEMORANDA_IN_SUPPORT_EVENT_CODE = 'MISP';

export function getMotionForLeaveEntriesFromDocketEntries(
  docketEntries: PublicDocketEntry[],
): MotionForLeaveDocketEntries {
  const motionForLeaveDocketEntry = docketEntries.find(
    entry => entry.eventCode === MOTION_FOR_LEAVE_EVENT_CODE,
  );

  if (!motionForLeaveDocketEntry) {
    throw new Error('Motion for leave docket entry was not found');
  }

  const lodgedSecondaryDocketEntry = docketEntries.find(
    entry =>
      entry.lodged === true &&
      !entry.isPaper &&
      entry.eventCode !== MOTION_FOR_LEAVE_EVENT_CODE,
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

    if (supportingEntry.index < lodgedSecondary.index) {
      primarySupportingEntries.push(supportingEntry);
      return;
    }

    if (supportingEntry.index > lodgedSecondary.index) {
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

    if (isPaper === false && entry.isPaper) {
      return false;
    }

    return true;
  });
};

export function getDocketEntryByEventCodeForCase(
  docketNumber: string,
  eventCode: string,
  isPaper?: boolean,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getDocketEntriesByEventCodeForCase(
    docketNumber,
    eventCode,
    isPaper,
  ).then(entries => {
    if (entries.length === 0) {
      throw new Error(
        `Docket entry with event code ${eventCode} was not found`,
      );
    }

    return entries[0];
  });
}

export function getDocketEntriesByEventCodeForCase(
  docketNumber: string,
  eventCode: string,
  isPaper?: boolean,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry[]> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return filterDocketEntriesByEventCode(
      docketEntries,
      eventCode,
      isPaper,
    ).map(getMotionVisibilityPublicDocketEntry);
  });
}

export function getPaperDocketEntriesForCase(
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry[]> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return docketEntries
      .filter(entry => entry.isPaper)
      .map(getMotionVisibilityPublicDocketEntry);
  });
}
