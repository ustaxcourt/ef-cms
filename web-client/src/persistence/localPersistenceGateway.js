const filePdfPetition = async function filePdfPetition() {
  // user,
  // petition,
  // environment,
  // TODO: store documents in localStorage
  return;
};

const getUser = name => {
  if (name !== 'Test, Taxpayer') throw new Error('Username is incorrect');
  return name;
};

const localPersistenceGateway = {
  filePdfPetition,
  getUser,
};

export default localPersistenceGateway;
