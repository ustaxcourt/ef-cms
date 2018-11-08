import User from '../entities/User';
import Petition from '../entities/Petition';

export default async (baseUrl, persistenceGateway, rawPetition, rawUser) => {
  const petition = new Petition(rawPetition);
  const user = new User(rawUser);
  await persistenceGateway.filePdfPetition(user, petition, baseUrl);
};
