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
  return getDocketEntriesForCase(docketNumber).then(docketEntries => {
    return filterDocketEntriesByEventCode(
      docketEntries,
      eventCode,
      isPaper,
    ).map(getMotionVisibilityPublicDocketEntry);
  });
}

export function getPaperDocketEntriesForCase(
  _docketNumber: string,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry[]> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  cy.reload();
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
  return getDocketEntriesForCase(docketNumber).then(
    getMotionForLeaveEntriesFromDocketEntries,
  );
}

export function getBriefInSupportEntryForCase(
  docketNumber: string,
  attemptsRemaining: number = 5,
): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  return getDocketEntriesForCase(docketNumber).then(docketEntries => {
    const hasBriefInSupport = docketEntries.some(
      entry => entry.eventCode === BRIEF_IN_SUPPORT_EVENT_CODE,
    );

    if (!hasBriefInSupport && attemptsRemaining > 1) {
      return getBriefInSupportEntryForCase(docketNumber, attemptsRemaining - 1);
    }

    return cy.wrap(
      getDocketEntryByEventCode(docketEntries, BRIEF_IN_SUPPORT_EVENT_CODE),
    );
  });
}

export function getPaperMotionDocketEntryForCase(): Cypress.Chainable<MotionVisibilityPublicDocketEntry> {
  cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');
  cy.reload();
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
  return getDocketEntriesForCase(docketNumber).then(docketEntries => {
    const motionEntry = docketEntries.find(
      entry => entry.eventCode === motionEventCode && !entry.isPaper,
    );

    if (!motionEntry) {
      throw new Error(`Motion ${motionEventCode} was not found`);
    }

    const motion = getMotionVisibilityPublicDocketEntry(motionEntry);

    const supportingEntries = docketEntries
      .filter(
        entry =>
          entry.eventCode === BRIEF_IN_SUPPORT_EVENT_CODE ||
          entry.eventCode === MEMORANDA_IN_SUPPORT_EVENT_CODE,
      )
      .map(getMotionVisibilityPublicDocketEntry)
      .filter(entry => entry.index > motion.index)
      .sort((a, b) => a.index - b.index);

    return { motion, supportingEntries };
  });
}
