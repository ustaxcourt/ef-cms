import { Search } from '@opensearch-project/opensearch/api/requestParams';
import { SearchAllParametersType } from '@web-api/persistence/elasticsearch/searchClient';
import {
  baseAliases,
  getIndexNameFromAlias,
} from '../../../../elasticsearch/elasticsearch-aliases';

export const updateIndex = ({
  searchParameters,
}: {
  searchParameters: Search | SearchAllParametersType;
}) => {
  if (
    searchParameters.index &&
    typeof searchParameters.index === 'string' &&
    baseAliases.map(a => a.alias).includes(searchParameters.index)
  ) {
    searchParameters.index = getIndexNameFromAlias(searchParameters.index);
  }
};
