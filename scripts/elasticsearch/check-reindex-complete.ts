import { getClient } from '../../web-api/elasticsearch/client';

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
