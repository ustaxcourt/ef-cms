import { ConsolidatedCaseDTO } from '@shared/business/dto/cases/ConsolidatedCaseDTO';
import {
  aggregateCaseItems,
  isCaseItem,
  isIrsPractitionerItem,
  isPrivatePractitionerItem,
} from '../helpers/aggregateCaseItems';
import { queryFull } from '../../dynamodbClientService';

/**
 * getCaseByDocketNumber
 * gets the full case when contents are under 400 kb
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) => {
  const caseItems = await queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const leadDocketNumber = caseItems.find(caseItem => isCaseItem(caseItem))
    ?.leadDocketNumber;
  let consolidatedCases;
  if (leadDocketNumber) {
    const consolidatedCaseItems = await queryFull({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `case|${leadDocketNumber}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });

    consolidatedCases = aggregateConsolidatedCases(consolidatedCaseItems);
  }

  return { ...aggregateCaseItems(caseItems), consolidatedCases } as RawCase;
};

const aggregateConsolidatedCases = (
  consolidatedCaseItems: any[],
): ConsolidatedCaseDTO[] => {
  const consolidatedCases = consolidatedCaseItems.filter(item =>
    isCaseItem(item),
  );

  consolidatedCaseItems.forEach(item => {
    if (isIrsPractitionerItem(item)) {
      const caseWithPractitioner = consolidatedCases.find(aCase => {
        return item.pk === aCase.pk;
      });
      if (!caseWithPractitioner.irsPractitioners) {
        caseWithPractitioner.irsPractitioners = [item];
      } else {
        caseWithPractitioner.irsPractitioners.push(item);
      }
    }

    if (isPrivatePractitionerItem(item)) {
      const caseWithPractitioner = consolidatedCases.find(aCase => {
        return item.pk === aCase.pk;
      });
      if (!caseWithPractitioner.privatePractitioners) {
        caseWithPractitioner.privatePractitioners = [item];
      } else {
        caseWithPractitioner.privatePractitioners.push(item);
      }
    }
  });
  return consolidatedCases.map(aCase => new ConsolidatedCaseDTO(aCase));
};
