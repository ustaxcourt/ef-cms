import { deleteJobQueue } from 'scripts/run-once-scripts/deleteWest/deleteBatchResources';
import { deleteAllImages } from 'scripts/run-once-scripts/deleteWest/deleteEcrImages';

async function main() {
  await deleteJobQueue();
  await deleteAllImages();
}

void main();
