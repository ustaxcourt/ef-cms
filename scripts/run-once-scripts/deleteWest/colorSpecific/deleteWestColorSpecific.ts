import { deleteComputeEnvironment } from 'scripts/run-once-scripts/deleteWest/colorSpecific/deleteBatchResources';
import { deleteAllImages } from 'scripts/run-once-scripts/deleteWest/colorSpecific/deleteEcrImages';

async function main() {
  await deleteComputeEnvironment();
  await deleteAllImages();
}

void main();
