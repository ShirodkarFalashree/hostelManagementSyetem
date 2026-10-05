const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "hostel_secret_key_2026");
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  // Fallback for dev mode
  req.user = { id: "USR-001", role: "student", name: "Falashree" };
  next();
};

module.exports = { protect };
