const protect = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ status: "failed", message: "unauthorised" });
  }

  req.user = user;

  next();
};

module.exports = protect;
