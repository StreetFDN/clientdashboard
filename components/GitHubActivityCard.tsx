'use client'

import { Github, GitCommit, GitPullRequest, AlertCircle, Tag, MessageSquare, Calendar, User, ExternalLink } from 'lucide-react'
import type { GitHubActivity, GitHubActivitySummary } from '@/types/github'
import Link from 'next/link'

interface GitHubActivityCardProps {
  activity: GitHubActivity
}

export function GitHubActivityCard({ activity }: GitHubActivityCardProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'commit':
        return <GitCommit className="w-4 h-4" />
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4" />
      case 'issue':
        return <AlertCircle className="w-4 h-4" />
      case 'release':
        return <Tag className="w-4 h-4" />
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Github className="w-4 h-4" />
    }
  }

  const getTypeLabel = () => {
    switch (activity.type) {
      case 'commit':
        return 'Commit'
      case 'pull_request':
        return 'Pull Request'
      case 'issue':
        return 'Issue'
      case 'release':
        return 'Release'
      case 'discussion':
        return 'Discussion'
      default:
        return 'Activity'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Link
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card p-4 hover:bg-[#3a3a38] transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center flex-shrink-0 text-[#d4d4d1] group-hover:text-[#FAF9F6] transition-colors">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-[#FAF9F6] group-hover:text-[#0066cc] transition-colors line-clamp-2">
              {activity.title}
            </h4>
            <ExternalLink className="w-3 h-3 text-[#d4d4d1] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {activity.description && (
            <p className="text-xs text-[#d4d4d1] line-clamp-2 mb-2">
              {activity.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-[#d4d4d1]">
            <span className="flex items-center gap-1">
              <span className="text-[#0066cc]">{getTypeLabel()}</span>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{activity.author.name || activity.author.username}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(activity.timestamp)}</span>
            </span>
            {activity.stats && (
              <>
                {activity.stats.additions !== undefined && (
                  <span className="text-green-400">+{activity.stats.additions}</span>
                )}
                {activity.stats.deletions !== undefined && (
                  <span className="text-red-400">-{activity.stats.deletions}</span>
                )}
                {activity.stats.comments !== undefined && activity.stats.comments > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{activity.stats.comments}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface GitHubActivitySummaryCardProps {
  summary: GitHubActivitySummary
}

export function GitHubActivitySummaryCard({ summary }: GitHubActivitySummaryCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#FAF9F6] mb-1">
            {summary.period.label}
          </h3>
          <p className="text-xs text-[#d4d4d1]">
            {new Date(summary.period.start).toLocaleDateString()} - {new Date(summary.period.end).toLocaleDateString()}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center">
          <Github className="w-6 h-6 text-[#0066cc]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card p-3 bg-[#262624]">
          <p className="text-xs text-[#d4d4d1] mb-1">Total Activities</p>
          <p className="text-2xl font-semibold text-[#FAF9F6]">{summary.total_activities}</p>
        </div>
        <div className="card p-3 bg-[#262624]">
          <p className="text-xs text-[#d4d4d1] mb-1">Commits</p>
          <p className="text-2xl font-semibold text-[#FAF9F6]">{summary.commits}</p>
        </div>
        <div className="card p-3 bg-[#262624]">
          <p className="text-xs text-[#d4d4d1] mb-1">Pull Requests</p>
          <p className="text-2xl font-semibold text-[#FAF9F6]">{summary.pull_requests}</p>
        </div>
        <div className="card p-3 bg-[#262624]">
          <p className="text-xs text-[#d4d4d1] mb-1">Issues</p>
          <p className="text-2xl font-semibold text-[#FAF9F6]">{summary.issues}</p>
        </div>
      </div>

      {summary.contributors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-[#d4d4d1] mb-2">Top Contributors</p>
          <div className="flex flex-wrap gap-2">
            {summary.contributors.slice(0, 5).map((contributor, idx) => (
              <div key={idx} className="flex items-center gap-2 card px-2 py-1">
                {contributor.avatar && (
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span className="text-xs text-[#FAF9F6]">{contributor.name}</span>
                <span className="text-xs text-[#d4d4d1]">({contributor.contributions})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.repositories.length > 0 && (
        <div>
          <p className="text-xs text-[#d4d4d1] mb-2">Repositories</p>
          <div className="space-y-1">
            {summary.repositories.map((repo, idx) => (
              <Link
                key={idx}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs text-[#0066cc] hover:text-[#0080ff] hover:underline"
              >
                <span>{repo.name}</span>
                <span className="text-[#d4d4d1]">{repo.activity_count} activities</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

