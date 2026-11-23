import type { E2EConfig, StepExecutor } from 'e2e';
import { web } from '@e2e-dev/web';

const executor: StepExecutor = {
  name: 'deterministic-fill',
  version: '1',
  async runStep(context) {
    const observation = await context.observe();
    const button = observation.text.split('\n').find(line => line.includes('button "Fill draft"'));
    const id = button?.match(/\b(n\d+)\b/)?.[1];
    if (!id) throw new Error('Fill draft button was not found');
    await context.actions.tap({ id });
    await context.observe();
    return { status: 'passed', summary: 'Draft filled' };
  },
};

export default {
  tests: ['tests/**/*.e2e.ts'],
  targets: [{ engine: web(), app: {
    url: 'http://127.0.0.1:4179',
    command: { executable: 'node', args: ['app.mjs', process.env.BASELINE ?? 'ready'] },
  } }],
  agents: { default: { executor } },
  cache: 'read-write',
} satisfies E2EConfig;
