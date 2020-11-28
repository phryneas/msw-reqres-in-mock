import { mockInitialData } from './mockInitialData';
import { getHandlers } from './handlers';
import { setupWorker } from 'msw';

export function setupBrowser({
  seed,
  users,
  baseUrl,
}: {
  seed?: number;
  users?: number;
  baseUrl?: string;
}) {
  const initialState = mockInitialData({ seed, users });
  const handlers = getHandlers({ initialState, baseUrl });
  return setupWorker(...handlers);
}
