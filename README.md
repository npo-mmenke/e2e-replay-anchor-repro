# e2e: navigation labels crowd a changed input out of replay evidence

A single local HTML page, one test, and a deterministic `StepExecutor`. No model, credentials, external app, database, or test dataset is needed.

## Reproduce

Requires Node 24 and Chromium. Tested with Node 24.22.2, `e2e` 0.24.0, and `@e2e-dev/web` 0.16.1.

```sh
npm ci
npx playwright-core install chromium
BASELINE=noisy npm run record -- --cache-dir .e2e/noisy
npm run replay -- --cache-dir .e2e/noisy
```

Use a fresh cache directory for each recording/replay pair. The app uses localhost port 4179.

- **Record:** The tap fills an empty input. Ten unrelated navigation labels also change from “Initial” to “Ready”. The independent input assertion passes.
- **Replay:** The input starts empty again, but the labels already read “Ready”. The same recorded tap runs. Strict replay fails with `REPLAY_STALE (end-mismatch)`. The JSON report at `.e2e/report.json` shows `replayedActions: 1`, `totalActions: 1`, and says the recorded outcome was already present. The trace entry under `.e2e/noisy` contains eight navigation links as its appeared anchors and no input anchor.

## Control

```sh
npm run record -- --cache-dir .e2e/control
npm run replay -- --cache-dir .e2e/control
```

Recording starts with “Ready” labels too, so the input is the only changed state. Strict replay succeeds (`Cache 1 replayed`), and the independent input assertion runs and passes.

The refusal to accept an already-visible outcome as proof is useful. The problem is that unrelated changes exhaust the recording budget before the changed input is considered. This report does not propose accepting a fill as evidence for a separate save operation.
