import { loginAsPetitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  MotionVisibilityDocketEntries,
  UNAUTHORIZED_PETITIONER_EMAIL,
  createPrivatePractitionerCaseWithFiledMotion,
  restoreMotionVisibilityPolicyFlag,
  setOriginalMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToTomorrow,
  setMotionVisibilityPolicyDateToYesterday,
  verifyDocumentCanBeViewed,
  verifyDocumentCanBeViewedPublic,
  verifyDocumentCannotBeViewedPublic,
  verifyMotionNotViewableOnPublicSite,
  verifyMotionViewableOnPublicSite,
} from '../../../../helpers/documentVisibility/practitioner-filed-motion-visibility-helpers';

describe('Practitioner-filed motion visibility smoke', () => {
  let caseDocketNumber: string;
  let motionEntries: MotionVisibilityDocketEntries;

  before(() => {
    createPrivatePractitionerCaseWithFiledMotion().then(
      ({ docketNumber, entries }) => {
        caseDocketNumber = docketNumber;
        motionEntries = entries;
      },
    );
  });

  beforeEach(() => {
    setOriginalMotionVisibilityPolicyFlag();
    setMotionVisibilityPolicyDateToYesterday();
  });

  afterEach(() => {
    restoreMotionVisibilityPolicyFlag();
  });

  it('should let public and unassociated petitioner download practitioner motion brief and memorandum in support after policy change date', () => {
    verifyMotionViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    verifyDocumentCanBeViewedPublic(
      caseDocketNumber,
      motionEntries.briefInSupport.index,
      motionEntries.briefInSupport.docketEntryId,
    );
    verifyDocumentCanBeViewedPublic(
      caseDocketNumber,
      motionEntries.memorandaInSupport.index,
      motionEntries.memorandaInSupport.docketEntryId,
    );

    loginAsPetitioner(UNAUTHORIZED_PETITIONER_EMAIL);
    goToCase(caseDocketNumber);
    verifyDocumentCanBeViewed(motionEntries.motion.docketEntryId);
    verifyDocumentCanBeViewed(motionEntries.briefInSupport.docketEntryId);
    verifyDocumentCanBeViewed(motionEntries.memorandaInSupport.docketEntryId);
  });

  it('should not let public download practitioner motion brief or memorandum in support before policy change date', () => {
    setMotionVisibilityPolicyDateToTomorrow();

    verifyMotionNotViewableOnPublicSite(caseDocketNumber, motionEntries.motion);
    verifyDocumentCannotBeViewedPublic(
      caseDocketNumber,
      motionEntries.briefInSupport.index,
      motionEntries.briefInSupport.docketEntryId,
    );
    verifyDocumentCannotBeViewedPublic(
      caseDocketNumber,
      motionEntries.memorandaInSupport.index,
      motionEntries.memorandaInSupport.docketEntryId,
    );
  });
});
