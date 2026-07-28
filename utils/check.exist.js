function checkExist(item, itemName = "Item") {
  if (!item || (Array.isArray(item) && item.length === 0)) {
    return false;
  }
  return true;
}

module.exports = checkExist;
