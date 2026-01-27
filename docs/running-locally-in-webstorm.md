# Running Locally with IntelliJ IDEA / WebStorm

This guide describes how to use integrated run configurations to run and debug the DAWSON application within JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.).

These configurations are stored in the `.run` directory and are automatically picked up by JetBrains IDEs.

## Prerequisites

Before using these run configurations, ensure you have:

1. Followed the general [Install Required Software](./running-locally.md#install-required-software) guide (Node.js, NVM, Docker Desktop, etc.).
1. Installed dependencies by running `npm ci` in your terminal.
1. Docker running.

## 🚀 Running and Debugging the Application

Each run configuration is a "single click" experience.

### 1. DAWSON local (Combined)
- **What it does:** This is a Compound configuration that launches the `API`, `Client`, and `Public` configurations simultaneously.
- **How to run:**
  - **Run mode:** Select `DAWSON local` and click the **Run** button. This will start the API, Client, and Public servers.
  - **Debug mode:** Select `DAWSON local` and click the **Debug** button. This will:
    1. **Debug the API** (Backend).
    1. **Run the Private Client** server.
    1. **Run the Public Client** server.
- **Note:** Because Chrome only allows one debugger to be attached at a time per user profile, the frontend debuggers are not part of the initial "DAWSON local" launch. You can attach them manually once the servers are up (see below).

### 2. API (Backend)
- **What it does:** 
  1. **Preparation**: Runs `init-local.sh` which:
     - Starts Docker containers (OpenSearch, Postgres).
     - Launches `s3rver` and `cognito-local` in the background.
     - Waits for all services to be ready.
     - Runs migrations and seeds data (Postgres, S3, OpenSearch, Cognito).
  1. **App Launch**: Starts the backend API using `nodemon` for live reload. Background services (`s3rver`, `cognito-local`) are also automatically started.
- **How to run:** Select `API` and click the **Debug** button (green bug).
- **Live Reload:** Any changes you make in `web-api/` or `shared/` will trigger an automatic restart, and the debugger will re-attach.

### 3. Client (Private UI)
- **What it does:** Runs the (private) frontend server with live reload.
- **How to run:** Select **Client** and click **Run**.
- **Access:** [http://localhost:1234](http://localhost:1234)

### 4. Public (Public UI)
- **What it does:** Runs the (public) frontend server with live reload.
- **How to run:** Select **Public** and click **Run**.
- **Access:** [http://localhost:5678](http://localhost:5678)

---

## 🐞 Frontend Debugging

### Frontend Debugging with Chrome
To debug the UI in your IDE:
1. Ensure the **Client** (or **Public**) configuration is already running.
2. Select **Debug Client (Chrome)** (or **Debug Public (Chrome)**).
3. Click the **Debug** button.
4. Once the new Chrome window opens, breakpoints set in your `.tsx` or `.ts` files should now be hit as you interact with the app.

#### 💡 Note on "Post-Compiled" Tabs
When a breakpoint is hit, the IDE may sometimes open a new tab containing the "post-compiled" version of the file instead of staying in your original source tab. This is a known behavior with inline sourcemaps in some IDE versions, but the debugger is fully functional, allowing you to inspect variables and step through the code.

## 🛠 Troubleshooting

- **Chrome Debug "Browser process terminated":** This error usually means Chrome is already being debugged by another process or another tab in the same profile. Make sure to close any existing debugger-controlled Chrome windows before starting a new one.

- **Docker Errors:** Ensure Docker Desktop is running. The **API** configuration will automatically attempt to start the necessary containers.
- **Clean Slate:** If you need to reset your local data completely, stop all running processes, run `docker compose down` in your terminal, and then click **Debug** on the **API** configuration again to re-initialize everything.
- **Cognito Connection Errors (Port 9229):** If you see `ECONNREFUSED` on port 9229, ensure no other process is using that port. The **API** configuration automatically launches `cognito-local` and `s3rver` in the background when it starts. These services will stay alive as long as the API process is running.
- **NoSuchKey Warnings:** During the `Prepare Local Environment` task, you may see some `NoSuchKey` errors in the logs during the Postgres seeding step. These are expected and relate to missing documents in the development data fixtures; they do not indicate a failure of the setup itself.
- **Port Conflicts:** Ensure no other processes are using ports 4000 (API), 9200 (OpenSearch), 9001 (S3), or 5432 (Postgres).
