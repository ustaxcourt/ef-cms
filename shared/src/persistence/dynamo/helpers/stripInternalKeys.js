exports.stripInternalKeys = items => {
  const strip = item => {
    delete item.sk;
    delete item.pk;
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
