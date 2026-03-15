// JWT helpers and simple auth middleware for the demo backend.
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gleworks-dev-secret";

export const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

export const authRequired = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.auth?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
};
