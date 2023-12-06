import { readyClusterForMigration } from './ready-cluster-for-migration.helpers';

readyClusterForMigration(process.argv[2]).then(() => {
  console.log('finish readying cluster for migration');
});
