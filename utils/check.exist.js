/**
 * Check if an item exists (not null, not undefined, and not empty array)
 * @param {*} item - The item to check
 * @param {string} itemName - The name of the item for error messages
 * @returns {boolean} - True if item exists, false otherwise
 */
const checkExist = (item, itemName = "Item") => {
  if (!item) {
    return false;
  }

  if (Array.isArray(item) && item.length === 0) {
    return false;
  }

  return true;
};

module.exports = checkExist;
