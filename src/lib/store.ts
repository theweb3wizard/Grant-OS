import type { Grant } from './grants-data'
import { GRANTS } from './grants-data'

const STORAGE_KEY = 'grantos-state'

export interface ProjectProfile {
  projectName: string
  oneLiner: string
  category: string
  chains: string[]
  description: string
  metrics: {
    activeWallets: string
    tvlRevenue: string
    githubStars: string
  }
}

export type ApplicationStatus = 'interested' | 'drafting' | 'submitted' | 'review' | 'won' | 'lost'

export interface Application {
  id: string
  grantId: string
  status: ApplicationStatus
  amountRequested: number | null
  draftContent: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplicationWithGrant extends Application {
  grants: Grant | null
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  applicationId: string
  title: string
  dueDate: string
  completed: boolean
}

interface AppState {
  profile: ProjectProfile | null
  applications: Application[]
  milestones: Milestone[]
}

function defaultState(): AppState {
  return { profile: null, applications: [], milestones: [] }
}

function load(): AppState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return defaultState()
  }
}

function save(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function genId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getProfile(): ProjectProfile | null {
  return load().profile
}

export function saveProfile(profile: ProjectProfile) {
  const state = load()
  state.profile = profile
  save(state)
}

export function getApplications(): Application[] {
  return load().applications
}

export function getApplicationsWithGrants(): ApplicationWithGrant[] {
  const state = load()
  return state.applications.map(a => ({
    ...a,
    grants: GRANTS.find(g => g.id === a.grantId) || null,
    milestones: state.milestones.filter(m => m.applicationId === a.id),
  }))
}

export function addApplication(grantId: string) {
  const state = load()
  const existing = state.applications.find(a => a.grantId === grantId)
  if (existing) return existing

  const app: Application = {
    id: genId(),
    grantId,
    status: 'interested',
    amountRequested: null,
    draftContent: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  state.applications.push(app)
  save(state)
  return app
}

export function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const state = load()
  const app = state.applications.find(a => a.id === applicationId)
  if (!app) return
  app.status = status
  app.updatedAt = new Date().toISOString()
  save(state)
}

export function updateApplicationNotes(applicationId: string, notes: string) {
  const state = load()
  const app = state.applications.find(a => a.id === applicationId)
  if (!app) return
  app.notes = notes
  app.updatedAt = new Date().toISOString()
  save(state)
}

export function updateApplicationDraft(applicationId: string, content: string) {
  const state = load()
  const app = state.applications.find(a => a.id === applicationId)
  if (!app) return
  app.draftContent = content
  app.updatedAt = new Date().toISOString()
  save(state)
}

export function deleteApplication(applicationId: string) {
  const state = load()
  state.applications = state.applications.filter(a => a.id !== applicationId)
  state.milestones = state.milestones.filter(m => m.applicationId !== applicationId)
  save(state)
}

export function getMilestones(applicationId: string): Milestone[] {
  const state = load()
  return state.milestones.filter(m => m.applicationId === applicationId)
}

export function addMilestone(applicationId: string, title: string, dueDate: string) {
  const state = load()
  const milestone: Milestone = {
    id: genId(),
    applicationId,
    title,
    dueDate,
    completed: false,
  }
  state.milestones.push(milestone)
  save(state)
  return milestone
}

export function toggleMilestone(milestoneId: string, completed: boolean) {
  const state = load()
  const m = state.milestones.find(m => m.id === milestoneId)
  if (!m) return
  m.completed = completed
  save(state)
}

export function deleteMilestoneEntry(milestoneId: string) {
  const state = load()
  state.milestones = state.milestones.filter(m => m.id !== milestoneId)
  save(state)
}


