exports.stripInternalKeys = items => {
  const strip = item => {
    delete item.sk;
    delete item.pk;
    delete item.gsi1pk;
  };
  if (!items) {
    return null;
  } else if (items.length) {
    items.forEach(strip);
  } else {
    strip(items);
  }
  return items;
};
