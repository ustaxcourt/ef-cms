import User from '../entities/User';
import Petition from '../entities/Petition';

export default async (
  environment,
  persistenceGateway,
  rawPetition,
  rawUser,
) => {
  const petition = new Petition(rawPetition);
  const user = new User(rawUser);
  await persistenceGateway.createPdfPetition(user, petition, environment);
};
