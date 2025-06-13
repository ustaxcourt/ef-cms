import { disassociateResourcesFromWebAcl } from 'scripts/run-once-scripts/deleteWest/allColors/disassociateResourcesFromWebAcl';

async function main() {
  await disassociateResourcesFromWebAcl();
}

void main();
