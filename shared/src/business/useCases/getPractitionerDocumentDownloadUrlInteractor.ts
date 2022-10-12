import { Case } from '../entities/cases/Case';
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} from '../entities/EntityConstants';
import { NotFoundError, UnauthorizedError } from '../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { User } from '../entities/User';
import { documentMeetsAgeRequirements } from '../utilities/getFormattedCaseDetail';
import { isServed } from '../entities/DocketEntry';

const UNAUTHORIZED_DOCUMENT_MESSAGE =
  'Unauthorized to view document at this time.';

const handleInternalUser = ({
  docketEntryEntity,
  isPetitionsClerk,
  petitionDocketEntry,
}) => {
  const selectedIsStin =
    docketEntryEntity &&
    docketEntryEntity.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType;

  if (isPetitionsClerk) {
    if (selectedIsStin && petitionDocketEntry && petitionDocketEntry.servedAt) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time.',
      );
    }
  } else {
    if (selectedIsStin) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time.',
      );
    }
  }
};

const handleIrsSuperUser = ({
  docketEntryEntity,
  key,
  petitionDocketEntry,
}) => {
  if (petitionDocketEntry && !isServed(petitionDocketEntry)) {
    throw new UnauthorizedError(
      'Unauthorized to view case documents until the petition has been served.',
    );
  }

  if (!docketEntryEntity) {
    throw new NotFoundError(`Docket entry ${key} was not found.`);
  }
  if (!docketEntryEntity.isFileAttached) {
    throw new NotFoundError(
      `Docket entry ${key} does not have an attached file.`,
    );
  }
};

const handleCourtIssued = ({ docketEntryEntity, userAssociatedWithCase }) => {
  const isUnservable = UNSERVABLE_EVENT_CODES.includes(
    docketEntryEntity.eventCode,
  );

  if (!isServed(docketEntryEntity) && !isUnservable) {
    throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
  } else if (
    docketEntryEntity.eventCode === STIPULATED_DECISION_EVENT_CODE &&
    !userAssociatedWithCase
  ) {
    throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
  } else if (docketEntryEntity.isStricken) {
    throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
  } else if (docketEntryEntity.isSealed) {
    if (
      docketEntryEntity.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC &&
      !userAssociatedWithCase
    ) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    } else if (
      docketEntryEntity.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
    ) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    }
  }
};

const getUserRoles = user => {
  return {
    isInternalUser: User.isInternalUser(user.role),
    isIrsSuperuser: user.role === ROLES.irsSuperuser,
    isPetitionsClerk: user.role === ROLES.petitionsClerk,
  };
};

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.barNumber the bar number of the practitioner
 * @param {string} providers.documentId the key of the document
 * @returns {Array<string>} the filing type options based on user role
 */
export const getPractitionerDocumentDownloadUrlInteractor = async (
  applicationContext: IApplicationContext,
  { documentId }: { documentId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key: documentId,
  });
};
