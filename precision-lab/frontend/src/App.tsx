import { FormEvent, useMemo, useState } from "react";
import { forgotPassword, login, register, resetPassword } from "./api";
import type { ApiResponse, TokenPayload } from "./types";

type Mode = "register" | "login" | "forgot" | "reset";

function isPasswordValid(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

function readMessage<T>(response: ApiResponse<T>): string {
  if (response.success) {
    return "Success";
  }
  return `${response.error.code}: ${response.error.message}`;
}

export function App() {
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordHint = useMemo(() => {
    if (!password) {
      return "";
    }
    return isPasswordValid(password) ? "Strong enough." : "Use min 8 chars with 1 uppercase and 1 number.";
  }, [password]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setTokenInfo(null);

    if (!email) {
      setIsError(true);
      setMessage("Email is required.");
      return;
    }

    if ((mode === "register" || mode === "login" || mode === "reset") && !password) {
      setIsError(true);
      setMessage("Password is required.");
      return;
    }

    if ((mode === "register" || mode === "reset") && !isPasswordValid(password)) {
      setIsError(true);
      setMessage("Password must be at least 8 chars with 1 uppercase and 1 number.");
      return;
    }

    if (mode === "reset" && !resetToken) {
      setIsError(true);
      setMessage("Reset token is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "register") {
        const response = await register(email, password);
        if (response.success) {
          setIsError(false);
          setMessage("Registered successfully.");
          setTokenInfo(response.data);
          return;
        }
        setIsError(true);
        setMessage(readMessage(response));
        return;
      }

      if (mode === "login") {
        const response = await login(email, password);
        if (response.success) {
          setIsError(false);
          setMessage("Logged in successfully.");
          setTokenInfo(response.data);
          return;
        }
        setIsError(true);
        setMessage(readMessage(response));
        return;
      }

      if (mode === "forgot") {
        const response = await forgotPassword(email);
        if (response.success) {
          setIsError(false);
          setMessage(response.data.message);
          return;
        }
        setIsError(true);
        setMessage(readMessage(response));
        return;
      }

      const response = await resetPassword(resetToken, password);
      if (response.success) {
        setIsError(false);
        setMessage("Password reset successfully.");
        setTokenInfo(response.data);
        return;
      }
      setIsError(true);
      setMessage(readMessage(response));
    } catch (error) {
      setIsError(true);
      setMessage("Request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="shell">
      <section className="panel">
        <h1>Precision Lab Auth</h1>
        <p>React + TypeScript frontend, Express backend, PostgreSQL persistence.</p>

        <div className="tabs">
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "forgot" ? "active" : ""} onClick={() => setMode("forgot")}>Forgot Password</button>
          <button className={mode === "reset" ? "active" : ""} onClick={() => setMode("reset")}>Reset Password</button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {(mode === "register" || mode === "login" || mode === "reset") && (
            <label>
              {mode === "reset" ? "New Password" : "Password"}
              <input
                type="password"
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {mode === "reset" && (
            <label>
              Reset Token
              <input
                type="text"
                placeholder="Paste token from email"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </label>
          )}

          {passwordHint && <p className="hint">{passwordHint}</p>}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : "Submit"}
          </button>
        </form>

        {message && <p className={isError ? "message error" : "message success"}>{message}</p>}

        {tokenInfo && (
          <pre className="tokenBox">
{JSON.stringify(
  {
    success: true,
    data: {
      token: tokenInfo.token,
      expiresIn: tokenInfo.expiresIn
    }
  },
  null,
  2
)}
          </pre>
        )}
      </section>
    </main>
  );
}
