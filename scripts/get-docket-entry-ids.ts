import {
  HeadObjectCommand,
  HeadObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Search } from '@opensearch-project/opensearch/api/requestParams';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { efcmsDocketEntryIndex } from '../web-api/elasticsearch/efcms-docket-entry-mappings';
import { get } from 'lodash';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

const s3Client = new S3Client({ region: 'us-east-1' });
const query = {
  bool: {
    must: [
      {
        term: {
          'entityName.S': 'DocketEntry',
        },
      },
    ],
    must_not: [
      {
        exists: {
          field: 'isFileAttached.BOOL',
        },
      },
    ],
  },
};

const getNextPageOfDocketEntriesMissingIsFileAttached = async ({
  applicationContext,
  search_after,
}: {
  applicationContext: ServerApplicationContext;
  search_after: string[];
}): Promise<{ docketEntryId: string; docketNumber: string }[]> => {
  const searchParameters: Search = {
    _source: ['docketEntryId.S', 'docketNumber.S'],
    body: {
      query,
      search_after,
      size: 1000,
      sort: [{ 'docketEntryId.S': 'asc' }],
    },
    index: 'efcms-docket-entry',
  };
  const { results } = await search({ applicationContext, searchParameters });
  return results;
};

const fileExistsInS3 = ({
  Bucket,
  Key,
}: {
  Bucket: string;
  Key: string;
}): Promise<HeadObjectCommandOutput> => {
  return s3Client.send(new HeadObjectCommand({ Bucket, Key }));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const total = await applicationContext.getSearchClient().count({
    body: { query },
    index: efcmsDocketEntryIndex,
  });
  const expected = get(total, 'body.count', 0);
  let processed = 0;
  let search_after = [''];
  while (processed < expected) {
    const docketEntries = await getNextPageOfDocketEntriesMissingIsFileAttached(
      {
        applicationContext,
        search_after,
      },
    );
    search_after = [docketEntries[docketEntries.length - 1]?.docketEntryId];
    processed += docketEntries.length;
    docketEntries.map(de => {
      console.log(de.docketEntryId);
    });
  }
})();
