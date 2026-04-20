import { type BadgeVariant } from "@/registry/spell-ui/badge"

export type NotificationCategory =
  | "Workflow"
  | "Apps"
  | "Data"
  | "Members"
  | "Security"
  | "Billing"
export type NotificationPriority = "High" | "Medium" | "Low"

export type NotificationItem = {
  id: string
  title: string
  description: string
  category: NotificationCategory
  priority: NotificationPriority
  createdAt: string
  relativeTime: string
  unread: boolean
  mentioned: boolean
  source: string
  actor: string
  body: string
  highlights: string[]
  nextSteps: string[]
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-001",
    title: "Workflow deployment completed",
    description: "Contract Risk Review was deployed to Production by Amir Haddad.",
    category: "Workflow",
    priority: "Medium",
    createdAt: "2026-04-17T08:22:00Z",
    relativeTime: "8 min ago",
    unread: true,
    mentioned: false,
    source: "Workflow Builder",
    actor: "Amir Haddad",
    body: "The workflow passed all checks and is now live in Production. Incoming runs will use the latest nodes, model settings, and integrations. Historic executions were not modified.",
    highlights: [
      "Published to Production environment",
      "Run schedule remains unchanged",
      "No errors detected during rollout",
    ],
    nextSteps: [
      "Review first 10 live executions",
      "Validate output quality against QA baseline",
      "Share rollout update with operations channel",
    ],
  },
  {
    id: "n-002",
    title: "You were mentioned in #sales-ops",
    description: "Rana mentioned you in a Slack thread linked to Lead Qualification.",
    category: "Apps",
    priority: "High",
    createdAt: "2026-04-17T07:52:00Z",
    relativeTime: "38 min ago",
    unread: true,
    mentioned: true,
    source: "Slack integration",
    actor: "Rana Kamel",
    body: "A question was raised about lead scoring thresholds in the shared sales workflow. The thread includes sample records and asks for confirmation before enabling auto-routing.",
    highlights: [
      "Mention detected from synced Slack channel",
      "Related to Lead Qualification skill",
      "Action needed before auto-routing is enabled",
    ],
    nextSteps: [
      "Open linked thread and reply",
      "Confirm threshold values with sales team",
      "Update workflow notes once finalized",
    ],
  },
  {
    id: "n-003",
    title: "Large file uploaded to My Data",
    description: "Q2-legal-archive.zip was uploaded and queued for indexing.",
    category: "Data",
    priority: "Low",
    createdAt: "2026-04-17T06:15:00Z",
    relativeTime: "2 hr ago",
    unread: false,
    mentioned: false,
    source: "My Data",
    actor: "Nina Brooks",
    body: "A compressed legal archive was uploaded to the workspace data vault. The system accepted the file and queued extraction plus indexing tasks to make contents searchable in AI responses.",
    highlights: [
      "Upload validated successfully",
      "Indexing queued",
      "Search availability expected within a few minutes",
    ],
    nextSteps: [
      "Track indexing progress in My Data",
      "Review extracted metadata",
      "Assign the file to a workflow if needed",
    ],
  },
  {
    id: "n-004",
    title: "New member joined workspace",
    description: "Noah Karim accepted the invite and joined as a Member.",
    category: "Members",
    priority: "Low",
    createdAt: "2026-04-16T13:07:00Z",
    relativeTime: "Yesterday",
    unread: true,
    mentioned: false,
    source: "Workspace settings",
    actor: "Noah Karim",
    body: "The invited user accepted the workspace invitation and can now access allowed pages, data, and integrations according to current role permissions.",
    highlights: [
      "Invitation accepted",
      "Role assigned: Member",
      "Default integrations inherited",
    ],
    nextSteps: [
      "Review member permissions",
      "Assign workflows or project ownership",
      "Send onboarding resources",
    ],
  },
  {
    id: "n-005",
    title: "Force policy changed for Slack integration",
    description: "Slack was set to Forced for all members by Workspace Owner.",
    category: "Apps",
    priority: "Medium",
    createdAt: "2026-04-16T10:42:00Z",
    relativeTime: "Yesterday",
    unread: false,
    mentioned: false,
    source: "Settings > Integrations",
    actor: "Workspace Owner",
    body: "Workspace policy has been updated so Slack integration is enforced for all members. Existing users will keep access automatically and new users will inherit this integration on join.",
    highlights: [
      "Policy set to Forced",
      "Applies to current and future members",
      "Can be reverted by owner/admin",
    ],
    nextSteps: [
      "Notify team about policy change",
      "Check member access state",
      "Confirm required channels are connected",
    ],
  },
  {
    id: "n-006",
    title: "Login from a new device",
    description: "A new macOS device signed in to your account from Amman, JO.",
    category: "Security",
    priority: "High",
    createdAt: "2026-04-15T19:20:00Z",
    relativeTime: "2 days ago",
    unread: true,
    mentioned: false,
    source: "Security monitor",
    actor: "System",
    body: "A sign-in event from an unrecognized device was detected. The session was permitted because credentials were valid and no suspicious risk factors were triggered, but manual review is recommended.",
    highlights: [
      "New device fingerprint",
      "Location: Amman, Jordan",
      "No automatic lockout triggered",
    ],
    nextSteps: [
      "Confirm this was you",
      "Revoke unknown sessions if needed",
      "Rotate password if activity looks suspicious",
    ],
  },
  {
    id: "n-007",
    title: "Monthly usage reached 80%",
    description: "API requests are at 960k of 1.2M monthly quota.",
    category: "Billing",
    priority: "High",
    createdAt: "2026-04-14T16:05:00Z",
    relativeTime: "3 days ago",
    unread: false,
    mentioned: false,
    source: "Usage & limits",
    actor: "System",
    body: "Your workspace is approaching the monthly request quota. If current traffic continues, the limit may be reached before the billing period resets.",
    highlights: [
      "80% threshold crossed",
      "Estimated overage risk this week",
      "Automations may pause at hard limit",
    ],
    nextSteps: [
      "Review high-volume workflows",
      "Enable throttling on non-critical jobs",
      "Upgrade plan if sustained demand continues",
    ],
  },
  {
    id: "n-008",
    title: "Skill draft updated",
    description: "SEO Cluster Writer draft was updated by Leen Haddad.",
    category: "Workflow",
    priority: "Low",
    createdAt: "2026-04-13T11:33:00Z",
    relativeTime: "4 days ago",
    unread: false,
    mentioned: true,
    source: "Skills",
    actor: "Leen Haddad",
    body: "The draft was updated with new prompt instructions and revised connected app constraints. It remains in Draft status and is not yet active for team usage.",
    highlights: [
      "Prompt instructions revised",
      "Connected app constraints updated",
      "Status remains Draft",
    ],
    nextSteps: [
      "Review draft diff",
      "Run a sample test prompt",
      "Publish when validation passes",
    ],
  },
  {
    id: "n-009",
    title: "Data sync completed",
    description: "Google Drive sync finished with 124 updated files.",
    category: "Data",
    priority: "Medium",
    createdAt: "2026-04-11T09:18:00Z",
    relativeTime: "6 days ago",
    unread: false,
    mentioned: false,
    source: "Google Drive integration",
    actor: "System",
    body: "The scheduled sync pulled new and modified files from connected Drive folders. Updated documents are now available in workspace search and AI context.",
    highlights: [
      "124 files updated",
      "Sync completed successfully",
      "Index refresh finished",
    ],
    nextSteps: [
      "Spot-check key documents",
      "Verify folder scope is correct",
      "Keep scheduled sync enabled",
    ],
  },
]

export const categoryBadgeVariant: Record<NotificationCategory, BadgeVariant> = {
  Workflow: "violet",
  Apps: "blue",
  Data: "cyan",
  Members: "green",
  Security: "red",
  Billing: "amber",
}

export const priorityBadgeVariant: Record<NotificationPriority, BadgeVariant> = {
  High: "red",
  Medium: "amber",
  Low: "neutral",
}

export function getNotificationById(notificationId: string) {
  return INITIAL_NOTIFICATIONS.find((item) => item.id === notificationId) ?? null
}
