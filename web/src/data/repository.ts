import { AllocationResult, Role, WorkspaceId } from '../domain/contracts';
import { Cents } from '../domain/money';

export interface Goal { id: string; workspaceId: WorkspaceId; title: string; reserved: Cents; target: Cents; targetDate: string }
export interface Transaction { id: string; workspaceId: WorkspaceId; title: string; amount: Cents; date: string; account: string; type: 'income' | 'expense' }
export interface WorkspaceSnapshot {
  id: WorkspaceId; name: string; kind: 'personal' | 'household'; role: Role; currency: 'USD';
  cash: Cents; reserved: Cents; protected: Cents; available: Cents; forecast: Cents; nextPay: string;
  goals: readonly Goal[]; transactions: readonly Transaction[]; preview: AllocationResult;
}
export interface BudgetRepository {
  snapshot(workspace: WorkspaceId): WorkspaceSnapshot;
  goal(workspace: WorkspaceId, id: string): Goal | undefined;
  transactions(workspace: WorkspaceId): readonly Transaction[];
}
