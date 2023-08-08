import { CaseDeadline } from '../../../../../../shared/src/business/entities/CaseDeadline';
import { aggregateCaseItems } from '../../../../../src/persistence/dynamo/helpers/aggregateCaseItems';
import { createApplicationContext } from '../../../../../src/applicationContext';
import { queryFullCase } from '../utilities/queryFullCase';

const applicationContext = createApplicationContext({});

const isCaseDeadlineItem = item => {
  return (
    item.pk.startsWith('case-deadline|') && item.sk.startsWith('case-deadline|')
  );
};

export const migrateItems = async (items, documentClient) => {
  const itemsAfter: RawCaseDeadline[] = [];

  for (const item of items) {
    if (isCaseDeadlineItem(item)) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);
      const caseRecord = aggregateCaseItems(fullCase);

      const theCaseDeadline = new CaseDeadline(
        {
          ...item,
          leadDocketNumber: caseRecord.leadDocketNumber,
        },
        {
          applicationContext,
        },
      ).validateWithLogging(applicationContext);

      item.leadDocketNumber = theCaseDeadline.leadDocketNumber;
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
