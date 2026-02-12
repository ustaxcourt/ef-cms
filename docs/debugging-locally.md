# Debugging Locally with an IDE

This guide describes how to use integrated run configurations to run and debug the DAWSON application within your IDE (IntelliJ IDEA, WebStorm, VSCode, etc.).

These configurations are stored in the `.run` directory (for JetBrains IDEs) and `.vscode/launch.json` (for VSCode), and are automatically picked up by your IDE.

## Prerequisites

Before using these run configurations, ensure you have:

1. Followed the general [Install Required Software](./running-locally.md#install-required-software) guide (Node.js, NVM, Docker Desktop, etc.).
1. Installed dependencies by running `npm ci` in your terminal.
1. Docker running.

---

## 🚀 Debugging the Application

Each run configuration is a "single click" experience. JetBrains IDEs allow the user to run or debug, whereas VSCode always debugs. This documentation assumes that you will be debugging.

### 1. DAWSON local (Combined)
- **What it does:** This is a Compound configuration that launches the `API`, `Client`, and `Public` configurations simultaneously.
- **How to run:** Select `DAWSON local` and click the **Debug** button. This will:
  1. **Debug the API** (Backend).
  1. **Run the Private Client** server.
  1. **Run the Public Client** server.
- **Note:** Because Chrome only allows one debugger to be attached at a time per user profile, the frontend debuggers are not part of the initial "DAWSON local" launch. You can attach them manually once the servers are up (see below).

### 2. API (Backend)
- **What it does:** Runs the necessary background processes, seeds the databases, then runs the backend API with live reload.
- **How to run:** Select `API` and click the **Debug** button.
- **Live Reload:** Any changes you make in `web-api/` or `shared/` will trigger an automatic restart, and the debugger will re-attach.

### 3. Client (Private UI)
- **What it does:** Runs the (private) frontend server with live reload.
- **How to run:** Select **Client** and click **Debug**.
- **Access:** [http://localhost:1234](http://localhost:1234)

### 4. Public (Public UI)
- **What it does:** Runs the (public) frontend server with live reload.
- **How to run:** Select **Public** and click **Debug**.
- **Access:** [http://localhost:5678](http://localhost:5678)

---

## 🐞 Frontend Debugging

### Frontend Debugging with Chrome
To debug the UI in your IDE:
1. Ensure the **API** and **Client** (or **Public**) configurations are already running.
1. Select **Debug Client (Chrome)** (or **Debug Public (Chrome)**).
1. Click the **Debug** button.
1. Once the new Chrome window opens, breakpoints set in your `.tsx` or `.ts` files should now be hit as you interact with the app.

---

## 🛠 Troubleshooting

- **Chrome Debug "Browser process terminated":** This error usually means Chrome is already being debugged by another process or another tab in the same profile. Make sure to close any existing debugger-controlled Chrome windows before starting a new one.
- **Docker Errors:** Ensure Docker Desktop is running. The **API** configuration will automatically attempt to start the necessary containers.
- **Clean Slate:** If you need to reset your local data completely, stop all running processes, run `docker compose down` in your terminal, and then click **Debug** on the **API** configuration again to re-initialize everything.
- **Port Conflicts:** Ensure no other processes are using ports 4000 (API), 5432 (Postgres), 9200 (OpenSearch), 9001 (S3), or 9229 (Cognito).
