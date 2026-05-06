const authForm = document.getElementById("authForm");
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const nameField = document.getElementById("nameField");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const profileCard = document.getElementById("profileCard");
const profileText = document.getElementById("profileText");
const logoutButton = document.getElementById("logoutButton");

let mode = "register";

function setMode(nextMode) {
  mode = nextMode;

  const isRegister = mode === "register";
  registerTab.classList.toggle("active", isRegister);
  registerTab.setAttribute("aria-selected", String(isRegister));
  loginTab.classList.toggle("active", !isRegister);
  loginTab.setAttribute("aria-selected", String(!isRegister));

  nameField.classList.toggle("hidden", !isRegister);
  submitButton.textContent = isRegister ? "Create Account" : "Log In";
  formMessage.textContent = "";
  formMessage.className = "message";
}

function setMessage(text, kind = "default") {
  formMessage.textContent = text;
  formMessage.className = `message ${kind === "error" ? "error" : kind === "success" ? "success" : ""}`.trim();
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function clearToken() {
  localStorage.removeItem("token");
}

async function fetchMe() {
  const token = getToken();

  if (!token) {
    profileCard.classList.add("hidden");
    return;
  }

  const response = await fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    clearToken();
    profileCard.classList.add("hidden");
    return;
  }

  const data = await response.json();
  profileText.textContent = `Signed in as ${data.user.name} (${data.user.email})`;
  profileCard.classList.remove("hidden");
}

async function handleSubmit(event) {
  event.preventDefault();
  setMessage("", "default");

  const formData = new FormData(authForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password || (mode === "register" && !name)) {
    setMessage("Please fill all required fields.", "error");
    return;
  }

  if (mode === "register" && password.length < 8) {
    setMessage("Password must be at least 8 characters.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.style.opacity = "0.75";

  try {
    const endpoint = mode === "register" ? "/api/register" : "/api/login";
    const payload = mode === "register" ? { name, email, password } : { email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Request failed.", "error");
      return;
    }

    saveToken(data.token);
    setMessage(data.message, "success");
    authForm.reset();
    await fetchMe();

    if (mode === "register") {
      setMode("login");
      setMessage("Registration complete. You can now log in.", "success");
    }
  } catch (error) {
    setMessage("Unexpected error. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.style.opacity = "1";
  }
}

registerTab.addEventListener("click", () => setMode("register"));
loginTab.addEventListener("click", () => setMode("login"));
authForm.addEventListener("submit", handleSubmit);
logoutButton.addEventListener("click", () => {
  clearToken();
  profileCard.classList.add("hidden");
  setMessage("Logged out.", "success");
});

setMode("register");
fetchMe();
