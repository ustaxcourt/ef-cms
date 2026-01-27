# Running Locally with IntelliJ IDEA / WebStorm

This guide describes how to use integrated run configurations to run and debug the DAWSON application within JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.).

These configurations are stored in the `.run` directory and are automatically picked up by JetBrains IDEs.

## Prerequisites

Before using these run configurations, ensure you have:

1.  Followed the general [Install Required Software](./running-locally.md#install-required-software) guide (Node.js, NVM, Docker Desktop, etc.).
1.  Installed dependencies by running `npm ci` in your terminal.
1.  Docker running.

## 🚀 Running and Debugging the Application

Each run configuration is a "single click" experience.

### 1. DAWSON local (Combined)
- **What it does:** This is a Compound configuration that launches the `API`, `Client`, and `Public` configurations simultaneously.
- **How to run:**
  - **Run mode:** Select `DAWSON local` and click the **Run** button. This will start the API, Client, and Public servers.
  - **Debug mode:** Select `DAWSON local` and click the **Debug** button. This will:
    1. **Debug the API** (Backend).
    2. **Run the Private Client** server.
    3. **Run the Public Client** server.
    4. **Debug the Private Client UI** (via Chrome).
    5. **Debug the Public Client UI** (via Chrome).
- **Note:** The IDE will open multiple tabs in the Run and Debug windows as necessary.

### 2. API (Backend)
- **What it does:** 
  1. **Preparation**: Runs `prepare-local-dev.sh` which:
     - Starts Docker containers (OpenSearch, Postgres).
     - Launches `s3rver` and `cognito-local` in the background.
     - Waits for all services to be ready.
     - Runs migrations and seeds data (Postgres, S3, OpenSearch, Cognito).
  2. **App Launch**: Starts the backend API using `nodemon` for live reload.
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

## 🐞 Debugging only the backend or frontend

### Backend Debugging
Simply run the **API** configuration in **Debug** mode. You can set breakpoints in `web-api/src` or `shared/src`, and they will be hit during API requests.

### Frontend Debugging (Chrome)
To debug the UI in your IDE:
1. Ensure the **Client** (or **Public**) configuration is already running.
2. Select **Debug Client (Chrome)** (or **Debug Public (Chrome)**).
3. Click the **Debug** button.
4. A new Chrome instance will open, and breakpoints set in your IDE will be hit as you interact with the app.

## 🛠 Troubleshooting

- **Docker Errors:** Ensure Docker Desktop is running. The **API** configuration will automatically attempt to start the necessary containers.
- **Clean Slate:** If you need to reset your local data completely, stop all running processes, run `docker compose down` in your terminal, and then click **Debug** on the **API** configuration again to re-initialize everything.
- **Cognito Connection Errors (Port 9229):** If you see `ECONNREFUSED` on port 9229, ensure no other process is using that port. The **API** configuration is now set up to automatically launch `cognito-local` and `s3rver` in the background when it starts. These services will stay alive as long as the API process is running.
- **NoSuchKey Warnings:** During the `Prepare Local Environment` task, you may see some `NoSuchKey` errors in the logs during the Postgres seeding step. These are expected and relate to missing documents in the development data fixtures; they do not indicate a failure of the setup itself.
- **Port Conflicts:** Ensure no other processes are using ports 4000 (API), 9200 (OpenSearch), 9001 (S3), or 5432 (Postgres).
