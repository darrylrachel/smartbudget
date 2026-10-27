import { WorkspaceSnapshot } from '../data/repository';
import { WorkspaceId } from '../domain/contracts';
import { cents as c } from '../domain/money';

function preview(id: WorkspaceId, household: boolean): WorkspaceSnapshot['preview'] {
  return {
    workspaceId: id, status: household ? 'shortfall' : 'ready', available: c(household ? 25000 : 80000),
    ledgerVersion: 1, settingsVersion: 1, ruleVersion: 'fixture-only', inputHash: 'synthetic-not-engine-output',
    additions: household ? [
      { envelopeId: 'shared-rent', amount: c(20000), reason: 'DUE_ESSENTIAL', explanation: 'Sample shared rent is due October 24, before utilities.' },
      { envelopeId: 'shared-utilities', amount: c(5000), reason: 'DUE_ESSENTIAL', explanation: 'Sample utilities due October 26 receive the remaining cash; $150 remains unfunded.' },
    ] : [
      { envelopeId: 'personal-rent', amount: c(40000), reason: 'DUE_ESSENTIAL', explanation: 'Sample rent due October 24 comes first.' },
      { envelopeId: 'personal-food', amount: c(20000), reason: 'VARIABLE_ESSENTIAL', explanation: 'Fictional food and transport estimate for this period.' },
      { envelopeId: 'personal-buffer', amount: c(10000), reason: 'BUFFER_TOP_UP', explanation: 'Top up a fictional protected buffer target.' },
      { envelopeId: 'personal-goal', amount: c(6000), reason: 'WEIGHTED_REMAINDER', explanation: '60% of the remaining $100 under sample settings.' },
      { envelopeId: 'personal-flexible', amount: c(4000), reason: 'WEIGHTED_REMAINDER', explanation: '40% of the remaining $100 under sample settings.' },
    ], unmet: household ? [{ requestId: 'shared-utilities', amount: c(15000), reason: 'INSUFFICIENT_FUNDS' }] : [], unassigned: c(0),
  };
}
export const fixtures: Record<WorkspaceId, WorkspaceSnapshot> = {
  'personal-demo': {
    id: 'personal-demo', name: 'Personal sample', kind: 'personal', role: 'owner', currency: 'USD',
    cash: c(100000), reserved: c(20000), protected: c(10000), available: c(80000), forecast: c(80000), nextPay: '2026-11-05',
    goals: [{ id: 'personal-cushion', workspaceId: 'personal-demo', title: 'A little breathing room', reserved: c(10000), target: c(50000), targetDate: '2027-03-01' }],
    transactions: [
      { id: 'personal-pay', workspaceId: 'personal-demo', title: 'Fictional settled pay', amount: c(80000), date: '2026-10-22', account: 'Sample checking', type: 'income' },
      { id: 'personal-groceries', workspaceId: 'personal-demo', title: 'Fictional groceries', amount: c(-4500, true), date: '2026-10-21', account: 'Sample checking', type: 'expense' },
    ], preview: preview('personal-demo', false),
  },
  'household-demo': {
    id: 'household-demo', name: 'Household sample', kind: 'household', role: 'editor', currency: 'USD',
    cash: c(25000), reserved: c(0), protected: c(0), available: c(25000), forecast: c(30000), nextPay: '2026-11-05',
    goals: [], transactions: [], preview: preview('household-demo', true),
  },
};
