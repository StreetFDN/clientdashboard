export interface GitHubActivity {
  id: string
  type: 'commit' | 'pull_request' | 'issue' | 'release' | 'discussion'
  title: string
  description?: string
  author: {
    name: string
    avatar?: string
    username: string
  }
  repository: string
  url: string
  timestamp: string
  stats?: {
    additions?: number
    deletions?: number
    changed_files?: number
    comments?: number
  }
}

export interface GitHubActivitySummary {
  period: {
    start: string
    end: string
    label: string // e.g., "This Week", "Last Week"
  }
  total_activities: number
  commits: number
  pull_requests: number
  issues: number
  releases: number
  activities: GitHubActivity[]
  contributors: {
    username: string
    name: string
    avatar?: string
    contributions: number
  }[]
  repositories: {
    name: string
    url: string
    activity_count: number
  }[]
}

export interface GitHubAppInstallation {
  installed: boolean
  installation_id?: string
  account?: {
    login: string
    type: string
  }
  permissions?: {
    metadata: string
    contents: string
    pull_requests: string
    issues: string
  }
}

