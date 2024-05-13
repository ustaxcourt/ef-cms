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

const getNextPageOfIdsOfDocketEntriesMissingIsFileAttached = async ({
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
  const { results } = await search({ applicationContext, searchParameters }); // searchAll({ applicationContext, searchParameters });
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
    body: {
      query,
    },
    index: efcmsDocketEntryIndex,
  });
  const expected = get(total, 'body.count', 0);
  console.log(
    `found ${expected} docket entries missing the isFileAttached flag`,
  );
  let processed = 0;
  const gottaFix: {
    docketEntryId: string;
    docketNumber: string;
    isFileAttached: boolean;
  }[] = [];
  let search_after = [''];
  for (let i = 0; i < 5; i++) {
    //while (processed < expected) {
    const docketEntries =
      await getNextPageOfIdsOfDocketEntriesMissingIsFileAttached({
        applicationContext,
        search_after,
      });
    search_after = [docketEntries[docketEntries.length - 1].docketEntryId];
    console.log(`found ${docketEntries.length} in page ${i + 1}`);
    console.log(`next page will start after ${search_after[0]}`);
    processed += docketEntries.length;
    await Promise.all(
      docketEntries.map(async docketEntry => {
        let isFileAttached = false;
        try {
          await fileExistsInS3({
            Bucket: applicationContext.environment.documentsBucketName,
            Key: docketEntry.docketEntryId,
          });
          isFileAttached = true;
        } catch (err: any) {
          // do nothing
        }
        if (isFileAttached) {
          gottaFix.push({ ...docketEntry, isFileAttached });
        }
      }),
    );
    // TODO: batch the dynamo put reqs
    console.log(
      `found ${gottaFix.length} docket entries so far (page ${i + 1})`,
    );
  }
  console.log(`checked ${processed} docket entries`);
  console.log(`found ${gottaFix.length} docket entries to modify`);
  console.log('fix these: ', gottaFix);
})();
