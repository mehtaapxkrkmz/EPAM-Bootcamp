const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "development-secret-change-me";
const JWT_EXPIRES_IN_SECONDS = 86400; // 24 hours
const RESET_TOKEN_EXPIRES_IN_MINUTES = 30;
const BCRYPT_COST_FACTOR = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 60; // 1 hour
        const dataDir = path.join(__dirname, "data");
        const usersFile = path.join(dataDir, "users.json");

        function ensureDataDir() {
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
        }

        function readUsers() {
          ensureDataDir();
          if (!fs.existsSync(usersFile)) {
            fs.writeFileSync(usersFile, "[]", "utf-8");
          }
          const content = fs.readFileSync(usersFile, "utf-8");
          try {
            return JSON.parse(content);
          } catch {
            return [];
          }
        }

        function writeUsers(users) {
          ensureDataDir();
          fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
        }

function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function fail(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isStrongPassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasUppercase && hasNumber;
}

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN_SECONDS }
  );
}

app.use(cors());
app.use(express.json());

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return fail(res, 400, "VALIDATION_ERROR", "Email and password are required.");
    }

    if (!isStrongPassword(password)) {
      return fail(
        res,
        400,
        "WEAK_PASSWORD",
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number."
      );
    }

    const users = readUsers();
    const existingUser = users.find((u) => u.email === normalizedEmail);

    if (existingUser) {
      return fail(res, 409, "EMAIL_EXISTS", "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);
    const user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password_hash: passwordHash,
      failed_login_attempts: 0,
      locked_until: null,
      created_at: new Date().toISOString(),
      reset_token_hash: null,
      reset_token_expires_at: null
    };

    users.push(user);
    writeUsers(users);

    const token = createAccessToken(user);
    return success(res, 201, {
      token,
      expiresIn: JWT_EXPIRES_IN_SECONDS
    });

  } catch (error) {
    return fail(res, 500, "SERVER_ERROR", "Connection failed. Please try again.");
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return fail(res, 400, "VALIDATION_ERROR", "Email and password are required.");
    }

    const users = readUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return fail(res, 401, "AUTH_FAILED", "Invalid email or password.");
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return fail(res, 429, "ACCOUNT_LOCKED", "Too many attempts. Try again in 1 hour.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      // Increment failed attempts
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
      const lockedUntil = shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000) : null;

      user.failed_login_attempts = newAttempts;
      user.locked_until = lockedUntil;
      writeUsers(users);

      if (shouldLock) {
        return fail(res, 429, "ACCOUNT_LOCKED", "Too many attempts. Try again in 1 hour.");
      }

      return fail(res, 401, "AUTH_FAILED", "Invalid email or password.");
    }

    // Reset failed attempts on successful login
    user.failed_login_attempts = 0;
    user.locked_until = null;
    writeUsers(users);

    const token = createAccessToken(user);
    return success(res, 200, {
      token,
      expiresIn: JWT_EXPIRES_IN_SECONDS
    });
  } catch (error) {
    return fail(res, 500, "SERVER_ERROR", "Connection failed. Please try again.");
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return fail(res, 400, "VALIDATION_ERROR", "Email is required.");
    }

    const users = readUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);

      user.reset_token_hash = tokenHash;
      user.reset_token_expires_at = expiresAt.toISOString();
      writeUsers(users);

      // In production, send this token through an email provider.
      console.log(`Password reset token for ${normalizedEmail}: ${rawToken}`);
    }

    return success(res, 200, {
      message: "If that email exists, a password reset link was sent."
    });
  } catch (error) {
    return fail(res, 500, "SERVER_ERROR", "Connection failed. Please try again.");
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
      return fail(res, 400, "VALIDATION_ERROR", "Reset token and new password are required.");
    }

    if (!isStrongPassword(newPassword)) {
      return fail(
        res,
        400,
        "WEAK_PASSWORD",
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number."
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const users = readUsers();
    const user = users.find(
      (u) =>
        u.reset_token_hash === tokenHash &&
        u.reset_token_expires_at &&
        new Date(u.reset_token_expires_at) > new Date()
    );
    if (!user) {
      return fail(res, 400, "RESET_TOKEN_INVALID", "Reset token is invalid or expired.");
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST_FACTOR);
    user.password_hash = passwordHash;
    user.reset_token_hash = null;
    user.reset_token_expires_at = null;
    writeUsers(users);

    const jwtToken = createAccessToken(user);
    return success(res, 200, {
      token: jwtToken,
      expiresIn: JWT_EXPIRES_IN_SECONDS
    });
  } catch (error) {
    return fail(res, 500, "SERVER_ERROR", "Connection failed. Please try again.");
  }
});

const frontendDist = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendDist));

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
