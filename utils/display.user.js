module.exports = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};
