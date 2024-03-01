# Temporary OpenSearch Indices

Sometimes we need to query against information that isn't indexed in OpenSearch. Follow these instructions to create one or more temporary OpenSearch indices on a deployed environment with mappings you have defined locally.

### Creating Temporary OpenSearch Indices on Deployed Environments from Locally-Defined Mappings

  1. Modify the [mappings](../../web-api/elasticsearch) file(s) locally to include the desired mappings.
  1. Use the [environment switcher](./environment-switcher.md) to switch to the desired deployed environment:
     ```bash
     . scripts/env/set-env.zsh myenv
     ```
  1. Run the `create-temporary-indices` script to create indices from the locally-defined mappings:
     ```bash
     npx ts-node --transpile-only scripts/elasticsearch/create-temporary-indices.ts
     ```
  1. You can now query against your temporary index (or indices, if you modified multiple mappings) by writing a new script that utilizes [searchClient](../../web-api/src/persistence/elasticsearch/searchClient.ts)'s `search` or `searchAll`.

### Removing Temporary OpenSearch Indices from Deployed Environments

  1. Use the [environment switcher](./environment-switcher.md) to switch to the desired deployed environment:
     ```bash
     . scripts/env/set-env.zsh myenv
     ```
  1. Run the `delete-unaliased-elasticsearch-indices` script to delete your temporary indices:
     ```bash
     ./web-api/delete-unaliased-elasticsearch-indices.sh $ENV
     ```
