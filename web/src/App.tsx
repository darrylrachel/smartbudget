import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Link, NavLink, Navigate, Route, Routes, useBlocker, useLocation, useNavigate, useParams } from 'react-router-dom'
import { formatMoney, type Cents } from './domain/money'
import { validateDraft } from './domain/contracts'
import { loadSnapshot } from './data/mockRepository'
import type { WorkspaceSnapshot } from './data/repository'
import { lessons } from './content/catalog'
import { usePwa } from './pwa'
import { UserMenu } from './UserMenu'

const destinations = [
	['/', 'Home', '⌂'],
	['/plan', 'Plan', '▤'],
	['/activity', 'Activity', '↔'],
	['/goals', 'Goals', '◎'],
	['/learn', 'Learn', '◇'],
]
const titles: Record<string, string> = {
	'/': 'A little clarity for payday',
	'/plan': 'Give each dollar a job',
	'/activity': 'Your activity',
	'/goals': 'Room for what matters',
	'/learn': 'Small lessons. Lasting confidence.',
	'/plan/review': 'Review your sample plan',
	'/transactions/new': 'Try a sample expense',
	'/household': 'Shared plans, clear boundaries',
	'/settings': 'Make yourself at home',
	'/onboarding': 'Start where you are',
}
function Money({ value, large = false }: { value: Cents; large?: boolean }) {
	return <span className={large ? 'money large' : 'money'}>{formatMoney(value)}</span>
}
function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <section className={`card ${className}`}>{children}</section>
}
function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
	return (
		<div
			className={`notice ${error ? 'error' : ''}`}
			role={error ? 'alert' : 'status'}
		>
			{children}
		</div>
	)
}
function Unavailable({ children }: { children: ReactNode }) {
	return (
		<>
			<button disabled>{children} — unavailable in sample</button>
			<p className='small'>Nothing is saved or sent in this foundation.</p>
		</>
	)
}
function Breakdown({ data }: { data: WorkspaceSnapshot }) {
	return (
		<dl className='breakdown'>
			<div>
				<dt>Eligible posted cash</dt>
				<dd>
					<Money value={data.cash} />
				</dd>
			</div>
			<div>
				<dt>Already reserved</dt>
				<dd>
					<Money value={data.reserved} />
				</dd>
			</div>
			<div className='sub'>
				<dt>Buffer included in reserved</dt>
				<dd>
					<Money value={data.protected} />
				</dd>
			</div>
			<div className='total'>
				<dt>Available new funding</dt>
				<dd>
					<Money value={data.available} />
				</dd>
			</div>
		</dl>
	)
}

export default function App() {
	const [workspace, setWorkspace] = useState('personal-demo')
	const [loaded, setLoaded] = useState<WorkspaceSnapshot | null>(null)
	const [error, setError] = useState(false)
	const [retry, setRetry] = useState(0)
	const [dirty, setDirty] = useState(false)
	const [completed, setCompleted] = useState<string[]>([])
	const [confirm, setConfirm] = useState<'workspace' | 'update' | null>(null)
	const dialog = useRef<HTMLDialogElement>(null)
	const switchButton = useRef<HTMLButtonElement>(null)
	const updateButton = useRef<HTMLButtonElement>(null)
	const main = useRef<HTMLElement>(null)
	const location = useLocation(),
		navigate = useNavigate()
	const initialLocation = useRef(location.key)
	const pwa = usePwa()
	const data = loaded?.id === workspace ? loaded : null
	const title =
		titles[location.pathname] ??
		(location.pathname.startsWith('/learn/') ? 'A little learning goes a long way' : location.pathname.startsWith('/goals/') ? 'Your goal, at your pace' : 'Page not found')
	useEffect(() => {
		const controller = new AbortController()
		setError(false)
		void loadSnapshot(workspace, controller.signal)
			.then((snapshot) => {
				if (!controller.signal.aborted) setLoaded(snapshot)
			})
			.catch((reason) => {
				if (reason.name !== 'AbortError') setError(true)
			})
		return () => controller.abort()
	}, [workspace, retry])
	useEffect(() => {
		document.title = `${title} · SmartBudget`
		if (location.key !== initialLocation.current) main.current?.focus()
	}, [location.key, location.pathname, title, workspace])
	useEffect(() => {
		const warn = (event: BeforeUnloadEvent) => {
			if (dirty) event.preventDefault()
		}
		window.addEventListener('beforeunload', warn)
		return () => window.removeEventListener('beforeunload', warn)
	}, [dirty])
	useEffect(() => {
		if (confirm) dialog.current?.showModal()
		else dialog.current?.close()
	}, [confirm])
	function closeDialog() {
		const previous = confirm
		setConfirm(null)
		dialog.current?.close()
		;(previous === 'update' ? updateButton : switchButton).current?.focus()
	}
	const workspaceLabel = workspace === 'personal-demo' ? 'Personal sample' : 'Household sample'
	return (
		<>
			<a
				className='skip'
				href='#main'
			>
				Skip to content
			</a>
			<aside className='sidebar'>
				<Link
					to='/'
					className='brand'
				>
					<span
						className='brand-mark'
						aria-hidden='true'
					>
						s
					</span>{' '}
					smartbudget<span className='brand-dot'>.</span>
				</Link>
				<p className='eyebrow sidebar-caption'>A LITTLE MORE PEACE OF MIND</p>
				<Navigation />
				<div className='sidebar-bottom'>
					<Link to='/household'>Household</Link>
					<Link to='/settings'>Settings & install</Link>
					<div className='sidebar-note'>
						<span aria-hidden='true'>✦</span>
						<p>
							Progress starts with
							<br />
							one small step.
						</p>
					</div>
				</div>
			</aside>
			<div className='workspace'>
				<header className='topbar'>
					<div>
						<span
							className='workspace-icon'
							aria-hidden='true'
						>
							{workspace === 'personal-demo' ? '◉' : '♧'}
						</span>
						<strong>{workspaceLabel}</strong>
						<span className='workspace-kind'>{workspace === 'personal-demo' ? 'Private workspace demo' : 'Separate shared ledger demo'}</span>
					</div>
					<UserMenu triggerRef={switchButton} onSwitchWorkspace={() => setConfirm('workspace')} />
				</header>
				<div className='sample-banner'>
					Sample data • Changes are not saved.
					<Link to='/onboarding'>
						How this works <span aria-hidden='true'>↗</span>
					</Link>
				</div>
				{pwa.waiting && (
					<div
						className='update-banner'
						role='status'
					>
						Update available. Reloading clears sample progress and drafts.{' '}
						<button
							ref={updateButton}
							className='button quiet'
							onClick={() => setConfirm('update')}
						>
							Review update
						</button>
					</div>
				)}
				<main
					id='main'
					ref={main}
					tabIndex={-1}
				>
					<div className='page-heading'>
						<div>
							<p className='eyebrow'>{location.pathname.startsWith('/learn') ? 'SMARTBUDGET ACADEMY' : 'YOUR MONEY, WITH INTENTION'}</p>
							<h1>{title}</h1>
							<p className='intro'>
								{location.pathname === '/' ? 'See what’s covered. Make room for what’s next.' : `${workspaceLabel} · ${data?.role ?? 'Sample'} role (illustrative only)`}
							</p>
						</div>
						<span className='date-chip'>SAMPLE · OCT 22, 2026</span>
					</div>
					{pwa.offline ? (
						<Card>
							<h2>You’re offline</h2>
							<p>Connect to load your budget. Only the public app shell is available offline. Financial changes cannot be queued.</p>
							<Link to='/settings'>Installation & privacy help</Link>
						</Card>
					) : error ? (
						<Notice error>
							We couldn’t load this sample. <button onClick={() => setRetry((value) => value + 1)}>Retry</button>
						</Notice>
					) : !data ? (
						<p role='status'>Loading your sample workspace…</p>
					) : (
						<div key={workspace}>
							<Routes>
								<Route
									path='/'
									element={<Home data={data} />}
								/>
								<Route
									path='/plan'
									element={<Plan data={data} />}
								/>
								<Route
									path='/plan/review'
									element={
										<Plan
											data={data}
											review
										/>
									}
								/>
								<Route
									path='/activity'
									element={<Activity data={data} />}
								/>
								<Route
									path='/transactions/new'
									element={
										<Entry
											workspace={workspace}
											dirty={dirty}
											setDirty={setDirty}
										/>
									}
								/>
								<Route
									path='/goals'
									element={<Goals data={data} />}
								/>
								<Route
									path='/goals/:id'
									element={<GoalDetail data={data} />}
								/>
								<Route
									path='/learn'
									element={<Learn completed={completed} />}
								/>
								<Route
									path='/learn/:slug'
									element={
										<Lesson
											completed={completed}
											complete={(slug) => setCompleted((previous) => (previous.includes(slug) ? previous : [...previous, slug]))}
										/>
									}
								/>
								<Route
									path='/settings'
									element={<Settings pwa={pwa} />}
								/>
								<Route
									path='/household'
									element={<Household data={data} />}
								/>
								<Route
									path='/onboarding'
									element={<Onboarding />}
								/>
								<Route
									path='/plan-review'
									element={
										<Navigate
											to='/plan/review'
											replace
										/>
									}
								/>
								<Route
									path='/transaction/new'
									element={
										<Navigate
											to='/transactions/new'
											replace
										/>
									}
								/>
								<Route
									path='*'
									element={
										<Card>
											<h2>This page isn’t here</h2>
											<Link to='/'>Return home</Link>
										</Card>
									}
								/>
							</Routes>
						</div>
					)}
					<footer className='page-footer'>
						<span>Small steps. A clearer tomorrow.</span>
						<Link to='/settings'>Privacy & sample limitations</Link>
					</footer>
				</main>
			</div>
			<nav
				className='mobile-nav'
				aria-label='Mobile navigation'
			>
				{destinations.map(([to, label, icon]) => (
					<NavLink
						key={to}
						to={to}
						end={to === '/'}
					>
						<span aria-hidden='true'>{icon}</span>
						{label}
					</NavLink>
				))}
			</nav>
			<dialog
				ref={dialog}
				aria-labelledby='dialog-title'
				onCancel={(event) => {
					event.preventDefault()
					closeDialog()
				}}
				onClose={() => setConfirm(null)}
			>
				<h2 id='dialog-title'>{confirm === 'update' ? 'Update SmartBudget?' : 'Switch sample workspace?'}</h2>
				<p>
					{confirm === 'update'
						? 'Reloading discards open drafts and resets in-memory lesson completion.'
						: 'Open details and unsaved sample forms will be discarded. Personal and household finances remain separate.'}
				</p>
				<div className='actions'>
					<button
						className='button'
						onClick={() => {
							if (confirm === 'update') {
								flushSync(() => setDirty(false))
								pwa.update()
							} else {
								flushSync(() => {
									setLoaded(null)
									setDirty(false)
								})
								setWorkspace(workspace === 'personal-demo' ? 'household-demo' : 'personal-demo')
								navigate('/')
								setConfirm(null)
							}
						}}
					>
						{confirm === 'update' ? 'Discard and update' : `Discard and open ${workspace === 'personal-demo' ? 'Household' : 'Personal'} sample`}
					</button>
					<button
						className='button secondary'
						autoFocus
						onClick={closeDialog}
					>
						Keep current {confirm === 'update' ? 'version' : 'workspace'}
					</button>
				</div>
			</dialog>
		</>
	)
}
function Navigation() {
	return (
		<nav aria-label='Main navigation'>
			{destinations.map(([to, label, icon]) => (
				<NavLink
					key={to}
					to={to}
					end={to === '/'}
				>
					<span aria-hidden='true'>{icon}</span>
					{label}
				</NavLink>
			))}
		</nav>
	)
}
function Home({ data }: { data: WorkspaceSnapshot }) {
	return (
		<div className='dashboard'>
			<div className='main-column'>
				<Card className='cash-card'>
					<div className='card-top'>
						<span className='eyebrow'>AVAILABLE TO ASSIGN</span>
						<span className='pill'>This pay period</span>
					</div>
					<Money
						large
						value={data.available}
					/>
					<p>Money that’s ready for its next job.</p>
					<Breakdown data={data} />
					<div className='cash-bottom'>
						<Link
							className='button'
							to='/plan/review'
						>
							Review this paycheck <span aria-hidden='true'>→</span>
						</Link>
						<span className='small'>Oct 22 – Nov 5 · End date excluded</span>
					</div>
				</Card>
				{data.preview.unmet.length > 0 && <Notice>This sample leaves $150.00 of essential utilities unfunded. Review the shortfall before planning further.</Notice>}
				<Card>
					<div className='section-heading'>
						<h2>A plan for the essentials</h2>
						<Link to='/plan'>
							View plan <span aria-hidden='true'>→</span>
						</Link>
					</div>
					<p className='muted'>A hand-authored sample of how needs come first.</p>
					<div className='allocation-list'>
						{data.preview.additions.slice(0, 3).map((row, index) => (
							<div
								className='allocation-line'
								key={row.envelopeId}
							>
								<span
									className='number-icon'
									aria-hidden='true'
								>
									0{index + 1}
								</span>
								<div>
									<strong>{envelopeName(row.envelopeId)}</strong>
									<p>
										{row.reason === 'DUE_ESSENTIAL' ? 'Due before your next paycheck' : row.reason === 'BUFFER_TOP_UP' ? 'A little breathing room' : 'For the everyday essentials'}
									</p>
								</div>
								<Money value={row.amount} />
							</div>
						))}
					</div>
				</Card>
				<Card className='soft-card'>
					<div className='section-heading'>
						<div>
							<p className='eyebrow'>ONE STEP AT A TIME</p>
							<h2>Your plan can grow with you.</h2>
							<p>You don’t need a perfect budget to begin.</p>
						</div>
						<span
							className='sprout'
							aria-hidden='true'
						>
							♧
						</span>
					</div>
					<Link to='/onboarding'>Explore how SmartBudget works →</Link>
				</Card>
			</div>
			<div className='rail'>
				<Card>
					<span
						className='icon-tile'
						aria-hidden='true'
					>
						↗
					</span>
					<p className='eyebrow'>NEXT EXPECTED PAYCHECK</p>
					<h2>November 5</h2>
					<Money value={data.forecast} />
					<p className='small'>Expected income — not available yet. Forecasts never increase available cash.</p>
					<span className='pill neutral'>Forecast only</span>
				</Card>
				<Card>
					<div className='section-heading'>
						<h2>A little breathing room</h2>
						<span aria-hidden='true'>◎</span>
					</div>
					{data.goals.length ? (
						<>
							<p>Sample savings goal</p>
							<Money value={data.goals[0].reserved} />
							<span className='small'> of {formatMoney(data.goals[0].target)}</span>
							<progress
								value={data.goals[0].reserved}
								max={data.goals[0].target}
								aria-label='Goal reserved progress'
							/>
							<p className='small'>Reserved money is already included in your budget.</p>
							<Link to={`/goals/${data.goals[0].id}`}>See your goal →</Link>
						</>
					) : (
						<>
							<p>No shared goals yet. Personal goals stay private.</p>
							<Link to='/goals'>Explore goals →</Link>
						</>
					)}
				</Card>
				<Card className='learn-card'>
					<span className='pill'>4 MINUTE SAMPLE</span>
					<h2>Your balance isn’t your budget.</h2>
					<p>Meet envelopes: a simple way to give your money a purpose.</p>
					<Link to='/learn/envelopes'>
						Learn something small <span aria-hidden='true'>→</span>
					</Link>
				</Card>
			</div>
		</div>
	)
}
function envelopeName(id: string) {
	const suffix = id.replace(/^(personal|shared)-/, '')
	return (
		({ rent: 'Rent & housing', food: 'Food & transport', buffer: 'Protected buffer', goal: 'Savings goal', flexible: 'Flexible spending', utilities: 'Utilities' } as Record<string, string>)[
			suffix
		] ?? suffix
	)
}
function Plan({ data, review = false }: { data: WorkspaceSnapshot; review?: boolean }) {
	return (
		<>
			<Notice>Hand-authored sample output, not an implemented allocation engine. Period, weights and allocations are read-only.</Notice>
			<div className='plan-grid'>
				<Card>
					<p className='eyebrow'>OCTOBER 22 – NOVEMBER 5, 2026</p>
					<h2>{review ? 'Check each dollar’s next job' : 'Essentials first. Your priorities next.'}</h2>
					<p>November 5 is excluded. Percentages apply only after needs and the buffer.</p>
					<div className='allocation-list'>
						{data.preview.additions.map((row) => (
							<div
								className='demand'
								key={row.envelopeId}
							>
								<div className='section-heading'>
									<h3>{envelopeName(row.envelopeId)}</h3>
									<Money value={row.amount} />
								</div>
								<details>
									<summary>Why this amount?</summary>
									<p>{row.explanation}</p>
									<p className='small'>Reason: {row.reason}</p>
								</details>
							</div>
						))}
					</div>
					{data.preview.unmet.map((row) => (
						<Notice key={row.requestId}>
							Unmet essential need: <Money value={row.amount} />. A future live plan requires acknowledgment.
						</Notice>
					))}
				</Card>
				<Card className='plan-summary'>
					<h2>Your sample snapshot</h2>
					<p className='small'>{data.name} · Oct 22, 2026 · Fixture version 1</p>
					<Breakdown data={data} />
					<dl className='breakdown'>
						<div>
							<dt>Requested new funding</dt>
							<dd>{data.kind === 'household' ? '$400.00' : '$800.00'}</dd>
						</div>
						<div>
							<dt>Proposed additions</dt>
							<dd>
								<Money value={data.available} />
							</dd>
						</div>
						<div>
							<dt>Unassigned remainder</dt>
							<dd>
								<Money value={data.preview.unassigned} />
							</dd>
						</div>
					</dl>
					{review ? (
						<Unavailable>Accept allocations</Unavailable>
					) : (
						<Link
							className='button'
							to='/plan/review'
						>
							Review sample plan →
						</Link>
					)}
					<p className='small'>Allocations are bookkeeping. No bank money is moved.</p>
				</Card>
			</div>
		</>
	)
}
function Activity({ data }: { data: WorkspaceSnapshot }) {
	const [filter, setFilter] = useState('all'),
		[query, setQuery] = useState(''),
		[error, setError] = useState(false)
	const rows = data.transactions.filter((row) => (filter === 'all' || row.type === filter) && row.title.toLowerCase().includes(query.toLowerCase()))
	return (
		<>
			<div className='section-heading'>
				<p className='intro'>Sample checking · October 2026 · Incomplete fixture history</p>
				<Link
					className='button'
					to='/transactions/new'
				>
					Try an expense entry +
				</Link>
			</div>
			<Card>
				<div className='filters'>
					<label>
						Search activity
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder='Find a sample entry'
						/>
					</label>
					<label>
						Entry type
						<select
							value={filter}
							onChange={(event) => setFilter(event.target.value)}
						>
							<option value='all'>All entries</option>
							<option value='income'>Income</option>
							<option value='expense'>Expenses</option>
						</select>
					</label>
				</div>
				{error ? (
					<Notice error>
						Simulated loading error. No data changed.{' '}
						<button
							className='button secondary'
							onClick={() => setError(false)}
						>
							Retry activity
						</button>
					</Notice>
				) : rows.length ? (
					<table>
						<caption className='sr-only'>Posted sample transactions</caption>
						<thead>
							<tr>
								<th scope='col'>Entry</th>
								<th scope='col'>Date</th>
								<th scope='col'>Account</th>
								<th scope='col'>Amount</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.id}>
									<td data-label='Entry'>
										<strong>{row.title}</strong>
										<span className='small'>{row.type}</span>
									</td>
									<td data-label='Date'>{row.date}</td>
									<td data-label='Account'>{row.account}</td>
									<td data-label='Amount'>
										<Money value={row.amount} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className='empty'>
						<span aria-hidden='true'>↔</span>
						<h2>No {data.kind === 'household' ? 'shared ' : ''}activity to show</h2>
						<p>{query || filter !== 'all' ? 'Try a different search or entry type.' : 'Private personal activity never appears in the household workspace.'}</p>
					</div>
				)}
				<button
					className='button quiet'
					onClick={() => setError(true)}
				>
					Preview recoverable error
				</button>
			</Card>
		</>
	)
}
function Entry({ workspace, dirty, setDirty }: { workspace: string; dirty: boolean; setDirty: (value: boolean) => void }) {
	const [amount, setAmount] = useState(''),
		[date, setDate] = useState('2026-10-22'),
		[errors, setErrors] = useState<{ amount?: string; date?: string }>({}),
		[valid, setValid] = useState(false),
		[discard, setDiscard] = useState(false)
	const amountField = useRef<HTMLInputElement>(null),
		dateField = useRef<HTMLInputElement>(null)
	const navigate = useNavigate()
	const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname)
	const leaveDialog = useRef<HTMLDialogElement>(null)
	useEffect(() => {
		if (blocker.state === 'blocked') leaveDialog.current?.showModal()
		else leaveDialog.current?.close()
	}, [blocker.state])
	useEffect(() => () => setDirty(false), [setDirty])
	function submit(event: FormEvent) {
		event.preventDefault()
		const next: typeof errors = {}
		try {
			validateDraft({ workspaceId: workspace, amount, date: '2026-10-22' })
		} catch (error) {
			next.amount = (error as Error).message
		}
		try {
			validateDraft({ workspaceId: workspace, amount: '1', date })
		} catch (error) {
			next.date = (error as Error).message
		}
		setErrors(next)
		setValid(!next.amount && !next.date)
		if (next.amount) amountField.current?.focus()
		else if (next.date) dateField.current?.focus()
	}
	return (
		<Card className='narrow'>
			<Notice>Local validation demo. Use fictional amounts. No account or ledger changes.</Notice>
			<form
				onSubmit={submit}
				noValidate
			>
				<label>
					Workspace
					<input
						readOnly
						value={workspace === 'personal-demo' ? 'Personal sample' : 'Household sample'}
					/>
				</label>
				<label>
					Amount in USD
					<input
						ref={amountField}
						value={amount}
						inputMode='decimal'
						placeholder='12.50'
						aria-invalid={!!errors.amount}
						aria-describedby={errors.amount ? 'amount-error' : 'amount-help'}
						onChange={(event) => {
							setAmount(event.target.value)
							setDirty(true)
							setValid(false)
							setErrors({})
						}}
					/>
				</label>
				<p
					id='amount-help'
					className='small'
				>
					Use dollars with up to two decimal places.
				</p>
				{errors.amount && (
					<p
						id='amount-error'
						className='field-error'
						role='alert'
					>
						{errors.amount}
					</p>
				)}
				<label>
					Posted date
					<input
						ref={dateField}
						type='text'
						value={date}
						placeholder='YYYY-MM-DD'
						aria-invalid={!!errors.date}
						aria-describedby='date-help'
						onChange={(event) => {
							setDate(event.target.value)
							setDirty(true)
							setValid(false)
							setErrors({})
						}}
					/>
				</label>
				<p
					id='date-help'
					className='small'
				>
					YYYY-MM-DD
					{errors.date && (
						<span
							className='field-error'
							role='alert'
						>
							{' '}
							· {errors.date}
						</span>
					)}
				</p>
				<div className='actions'>
					<button
						className='button'
						type='submit'
					>
						Check sample entry
					</button>
					<button
						type='button'
						className='button secondary'
						onClick={() => (dirty ? setDiscard(true) : navigate('/activity'))}
					>
						Cancel entry
					</button>
				</div>
				{valid && <Notice>Sample entry is valid. Nothing was saved or posted.</Notice>}
				<Unavailable>Save expense</Unavailable>
			</form>
			<dialog
				ref={leaveDialog}
				aria-labelledby='leave-title'
				onCancel={(event) => {
					event.preventDefault()
					if (blocker.state === 'blocked') blocker.reset()
				}}
			>
				<h2 id='leave-title'>Discard this unsaved sample draft?</h2>
				<p>Your sample entry will be cleared when you leave.</p>
				<div className='actions'>
					<button
						className='button'
						onClick={() => {
							setDirty(false)
							if (blocker.state === 'blocked') blocker.proceed()
						}}
					>
						Discard and leave
					</button>
					<button
						className='button secondary'
						autoFocus
						onClick={() => {
							if (blocker.state === 'blocked') blocker.reset()
						}}
					>
						Keep editing draft
					</button>
				</div>
			</dialog>
			{discard && (
				<Notice>
					Discard this unsaved sample draft?
					<div className='actions'>
						<button
							className='button'
							onClick={() => {
								flushSync(() => setDirty(false))
								navigate('/activity')
							}}
						>
							Discard draft
						</button>
						<button
							className='button secondary'
							onClick={() => setDiscard(false)}
						>
							Keep editing
						</button>
					</div>
				</Notice>
			)}
		</Card>
	)
}
function Goals({ data }: { data: WorkspaceSnapshot }) {
	return (
		<div className='goal-grid'>
			{data.goals.length ? (
				data.goals.map((goal) => (
					<Card key={goal.id}>
						<span
							className='icon-tile'
							aria-hidden='true'
						>
							◎
						</span>
						<h2>{goal.title}</h2>
						<Money
							large
							value={goal.reserved}
						/>
						<p>
							of {formatMoney(goal.target)} target · {goal.targetDate}
						</p>
						<progress
							value={goal.reserved}
							max={goal.target}
							aria-label={`${goal.title} reserved progress`}
						/>
						<p className='small'>Goal reserves are part of existing reservations.</p>
						<Link to={`/goals/${goal.id}`}>Explore this goal →</Link>
					</Card>
				))
			) : (
				<Card>
					<h2>No shared goals yet</h2>
					<p>Personal goals stay in your personal workspace.</p>
				</Card>
			)}
		</div>
	)
}
function GoalDetail({ data }: { data: WorkspaceSnapshot }) {
	const { id } = useParams()
	const goal = data.goals.find((goal) => goal.id === id)
	return (
		<Card className='narrow'>
			{goal ? (
				<>
					<h2>{goal.title}</h2>
					<Money
						large
						value={goal.reserved}
					/>
					<p>
						Reserved of {formatMoney(goal.target)} · Target {goal.targetDate}
					</p>
					<Unavailable>Contribute</Unavailable>
				</>
			) : (
				<Notice error>Goal unavailable in this workspace.</Notice>
			)}
			<Link to='/goals'>Back to goals</Link>
		</Card>
	)
}
function Learn({ completed }: { completed: string[] }) {
	return (
		<>
			<Card className='learn-hero'>
				<div>
					<p className='eyebrow'>A LITTLE KNOWLEDGE, AT YOUR PACE</p>
					<h2>Give your money a purpose.</h2>
					<p>Try the Envelopes sample. No perfect score required.</p>
					<Link
						className='button'
						to='/learn/envelopes'
					>
						{completed.includes('envelopes') ? 'Revisit sample lesson' : 'Start sample lesson'} →
					</Link>
				</div>
				<span
					className='book-art'
					aria-hidden='true'
				>
					◇
				</span>
			</Card>
			<p className='small'>
				{completed.length} sample lesson completed · Progress is private, in memory, and resets on reload. Catalog: 14 unpublished topics and one sample; none are reviewed publications.
			</p>
			<div className='lesson-grid'>
				{lessons.map((lesson) => (
					<Card key={lesson.id}>
						<div className='section-heading'>
							<span className='eyebrow'>{lesson.id} / 15</span>
							<span className='pill neutral'>{completed.includes(lesson.slug) ? 'Sample completed' : lesson.status === 'sample' ? 'Sample reader' : 'Unpublished'}</span>
						</div>
						<h2>{lesson.title}</h2>
						<p>{lesson.summary}</p>
						<p className='small'>
							{lesson.minutes} min · {lesson.version}
						</p>
						<Link to={`/learn/${lesson.slug}`}>{lesson.status === 'sample' ? 'Read sample' : 'View topic details'} →</Link>
					</Card>
				))}
			</div>
		</>
	)
}
function Lesson({ completed, complete }: { completed: string[]; complete: (slug: string) => void }) {
	const { slug } = useParams()
	const lesson = lessons.find((lesson) => lesson.slug === slug)
	const [answer, setAnswer] = useState('')
	if (!lesson)
		return (
			<Card>
				<h2>Lesson unavailable</h2>
				<Link to='/learn'>Back to Learn</Link>
			</Card>
		)
	return (
		<Card
			className='reader'
			key={slug}
		>
			<Link to='/learn'>← All lessons</Link>
			<h2>{lesson.title}</h2>
			<p className='eyebrow'>
				{lesson.minutes} MIN · {lesson.version}
			</p>
			<h3>What you’ll explore</h3>
			<p>{lesson.objective}</p>
			{lesson.status !== 'sample' ? (
				<Notice>Unpublished content. The manuscript and review sources are not available yet.</Notice>
			) : (
				<>
					<Notice>Sample manuscript • Not reviewed for publication.</Notice>
					<h3>A balance is only the beginning</h3>
					<p>
						Imagine you have $100 of fictional cash. You reserve $60 for groceries and $25 for transport. Your cash is still $100, but only $15 has no job yet. Reserving money does not
						move it between bank accounts.
					</p>
					<h3>One dollar, one job</h3>
					<p>An envelope is a label for money you already have. Goal and buffer envelopes are part of your reservations, never extra cash. Expected pay is a forecast until it arrives.</p>
					<fieldset>
						<legend>Optional practice: how much is unassigned?</legend>
						{['$100', '$15', '$85'].map((value) => (
							<label
								className='radio'
								key={value}
							>
								<input
									type='radio'
									name='practice'
									value={value}
									checked={answer === value}
									onChange={() => setAnswer(value)}
								/>
								{value}
							</label>
						))}
					</fieldset>
					{answer && <Notice>{answer === '$15' ? 'That’s it.' : 'Try subtracting both reservations.'} $100 − $60 − $25 = $15 unassigned. The same money cannot be counted twice.</Notice>}
					<button
						className='button'
						onClick={() => complete(lesson.slug)}
						disabled={completed.includes(lesson.slug)}
					>
						{completed.includes(lesson.slug) ? 'Sample completed' : 'Mark sample complete'}
					</button>
					<p
						className='small'
						role='status'
					>
						Progress is in memory and resets on reload. Completion never changes finances. You can complete without answering.
					</p>
				</>
			)}
			<p className='small'>Review date: not reviewed. Sources: not yet supplied. Publication requires editorial and source review.</p>
		</Card>
	)
}
function Settings({ pwa }: { pwa: ReturnType<typeof usePwa> }) {
	return (
		<div className='goal-grid'>
			<Card>
				<h2>Install SmartBudget</h2>
				<p>Installation is optional. The browser experience stays available.</p>
				{pwa.install ? (
					<button
						className='button'
						onClick={() => void pwa.requestInstall()}
					>
						Install app
					</button>
				) : (
					<p>
						Use your browser’s Install app option where offered. On iPhone or iPad, open Safari’s Share menu and choose Add to Home Screen. Availability depends on your browser and device.
					</p>
				)}
				<p role='status'>{pwa.installMessage}</p>
				<p className='small'>Offline: public shell and help only. Connect to load your budget. Updates ask before reloading and discarding drafts.</p>
			</Card>
			<Card>
				<h2>Your privacy, by design</h2>
				<p>This foundation has no sign-in, backend or financial persistence. Personal and shared sample records are separate. Illustrative roles do not enforce real authorization.</p>
				<p>Money, lesson progress and drafts are held in memory. No financial payloads or tokens are saved in browser caches or storage.</p>
				<Unavailable>Export data</Unavailable>
				<Unavailable>Delete account</Unavailable>
			</Card>
		</div>
	)
}
function Household({ data }: { data: WorkspaceSnapshot }) {
	return (
		<Card className='narrow'>
			<h2>A separate shared ledger</h2>
			<p>Household membership never exposes personal finances. Recording a shared contribution is bookkeeping; it does not move bank money.</p>
			<p>
				Current workspace: <strong>{data.name}</strong>. Role: {data.role} (illustrative only).
			</p>
			<Notice>Fixture selection is not authorization. Real memberships, invitations and owner/editor/viewer permissions arrive in a later phase.</Notice>
			<Unavailable>Invite household member</Unavailable>
		</Card>
	)
}
function Onboarding() {
	return (
		<Card className='reader'>
			<h2>One paycheck. One clear next step.</h2>
			<ol className='steps'>
				<li>
					<h3>Start with money you have</h3>
					<p>Enter actual received pay later. Expected income stays a forecast.</p>
				</li>
				<li>
					<h3>Cover what comes before payday</h3>
					<p>Essentials first, then a buffer, goals and flexible spending.</p>
				</li>
				<li>
					<h3>Keep shared money separate</h3>
					<p>Choose a personal or household workspace. Never combine balances.</p>
				</li>
				<li>
					<h3>Learn as you go</h3>
					<p>Short lessons explain the why. Sample changes are never saved.</p>
				</li>
			</ol>
			<Link
				className='button'
				to='/plan'
			>
				Explore a sample plan →
			</Link>
		</Card>
	)
}
