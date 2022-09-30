const orderedFilterMap = [
  {
    code: 'setForTrial',
    name: 'Set For Trial',
  },
  {
    code: 'dismissed',
    name: 'Dismissed',
  },
  {
    code: 'continued',
    name: 'Continued',
  },
  {
    code: 'rule122',
    name: 'Rule 122',
  },
  {
    code: 'aBasisReached',
    name: 'A Basis Reached',
  },
  {
    code: 'settled',
    name: 'Settled',
  },
  {
    code: 'recall',
    name: 'Recall',
  },
  {
    code: 'takenUnderAdvisement',
    name: 'Taken Under Advisement',
  },
  {
    code: 'statusUnassigned',
    name: 'Status Unassigned',
  },
];

const generateCaseStatus = trialStatus => {
  const foundTrialStatusFromMap = orderedFilterMap.find(
    orderedFilterKey => orderedFilterKey.code === trialStatus,
  );
  return foundTrialStatusFromMap?.name || 'Unassigned';
};

const generateSelectedFilterList = filters => {
  const filterKeys = Object.keys(filters).filter(
    filterKey => filterKey !== 'showAll',
  );
  const userFilterSelection = filterKeys.filter(
    filterKey => filters[filterKey],
  );

  return orderedFilterMap.map(orderedFilterKey => {
    const nameOfFilter = orderedFilterKey.code;
    if (userFilterSelection.indexOf(nameOfFilter) > -1) {
      return orderedFilterKey.name;
    }
  });
};

module.exports = {
  generateCaseStatus,
  generateSelectedFilterList,
};
