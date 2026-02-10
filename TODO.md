### Manual Test Suite for DAWSON Local Development

#### Test Case 1: Full Docker Mode (`start:all:docker`)
1.  **Start:** Run `npm run start:all:docker` in your terminal.
2.  **Verify Services:** Visit `http://localhost:1234` (Private UI) and `http://localhost:5678` (Public UI). Login and verify basic functionality.
3.  **Verify S3 & Permissions:**
    - Create a case and upload a document.
    - View the document in **Firefox**. It should load successfully.
    - Check file ownership: `ls -ln web-api/storage/s3/noop-documents-local-us-east-1/`. Files should be owned by your UID/GID, not root.
4.  **Verify Hot Reload:** Modify a backend file and observe `nodemon` restarting the API in the docker logs.
5.  **Stop:** Issue `CTRL+C` and wait for graceful shutdown.

#### Test Case 2: Hybrid IDE Mode ("DAWSON local")
1.  **Start:** In the IDE, run the **"DAWSON local"** Compound Run Configuration.
2.  **Verify Services:** Ensure the "Prepare Local Environment" task finishes. Verify UI and API functionality.
3.  **Verify Transitions:**
    - Stop the "DAWSON local" configuration.
    - **Immediately Start** `npm run start:all:docker`. It should start without container or port conflicts.
    - Stop `npm run start:all:docker` and restart "DAWSON local". It should also start cleanly.

#### Test Case 3: Docker with IDE Debugging ("DAWSON Docker")
1.  **Start:** In the IDE, run the **"DAWSON Docker"** Compound Run Configuration.
2.  **Verify Debugger:**
    - The IDE should attach the debugger to the `api` container on port `9231`.
    - Set a breakpoint in a backend interactor (e.g., `createCaseInteractor.ts`).
    - Trigger the action in the UI and verify the breakpoint is hit.

#### Test Case 4: Data Persistence & Cleanup
1.  **Action:** Run in **Full Docker Mode**, create a case, then stop.
2.  **Action:** Start in **Hybrid IDE Mode**.
3.  **Verify:** The case should still exist (shared Postgres volume), unless `down --volumes` was explicitly called to wipe it.

#### Test Case 5: Legacy 3 Terminal Sessions
1.  **Action:** Run `./init-local.sh`, then `npm run start:api`, `npm run start:client`, and `npm run start:public` in separate terminals.
2.  **Verify:** The application remains fully operational.