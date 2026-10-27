import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { goToCase } from '../caseDetail/go-to-case';
import {
  getMotionVisibilityPublicDocketEntry,
  MotionVisibilityPublicDocketEntry,
} from './practitioner-filed-motion-visibility-helpers';

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
