import {
  baseAliases,
  getBaseAliasFromIndexName,
} from '../../../web-api/elasticsearch/elasticsearch-aliases';
import { getClient } from '../../../web-api/elasticsearch/client';

export const getClusterStats = async ({
  environmentName,
  version,
}: {
  environmentName: string;
  version: string;
}): Promise<{
  counts: { [key: string]: number };
  info: { [key: string]: any };
}> => {
  const esClient = await getClient({ environmentName, version });
  const apiResponse = await esClient.indices.stats({
    index: '_all',
    level: 'indices',
  });

  const counts = {};
  const info = {};
  for (const indexName in apiResponse.body?.indices) {
    const baseAlias =
      baseAliases.map(a => a.alias).includes(indexName) ||
      !indexName.includes('-')
        ? indexName
        : getBaseAliasFromIndexName(indexName);

    info[baseAlias] = apiResponse.body.indices[indexName];

    const res = await esClient.count({
      index: indexName,
    });
    counts[baseAlias] = Number(res.body?.count || 0);
  }

  return { counts, info };
};

export const isMigratedClusterFinishedIndexing = async ({
  environmentName,
}: {
  environmentName: string;
}): Promise<boolean> => {
  const destinationVersion = process.env.DESTINATION_TABLE!.split('-').pop();
  const currentVersion = destinationVersion === 'alpha' ? 'beta' : 'alpha';

  let diffTotal = 0;
  const { counts: currentCounts } = await getClusterStats({
    environmentName,
    version: currentVersion,
  });
  let { counts: destinationCounts, info: destinationInfo } =
    await getClusterStats({
      environmentName,
      version: destinationVersion!,
    });

  for (const indexName of ['efcms-case', 'efcms-docket-entry', 'efcms-user']) {
    const countCurrent = currentCounts[indexName];
    const countDestination = destinationCounts[indexName];

    const diff = Math.abs(countCurrent - countDestination);
    diffTotal += diff;
    console.log(`${indexName} has a diff of ${diff}`);
  }

  if (diffTotal > 0) {
    console.log('Indexes are not in sync, returning false');
    return false;
  }

  for (const indexName of [
    'efcms-case-deadline',
    'efcms-message',
    'efcms-work-item',
  ]) {
    const operationsDestination = Number(
      destinationInfo[indexName].total?.translog?.operations || 0,
    );
    if (operationsDestination > 0) {
      console.log(
        `${operationsDestination} operations on ${indexName} still processing.`,
      );
      return false;
    }
  }

  return true;
};

export const areAllReindexTasksFinished = async ({
  environmentName,
}: {
  environmentName: string;
}): Promise<boolean> => {
  const version = process.env.SOURCE_TABLE!.split('-').pop();
  const esClient = await getClient({ environmentName, version });
  const tasks = await esClient.cat.tasks({ format: 'json' });
  if (tasks && tasks.body && tasks.body.length) {
    const reindexTasks = tasks.body.filter(
      (task: { action: string }) =>
        task.action === 'indices:data/write/reindex',
    );
    const numReindexTasks = reindexTasks ? reindexTasks.length : 0;
    console.log(`found ${numReindexTasks} reindex tasks running`);
    return numReindexTasks === 0;
  }
  return true;
};
