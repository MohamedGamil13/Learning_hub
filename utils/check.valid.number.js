module.exports = (value) => {
  return typeof value === "number" && Number.isFinite(value);
};
