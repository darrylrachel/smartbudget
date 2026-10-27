import { recordId, workspaceId, type WorkspaceId } from '../domain/contracts';
import { fixtures } from '../fixtures/workspaces';
import type { BudgetRepository, WorkspaceSnapshot } from './repository';

// Fixture selection is not authorization. Only these aliases are sample workspaces.
function scoped(input: WorkspaceId): WorkspaceSnapshot {
  const id = workspaceId(input);
  if (!Object.hasOwn(fixtures, id)) throw new Error('Sample workspace unavailable.');
  return structuredClone(fixtures[id]);
}
export const mockRepository: BudgetRepository = {
  snapshot: scoped,
  goal: (workspace, id) => scoped(workspace).goals.find(goal => goal.id === recordId(id)),
  transactions: workspace => scoped(workspace).transactions,
};
export async function loadSnapshot(workspace: WorkspaceId, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 80);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); }, { once: true });
  });
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
  return mockRepository.snapshot(workspace);
}
