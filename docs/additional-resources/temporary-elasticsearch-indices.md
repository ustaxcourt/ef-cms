# Temporary OpenSearch Indices

Sometimes we need to query against information that isn't indexed in OpenSearch. Follow these instructions to create one or more temporary OpenSearch indices on a deployed environment with mappings you have defined locally.

### Creating Temporary OpenSearch Indices on Deployed Environments from Locally-Defined Mappings

  1. Modify the [mappings](../../web-api/elasticsearch) file(s) locally to include the desired mappings.
  1. Use the [environment switcher](./environment-switcher.md) to switch to the desired deployed environment:
     ```bash
     . scripts/env/set-env.zsh myenv
     ```
  1. Run the `create-temporary-indices` script to create the new index (or indices, if you modified multiple mappings) from the locally-defined mappings:
     ```bash
     npx ts-node --transpile-only scripts/elasticsearch/create-temporary-indices.ts
     ```
  1. You can now query against your temporary index (or indices) by utilizing [searchClient](../../web-api/src/persistence/elasticsearch/searchClient.ts)'s `search` or `searchAll`:
     ```typescript
     import { createApplicationContext } from '@web-api/applicationContext';
     import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

     // eslint-disable-next-line @typescript-eslint/no-floating-promises
     (async () => {
       const applicationContext = createApplicationContext({});
       const { results }: { results: RawDocketEntry[] } = await searchAll({
         applicationContext,
         searchParameters: {
           body: { query: {} },
           index: 'efcms-docket-entry',
         },
       });
       console.log('Docket Number,Index,Document Title');
       results.map(de => { console.log(`"${de.docketNumber}","${de.index}","${de.documentTitle}"`); });
     })();
     ```
     The `searchClient` will automatically transform the index name from the provided alias (`efcms-docket-entry` in this example) to the newly-created index based on the hash of your locally-defined mappings.

### Removing Temporary OpenSearch Indices from Deployed Environments

  1. Restore all [mappings](../../web-api/elasticsearch) files to an unmodified state.
  1. Use the [environment switcher](./environment-switcher.md) to switch to the desired deployed environment:
     ```bash
     . scripts/env/set-env.zsh myenv
     ```
  1. Run the `delete-unaliased-elasticsearch-indices` script to delete your temporary indices:
     ```bash
     ./web-api/delete-unaliased-elasticsearch-indices.sh $ENV
     ```
