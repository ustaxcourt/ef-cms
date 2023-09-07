import { Case } from '@shared/business/entities/cases/Case';
import { Practitioner } from '../entities/Practitioner';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { TUserContact } from '@shared/business/useCases/users/generateChangeOfAddress';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { clone } from 'lodash';
import { generateAndServeDocketEntry } from '@shared/business/useCaseHelper/service/createChangeItems';

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
  applicationContext: IApplicationContext;
  docketNumber: string;
  bypassDocketEntry: boolean;
  contactInfo: TUserContact;
  firmName: string;
  updatedEmail?: string;
  updatedName?: string;
  jobId: string;
  user: RawPractitioner;
  requestUserId?: string;
  websocketMessagePrefix: string;
}) => {
  try {
    const newData = contactInfo;

    const userCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    let caseEntity = new Case(userCase, { applicationContext });

    const practitionerName = updatedName || user.name;
    const practitionerObject = caseEntity.privatePractitioners
      .concat(caseEntity.irsPractitioners)
      .find(practitioner => practitioner.userId === user.userId);

    if (!practitionerObject) {
      throw new Error(
        `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${docketNumber}`,
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
        caseEntity,
        newData,
        oldData,
        practitionerName,
        user,
      });
    }

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });
  } catch (error) {
    applicationContext.logger.error(error);
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: `${websocketMessagePrefix}_contact_update_progress`,
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

      await applicationContext.getPersistenceGateway().updateUser({
        applicationContext,
        user: userEntity.validate().toRawObject(),
      });
    }

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: `${websocketMessagePrefix}_contact_full_update_complete`,
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
  caseEntity,
  newData,
  oldData,
  practitionerName,
  user,
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
  const { changeOfAddressDocketEntry } = await generateAndServeDocketEntry({
    applicationContext,
    barNumber: user.barNumber,
    caseEntity,
    docketMeta,
    documentType,
    newData,
    oldData,
    servedParties,
    user,
  });

  caseEntity.updateDocketEntry(changeOfAddressDocketEntry);
};
