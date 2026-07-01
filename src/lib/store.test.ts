import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProfile,
  saveProfile,
  addApplication,
  getApplications,
  getApplicationsWithGrants,
  updateApplicationStatus,
  deleteApplication,
  addMilestone,
  getMilestones,
  toggleMilestone,
  deleteMilestoneEntry,
} from './store'

beforeEach(() => {
  localStorage.clear()
})

describe('store', () => {
  describe('profile', () => {
    it('returns null when no profile saved', () => {
      expect(getProfile()).toBeNull()
    })

    it('saves and retrieves profile', () => {
      const profile = {
        projectName: 'TestProject',
        oneLiner: 'A test project',
        category: 'DeFi',
        chains: ['Ethereum', 'Solana'],
        description: 'A detailed description of the test project that is long enough to pass validation.',
        metrics: { activeWallets: '1000', tvlRevenue: '$500k', githubStars: '50' },
      }
      saveProfile(profile)
      expect(getProfile()).toEqual(profile)
    })

    it('overwrites existing profile', () => {
      saveProfile({
        projectName: 'First',
        oneLiner: 'First project',
        category: 'DeFi',
        chains: ['Ethereum'],
        description: 'A'.repeat(100),
        metrics: { activeWallets: '', tvlRevenue: '', githubStars: '' },
      })
      saveProfile({
        projectName: 'Second',
        oneLiner: 'Second project',
        category: 'Infra',
        chains: ['Solana'],
        description: 'B'.repeat(100),
        metrics: { activeWallets: '500', tvlRevenue: '$1M', githubStars: '200' },
      })
      expect(getProfile()?.projectName).toBe('Second')
    })
  })

  describe('applications', () => {
    it('starts with empty applications', () => {
      expect(getApplications()).toEqual([])
    })

    it('adds an application for a grant', () => {
      const app = addApplication('grant-1')
      expect(app.grantId).toBe('grant-1')
      expect(app.status).toBe('interested')
      expect(getApplications()).toHaveLength(1)
    })

    it('does not duplicate applications for same grant', () => {
      addApplication('grant-1')
      addApplication('grant-1')
      expect(getApplications()).toHaveLength(1)
    })

    it('updates application status', () => {
      const app = addApplication('grant-1')
      updateApplicationStatus(app.id, 'submitted')
      expect(getApplications()[0].status).toBe('submitted')
    })

    it('deletes application and its milestones', () => {
      const app = addApplication('grant-1')
      addMilestone(app.id, 'Deliverable 1', '2026-12-31')
      deleteApplication(app.id)
      expect(getApplications()).toHaveLength(0)
      expect(getMilestones(app.id)).toHaveLength(0)
    })
  })

  describe('applications with grants', () => {
    it('joins grant data', () => {
      addApplication('optimism-retropgf-5')
      const apps = getApplicationsWithGrants()
      expect(apps[0].grants).not.toBeNull()
      expect(apps[0].grants?.name).toBe('Optimism RetroPGF Round 5')
    })

    it('returns null grant for unknown grantId', () => {
      addApplication('nonexistent-grant')
      const apps = getApplicationsWithGrants()
      expect(apps[0].grants).toBeNull()
    })
  })

  describe('milestones', () => {
    it('adds and retrieves milestones for an application', () => {
      const app = addApplication('grant-1')
      const milestone = addMilestone(app.id, 'Final Report', '2026-12-31')
      expect(milestone.title).toBe('Final Report')
      expect(milestone.completed).toBe(false)
      expect(getMilestones(app.id)).toHaveLength(1)
    })

    it('only returns milestones for the requested application', () => {
      const app1 = addApplication('grant-1')
      const app2 = addApplication('grant-2')
      addMilestone(app1.id, 'M1', '2026-01-01')
      addMilestone(app2.id, 'M2', '2026-02-01')
      expect(getMilestones(app1.id)).toHaveLength(1)
      expect(getMilestones(app2.id)).toHaveLength(1)
    })

    it('toggles milestone completion', () => {
      const app = addApplication('grant-1')
      const milestone = addMilestone(app.id, 'Test', '2026-12-31')
      toggleMilestone(milestone.id, true)
      expect(getMilestones(app.id)[0].completed).toBe(true)
      toggleMilestone(milestone.id, false)
      expect(getMilestones(app.id)[0].completed).toBe(false)
    })

    it('deletes a milestone', () => {
      const app = addApplication('grant-1')
      const milestone = addMilestone(app.id, 'Delete me', '2026-12-31')
      expect(getMilestones(app.id)).toHaveLength(1)
      deleteMilestoneEntry(milestone.id)
      expect(getMilestones(app.id)).toHaveLength(0)
    })
  })
})
