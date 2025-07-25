import { marshall } from '@aws-sdk/util-dynamodb';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { isArray } from 'lodash';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { efcmsDocketEntryIndex } from '../../elasticsearch/efcms-docket-entry-mappings';
import { efcmsCaseIndex } from '../../elasticsearch/efcms-case-mappings';
import { getSearchClient } from '@web-api/persistence/elasticsearch/searchClient/getSearchClient';

export const indexOpenSearchCases = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const docketNumbers: string[] = isArray(message.payload)
    ? message.payload
    : [message.payload];
  const cases = await getCasesByDocketNumbers({
    docketNumbers,
    excludeFields: ['docketEntries', 'correspondence', 'hearings'],
  });
  const caseIndexCommands: any[] = [];
  for (const caseRecord of cases) {
    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    const marshalledCase = marshall(
      transformNullToUndefined({
        ...caseRecord,
        pk: `case|${caseRecord.docketNumber}`,
        sk: `case|${caseRecord.docketNumber}`,
        entityName: 'Case',
      }),
      { removeUndefinedValues: true },
    );

    // The OpenSearch bulk API expects an object for the operation followed by an object for what is to be operated on, e.g., [{doThis}, {someDocument}, {doThat}, {anotherDocument}]

    // Docket Entry Index
    caseIndexCommands.push({
      index: {
        _id: `${marshalledCase.pk.S}_${marshalledCase.sk.S}|mapping`,
        _index: efcmsDocketEntryIndex,
      },
    });

    caseIndexCommands.push({
      ...marshalledCase,
      case_relations: { name: 'case' },
      entityName: { S: 'CaseDocketEntryMapping' },
    });

    // Case Index
    caseIndexCommands.push({
      index: {
        _id: `${marshalledCase.pk.S}_${marshalledCase.sk.S}`,
        _index: efcmsCaseIndex,
      },
    });

    caseIndexCommands.push(marshalledCase);
  }

  await getSearchClient().bulk({
    refresh: false,
    body: caseIndexCommands,
  });
};
