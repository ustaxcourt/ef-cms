import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TUserContact } from '@web-api/business/useCases/user/generateChangeOfAddress';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { clone } from 'lodash';
import { generateAndServeDocketEntry } from '@web-api/business/useCaseHelper/service/createChangeItems';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateUser } from '@web-api/persistence/postgres/users/updateUser';
import { updatePractitioner } from '@web-api/persistence/postgres/practitioners/updatePractitioner';
import { settlePromises } from '@web-api/utilities/settlePromises';

/**
 * generateChangeOfAddressHelper
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.deadlineDate the date of the deadline to generated
 * @param {string} providers.description the description of the deadline
 * @param {Case} providers.subjectCaseEntity the subjectCaseEntity
 */
export const generateChangeOfAddressHelper = async ({
  applicationContext,
  authorizedUser,
  bypassDocketEntry,
  contactInfo,
  docketNumber,
  firmName,
  jobId,
  requestUserId,
  updatedEmail,
  updatedName,
  user,
  websocketMessagePrefix,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  docketNumber: string;
  bypassDocketEntry: boolean;
  contactInfo: TUserContact;
  firmName: string;
  updatedEmail?: string;
  updatedName?: string;
  jobId: string;
  user: RawPractitioner;
  requestUserId?: string;
  websocketMessagePrefix: 'user' | 'admin';
}) => {
  try {
    const newData = contactInfo;

    const userCase = await getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
    const caseEntity = new Case(userCase, {
      authorizedUser,
    });

    const practitionerName = updatedName || user.name;
    const practitionerObject = (caseEntity.privatePractitioners || [])
      .concat(caseEntity.irsPractitioners)
      .find(practitioner => practitioner.userId === user.userId);

    if (!practitionerObject) {
      throw new Error(
        `Could not find user: ${user.userId} barNumber: ${user.barNumber} on ${docketNumber}`,
      );
    }

    const oldData = clone(practitionerObject.contact);

    // This updates the case by reference!
    practitionerObject.contact = contactInfo;
    practitionerObject.firmName = firmName;
    practitionerObject.name = practitionerName;

    if (!oldData.email && updatedEmail) {
      practitionerObject.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      practitionerObject.email = updatedEmail;
    }

    if (!bypassDocketEntry && caseEntity.shouldGenerateNoticesForCase()) {
      await prepareToGenerateAndServeDocketEntry({
        applicationContext,
        authorizedUser,
        caseEntity,
        newData,
        oldData,
        practitionerName,
        user,
      });
    }

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });
  } catch (error) {
    applicationContext.logger.error(error);
  }

  const NOTIFICATION_ACTION:
    | 'user_contact_update_progress'
    | 'admin_contact_update_progress' =
    `${websocketMessagePrefix}_contact_update_progress`;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: NOTIFICATION_ACTION,
    },
    userId: requestUserId || user.userId,
  });

  const updatedJob = await applicationContext
    .getPersistenceGateway()
    .setChangeOfAddressCaseAsDone({ applicationContext, docketNumber, jobId });

  const isDoneProcessing = updatedJob.remaining === 0;

  if (isDoneProcessing) {
    applicationContext.logger.info(
      `"change-of-address-job|${jobId}" job finished`,
    );

    if (websocketMessagePrefix === 'user') {
      const userEntity = new Practitioner({
        ...user,
        isUpdatingInformation: false,
      });

      const rawUserEntity = userEntity.validate().toRawObject();

      await settlePromises([
        updatePractitioner({ practitionerToUpdate: rawUserEntity }),
        updateUser({ userToUpdate: rawUserEntity }),
      ]);
    }

    const CONTACT_UPDATE_COMPLETE_ACTION:
      | 'user_contact_full_update_complete'
      | 'admin_contact_full_update_complete' =
      `${websocketMessagePrefix}_contact_full_update_complete`;

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: CONTACT_UPDATE_COMPLETE_ACTION,
        user,
      },
      userId: requestUserId || user.userId,
    });
  }
};

/**
 * This function prepares data to be passed to generateAndServeDocketEntry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the instantiated Case class
 * @param {object} providers.newData the new practitioner contact information
 * @param {object} providers.oldData the old practitioner contact information (for comparison)
 * @param {object} providers.practitionerName the name of the practitioner
 * @param {object} providers.user the user object that includes userId, barNumber etc.
 * @returns {Promise<*>} resolves upon completion of docket entry service
 */
const prepareToGenerateAndServeDocketEntry = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  newData,
  oldData,
  practitionerName,
  user,
}: {
  applicationContext: any;
  caseEntity: any;
  newData: any;
  oldData: any;
  practitionerName: any;
  user: any;
  authorizedUser: AuthUser;
}) => {
  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData,
      oldData,
    });

  if (!documentType) return;

  const servedParties = aggregatePartiesForService(caseEntity);

  const docketMeta = {} as any;
  if (user.role === ROLES.privatePractitioner) {
    docketMeta.privatePractitioners = [
      {
        name: practitionerName,
      },
    ];
  } else if (user.role === ROLES.irsPractitioner) {
    docketMeta.partyIrsPractitioner = true;
  }

  newData.name = practitionerName;
  await generateAndServeDocketEntry({
    applicationContext,
    authorizedUser,
    caseEntity,
    docketMeta,
    documentType,
    newData,
    oldData,
    privatePractitionersRepresentingContact: undefined,
    servedParties,
    user,
  });
};
