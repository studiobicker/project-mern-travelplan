module.exports = (req, res, next) => {
  if (!req.session.user) res.status(401).json({ message: "Not logged in!" });
  next();
};
