import { state } from '@web-client/presenter/app.cerebral';

export const formatPetitionFactsAndReasonsAction = ({
  get,
  store,
}: ActionProps) => {
  const { petitionFacts, petitionReasons } = get(state.form);

  const filteredPetitionReasons = filterAndDefault(petitionReasons);
  const filteredPetitionFacts = filterAndDefault(petitionFacts);

  store.set(state.form.petitionReasons, filteredPetitionReasons);
  store.set(state.form.petitionFacts, filteredPetitionFacts);
};

function filterAndDefault(arr) {
  const filteredArr = arr.filter(r => !!r.trim());
  return filteredArr.length > 0 ? filteredArr : [''];
}
