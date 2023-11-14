import { cloneDeep } from 'lodash';
import { createHash } from 'crypto';
import { efcmsCaseMappings } from '../../web-api/elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryMappings } from '../../web-api/elasticsearch/efcms-docket-entry-mappings';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import {
  esAliasType,
  getBaseAliasFromIndexName,
} from '../../web-api/elasticsearch/elasticsearch-aliases';

export const mockDifferentExistingMappings = (): {
  existingAliases: esAliasType[];
  existingCaseIndexName: string;
  existingDocketEntryIndexName: string;
  newCaseIndexName: string;
  newDocketEntryIndexName: string;
} => {
  const existingCaseMappings = cloneDeep(efcmsCaseMappings);
  existingCaseMappings.properties['petitioners.L.M.name.S'].type = 'keyword';
  const existingCaseMappingsHash: string = createHash('md5')
    .update(JSON.stringify(existingCaseMappings), 'utf-8')
    .digest('hex');
  const existingCaseIndexName = `efcms-case-${existingCaseMappingsHash}`;
  const newCaseIndexName = elasticsearchIndexes.find(index => {
    return index.includes('efcms-case') && !index.includes('deadline');
  })!;

  const existingDocketEntryMappings = cloneDeep(efcmsDocketEntryMappings);
  existingDocketEntryMappings.properties['signedJudgeName.S'].type = 'keyword';
  const existingDocketEntryMappingsHash: string = createHash('md5')
    .update(JSON.stringify(existingDocketEntryMappings), 'utf-8')
    .digest('hex');
  const existingDocketEntryIndexName = `efcms-docket-entry-${existingDocketEntryMappingsHash}`;
  const newDocketEntryIndexName = elasticsearchIndexes.find(index =>
    index.includes('efcms-docket-entry'),
  )!;

  const existingAliases = elasticsearchIndexes.map(index => {
    if (index.includes('efcms-case') && !index.includes('deadline')) {
      return {
        alias: 'efcms-case',
        index: existingCaseIndexName,
      };
    } else if (index.includes('efcms-docket-entry')) {
      return {
        alias: 'efcms-docket-entry',
        index: existingDocketEntryIndexName,
      };
    } else {
      return {
        alias: getBaseAliasFromIndexName(index),
        index,
      };
    }
  });

  return {
    existingAliases,
    existingCaseIndexName,
    existingDocketEntryIndexName,
    newCaseIndexName,
    newDocketEntryIndexName,
  };
};
