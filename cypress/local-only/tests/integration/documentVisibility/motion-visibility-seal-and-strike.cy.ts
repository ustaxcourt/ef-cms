import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import {
  calculateISODate,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  MotionVisibilityDocketEntries,
  UNAUTHORIZED_PETITIONER_EMAIL,
  createPrivatePractitionerCaseWithFiledMotion,
  sealDocketEntryAtIndex,
  verifyDocumentCanBeViewed,
  verifyDocumentCannotBeViewed,
  verifyDocumentCannotBeViewedPublic,
  verifyPublicSealedEntryShowsLockWithoutLink,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Motion visibility — seal to public and parties', () => {
  beforeEach(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    }).as('ORIGINAL_FEATURE_FLAG_VALUE');

    const yesterday = formatDateString(
      calculateISODate({ howMuch: -1, units: 'days' }),
      'yyyy-MM-dd',
    );

    cy.task('toggleFeatureFlag', {
      flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
      flagValue: yesterday,
    });
  });

  afterEach(function () {
    cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(ORIGINAL_FEATURE_FLAG_VALUE => {
      cy.task('toggleFeatureFlag', {
        flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
        flagValue: ORIGINAL_FEATURE_FLAG_VALUE,
      });
    });
  });

  describe('Practitioner-filed motion sealed to the public', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    afterEach(() => {
      cy.task('setAllowedTerminalIpAddresses', []);
    });

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          sealDocketEntryAtIndex(entries.motion.index, 'public');
        },
      );
    });

    it('should show lock icon and no public link for motion sealed to the public', () => {
      verifyPublicSealedEntryShowsLockWithoutLink(
        caseDocketNumber,
        motionEntries.motion.index,
      );
    });

    it('should let filer open motion sealed to the public', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
    });

    it('should not let terminal user open motion sealed to the public on public site', () => {
      cy.task('setAllowedTerminalIpAddresses', ['localhost']).then(() => {
        verifyDocumentCannotBeViewedPublic(
          caseDocketNumber,
          motionEntries.motion.index,
        );
      });
    });

    it('should not let unassociated petitioner open motion sealed to the public', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });
  });

  describe('Practitioner-filed motion sealed to the public and parties', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          loginAsDocketClerk1();
          goToCase(docketNumber);
          sealDocketEntryAtIndex(entries.motion.index, 'external');
        },
      );
    });

    it('should show lock icon and no public link for motion sealed to the public and parties', () => {
      verifyPublicSealedEntryShowsLockWithoutLink(
        caseDocketNumber,
        motionEntries.motion.index,
      );
    });

    it('should not let filer open motion sealed to the public and parties', () => {
      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });

    it('should not let unassociated petitioner open motion sealed to the public and parties', () => {
      loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
      goToCase(caseDocketNumber);
      verifyDocumentCannotBeViewed(
        caseDocketNumber,
        motionEntries.motion.docketEntryId,
      );
    });
  });
});
