import { Case } from '../entities/cases/Case';
import { CaseDeadline } from '../entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { pick } from 'lodash';

export const getCaseDeadlinesInteractor = async (
  applicationContext: IApplicationContext,
  {
    endDate,
    from,
    judge,
    pageSize,
    startDate,
  }: {
    endDate: string;
    from: number;
    judge: string;
    pageSize: number;
    startDate;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDeadlines, totalCount } = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDateRange({
      applicationContext,
      endDate,
      from,
      judge,
      pageSize,
      startDate,
    });

  const validatedCaseDeadlines = CaseDeadline.validateRawCollection(
    foundDeadlines,
    {
      applicationContext,
    },
  );

  const caseMap = await getCasesByDocketNumbers({
    applicationContext,
    docketNumbers: validatedCaseDeadlines.map(item => item.docketNumber),
  });

  const afterCaseMapping = validatedCaseDeadlines
    .filter(deadline => caseMap[deadline.docketNumber])
    .map(deadline => ({
      ...deadline,
      ...pick(caseMap[deadline.docketNumber], [
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
        'leadDocketNumber',
      ]),
    }));

  return { deadlines: afterCaseMapping, totalCount };
};

const getCasesByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: IApplicationContext;
  docketNumbers: string[];
}) => {
  const caseData = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({
      applicationContext,
      docketNumbers,
    });

  return caseData
    .map(caseRecord => new Case(caseRecord, { applicationContext }))
    .filter(caseEntity => {
      try {
        caseEntity.validate();
        return true;
      } catch (err) {
        applicationContext.logger.error(
          `getCasesByDocketNumber: case ${caseEntity.docketNumber} failed validation`,
          {
            message: caseEntity.getFormattedValidationErrors(),
          },
        );
        return false;
      }
    })
    .reduce((acc, item) => {
      acc[item.docketNumber] = item;
      return acc;
    }, {});
};
