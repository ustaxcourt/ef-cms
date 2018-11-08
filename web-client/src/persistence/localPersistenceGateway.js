const createPdfPetition = async function createPdfPetition(
  user,
  petition,
  environment,
) {
  console.log('local createPdfPetition', user, petition, environment);
  return;
};

const getUser = name => {
  if (name !== 'Test, Taxpayer') throw new Error('Username is incorrect');
  return name;
};

const localPersistenceGateway = {
  createPdfPetition,
  getUser,
};

export default localPersistenceGateway;
