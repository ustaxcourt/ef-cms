import User from '../entities/User';
import Petition from '../entities/Petition';

export default async (
  environment, // pull from applicationContext
  persistenceGateway, // pull from applicationContext
  rawPetition,
  rawUser,
) => {
  const petition = new Petition(rawPetition);
  const user = new User(rawUser);
  await persistenceGateway.createPdfPetition(user, petition, environment);
};
