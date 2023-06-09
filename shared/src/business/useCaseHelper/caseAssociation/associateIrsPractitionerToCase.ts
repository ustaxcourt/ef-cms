import { Case } from '../../entities/cases/Case';
import { IrsPractitioner } from '../../entities/IrsPractitioner';
import { UserCase } from '../../entities/UserCase';

/**
 * associateIrsPractitionerToCase
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.serviceIndicator the type of service the irsPractitioner should receive
 * @param {object} providers.user the user object for the logged in user
 * @returns {Promise<*>} the updated case entity
 */
export const associateIrsPractitionerToCase = async ({
  applicationContext,
  consolidatedCasesDocketNumbers = [],
  docketNumber,
  serviceIndicator,
  user,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  consolidatedCasesDocketNumbers: string[] | undefined;
  serviceIndicator?: string;
  user: RawUser;
}) => {
  let docketNumbersToAssociate: string[] = [];

  if (consolidatedCasesDocketNumbers.length > 0) {
    docketNumbersToAssociate = [...consolidatedCasesDocketNumbers];
  } else {
    docketNumbersToAssociate.push(docketNumber);
  }

  await Promise.all(
    docketNumbersToAssociate.map(async caseDocketNumber => {
      const isAssociated = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber: caseDocketNumber,
          userId: user.userId,
        });

      if (!isAssociated) {
        const caseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: caseDocketNumber,
          });

        const userCaseEntity = new UserCase(caseToUpdate);

        await applicationContext.getPersistenceGateway().associateUserWithCase({
          applicationContext,
          docketNumber: caseDocketNumber,
          userCase: userCaseEntity.validate().toRawObject(),
          userId: user.userId,
        });

        const caseEntity = new Case(caseToUpdate, { applicationContext });

        caseEntity.attachIrsPractitioner(
          new IrsPractitioner({ ...user, serviceIndicator }),
        );

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });
      }
    }),
  );
};
