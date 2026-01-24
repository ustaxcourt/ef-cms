# Running Locally with IntelliJ IDEA / WebStorm

This guide describes how to use the integrated run configurations to run and debug the DAWSON application within JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.).

These configurations are stored in the `.run` directory and are automatically picked up by your IDE.

## Prerequisites

Before using these run configurations, ensure you have:

1.  Followed the general [Install Required Software](./running-locally.md#install-required-software) guide (Node.js, NVM, Docker Desktop, etc.).
2.  Installed dependencies by running `npm ci` in your terminal.
3.  Docker Desktop is running.

## 🏃 Starting Infrastructure

The application requires several Docker dependencies (like OpenSearch and S3rver) to be running.

### 1. Launch Docker and Wait
Instead of starting everything manually, use the **Launch Docker and Wait** compound configuration.

- **What it does:**
    1.  Starts the `opensearch-node` service using `docker-compose`.
    2.  Runs `wait-until-services.sh` to ensure all necessary endpoints (API and OpenSearch) are online.
- **How to run:**
    1.  Open the **Run/Debug Configurations** dropdown in the top-right toolbar.
    2.  Select **Launch Docker and Wait**.
    3.  Click the **Run** button (green arrow).

## 🚀 Running the Application

Once the infrastructure is ready, you can start the individual application components.

### 2. API
- **Configuration:** **API**
- **What it does:** Starts the backend API using `ts-node` targeting `web-api/src/app-local.ts`. It also automatically triggers **start:s3rver** as a "Before Launch" task.
- **How to run:** Select **API** from the run configurations and click **Run** (or **Debug** for step-through debugging).

### 3. Client (Private UI)
- **Configuration:** **Client**
- **What it does:** Runs `npm run start:client`.
- **How to run:** Select **Client** and click **Run**.
- **Access:** [http://localhost:1234](http://localhost:1234)

### 4. Public (Public UI)
- **Configuration:** **Public**
- **What it does:** Runs `npm run start:public`.
- **How to run:** Select **Public** and click **Run**.
- **Access:** [http://localhost:5678](http://localhost:5678)

---

## 🐞 Debugging the UI

We have provided specific configurations for debugging the frontend in Chrome. These allow you to set breakpoints directly in your IDE.

### Debug Client (Chrome)
1.  Ensure the **Client** configuration is already running.
2.  Select **Debug Client (Chrome)** from the run configurations.
3.  Click the **Debug** button (green bug icon).
4.  A new Chrome instance will open, and breakpoints in your IDE will now be hit.

### Debug Public (Chrome)
1.  Ensure the **Public** configuration is already running.
2.  Select **Debug Public (Chrome)** from the run configurations.
3.  Click the **Debug** button.

## 🛠 Troubleshooting

- **Docker Errors:** If **Launch Docker and Wait** fails, ensure Docker Desktop is running and that no other processes are using ports 9200 (OpenSearch) or 9001 (S3rver).
- **Environment Variables:** These configurations come pre-loaded with the necessary local environment variables (e.g., `AWS_ACCESS_KEY_ID=S3RVER`). If you need to customize them, you can edit the configuration in your IDE, but avoid committing sensitive changes to the `.run/*.xml` files.
- **Fresh Start:** If things get stuck, you can run `docker compose down` in your terminal and then try **Launch Docker and Wait** again.
