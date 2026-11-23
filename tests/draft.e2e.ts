import { expect } from 'e2e';
import { test } from '@e2e-dev/web';

test('fills the draft on the same screen', async ({ app, browser, agent }) => {
  await app.open('/');
  await expect(browser.locator('nav a').first()).toHaveText(process.env.BASELINE === 'noisy' ? 'Initial section 1' : 'Ready section 1');
  const field = browser.locator('input');
  await expect(field).toHaveValue('');
  await agent.act('Fill the draft');
  await expect(field).toHaveValue('Example draft');
});
