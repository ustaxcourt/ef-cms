import { deleteComputeEnvironment } from 'scripts/run-once-scripts/deleteWest/deleteBatchResources';
import { deleteAllImages } from 'scripts/run-once-scripts/deleteWest/deleteEcrImages';

async function main() {
  await deleteComputeEnvironment();
  await deleteAllImages();
}

void main();
