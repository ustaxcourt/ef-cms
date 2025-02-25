import {
  baseAliases,
  getIndexNameFromAlias,
} from '../../../../elasticsearch/elasticsearch-aliases';
import { Search_Request } from '@opensearch-project/opensearch/api';

export const updateIndex = ({
  searchParameters,
}: {
  searchParameters: Search_Request;
}) => {
  if (
    searchParameters.index &&
    typeof searchParameters.index === 'string' &&
    baseAliases.map(a => a.alias).includes(searchParameters.index)
  ) {
    searchParameters.index = getIndexNameFromAlias(searchParameters.index);
  }
};
