exports.stripWorkItems = (casesToModify, isAuthorizedForWorkItems) => {
  if (isAuthorizedForWorkItems) return casesToModify;
  if (!casesToModify) return casesToModify;

  const strip = caseToModify => {
    delete caseToModify.workItems;
  };

  if (casesToModify.length) {
    casesToModify.forEach(strip);
    return casesToModify;
  } else {
    strip(casesToModify);
    return casesToModify;
  }
};
