const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  // roles param can be a single role string (e.g. 'admin') or an array
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Forbidden: insufficient rights' });
      }
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};