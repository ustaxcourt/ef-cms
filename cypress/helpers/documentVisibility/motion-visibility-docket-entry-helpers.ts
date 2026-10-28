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

    return !(isPaper === false && entry.isPaper);
  });
};

const getDocketEntryByEventCode = (
  docketEntries: PublicDocketEntry[],
  eventCode: string,
): MotionVisibilityPublicDocketEntry => {
  const docketEntry = docketEntries.find(
    entry => entry.eventCode === eventCode,
  );

  if (!docketEntry) {
    throw new Error(`Docket entry with event code ${eventCode} was not found`);
  }

  expect(docketEntry.docketEntryId).to.be.a('string');
  expect(docketEntry.index).to.be.a('number');

  return getMotionVisibilityPublicDocketEntry(docketEntry);
};

const getPaperMotionDocketEntry = (
  docketEntries: PublicDocketEntry[],
): MotionVisibilityPublicDocketEntry => {
  const docketEntry = docketEntries.find(
    entry =>
      entry.eventCode === MOTION_FOR_CONTINUANCE_EVENT_CODE && entry.isPaper,
  );

  if (!docketEntry) {
    throw new Error('Paper motion docket entry was not found');
  }

  return getMotionVisibilityPublicDocketEntry(docketEntry);
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

export function getEFiledMotionEntryForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getDocketEntryByEventCodeForCase(docketNumber, motionEventCode, false);
}

export function getEFiledMotionOnCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getEFiledMotionEntryForCase(docketNumber, motionEventCode);
}

export function getMotionVisibilityDocketEntriesForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<MotionVisibilityDocketEntries> {
  return getEFiledMotionOnCase(docketNumber, motionEventCode).then(motion =>
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
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getMotionForLeaveEntriesFromDocketEntries(docketEntries);
  });
}

export function getBriefInSupportEntryForCase(
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getDocketEntryByEventCode(
      docketEntries,
      BRIEF_IN_SUPPORT_EVENT_CODE,
    );
  });
}

export function getPaperMotionDocketEntryForCase(
  docketNumber: string,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries: PublicDocketEntry[] = response?.body.docketEntries;
    return getPaperMotionDocketEntry(docketEntries);
  });
}

export function getMotionAndSupportingEntriesForCase(
  docketNumber: string,
  motionEventCode: string = MOTION_FOR_CONTINUANCE_EVENT_CODE,
): Cypress.Chainable<{
  motion: MotionVisibilityPublicDocketEntry;
  supportingEntries: MotionVisibilityPublicDocketEntry[];
}> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  goToCase(docketNumber);
  return cy.wait('@getDocketEntries').then(({ response }) => {
    const docketEntries = response?.body.docketEntries;
    const motionEntry = docketEntries.find(
      (entry: { eventCode: string; isPaper?: boolean }) =>
        entry.eventCode === motionEventCode && !entry.isPaper,
    );

    if (!motionEntry) {
      throw new Error(`Motion ${motionEventCode} was not found`);
    }

    const motion: MotionVisibilityPublicDocketEntry = {
      docketEntryId: motionEntry.docketEntryId,
      index: motionEntry.index,
      eventCode: motionEntry.eventCode,
    };

    const supportingEntries = docketEntries
      .filter(
        (entry: { eventCode: string; index: number }) =>
          (entry.eventCode === BRIEF_IN_SUPPORT_EVENT_CODE ||
            entry.eventCode === MEMORANDA_IN_SUPPORT_EVENT_CODE) &&
          entry.index > motion.index,
      )
      .map(
        (entry: {
          docketEntryId: string;
          index: number;
          eventCode: string;
        }) => ({
          docketEntryId: entry.docketEntryId,
          index: entry.index,
          eventCode: entry.eventCode,
        }),
      )
      .sort(
        (
          a: MotionVisibilityPublicDocketEntry,
          b: MotionVisibilityPublicDocketEntry,
        ) => a.index - b.index,
      );

    return { motion, supportingEntries };
  });
}
