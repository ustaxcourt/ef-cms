import { loginAsPrivatePractitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  BRIEF_IN_SUPPORT_EVENT_CODE,
  MotionVisibilityDocketEntries,
  createPrivatePractitionerCaseWithFiledMotion,
  qcDocuments,
  restoreMotionVisibilityPolicyFlag,
  sealDocketEntryAtIndex,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToYesterday,
  strikeDocketEntryByEventCode,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
  verifyPublicSealedEntryShowsLockWithoutLink,
  verifyStrickenDocketEntry,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Motion visibility clerk seal and strike actions', () => {
  beforeEach(function () {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(function () {
    restoreMotionVisibilityPolicyFlag();
  });

  describe('Practitioner-filed motion with sealed memorandum and stricken brief', () => {
    let caseDocketNumber: string;
    let motionEntries: MotionVisibilityDocketEntries;

    before(() => {
      createPrivatePractitionerCaseWithFiledMotion().then(
        ({ docketNumber, entries }) => {
          caseDocketNumber = docketNumber;
          motionEntries = entries;
          qcDocuments(docketNumber, 3);
          goToCase(docketNumber);
          sealDocketEntryAtIndex(entries.memorandaInSupport.index, 'public');
          strikeDocketEntryByEventCode(BRIEF_IN_SUPPORT_EVENT_CODE);
          goToCase(docketNumber);
          verifyStrickenDocketEntry(entries.briefInSupport.docketEntryId);
        },
      );
    });

    it('should keep motion public while sealed memorandum and stricken brief are not public', () => {
      verifyDocumentCanBeViewedPublic(
        caseDocketNumber,
        motionEntries.motion.index,
        motionEntries.motion.docketEntryId,
      );
      verifyPublicSealedEntryShowsLockWithoutLink(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
      );
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.memorandaInSupport.index,
        motionEntries.memorandaInSupport.docketEntryId,
      );
      verifyDocumentCannotBeViewedPublic(
        caseDocketNumber,
        motionEntries.briefInSupport.index,
        motionEntries.briefInSupport.docketEntryId,
      );

      loginAsPrivatePractitioner();
      goToCase(caseDocketNumber);
      verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
      verifyDocumentCanBeViewed(motionEntries.memorandaInSupport.docketEntryId);
    });
  });
});
