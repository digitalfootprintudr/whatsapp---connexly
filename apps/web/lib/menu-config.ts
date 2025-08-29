import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CloudIcon,
  ServerIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BoltIcon,
  LockClosedIcon,
  ChartBarSquareIcon,
  SwatchIcon,
  PhoneIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  StarIcon,
  UserIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  children?: MenuItem[];
  permissions?: string[];
  badge?: string | number;
  isExternal?: boolean;
}

export interface MenuConfig {
  [role: string]: MenuItem[];
}

export const menuConfig: MenuConfig = {
  SUPER_ADMIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      children: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: HomeIcon },
        { id: 'system-health', label: 'System Health', href: '/admin/system-health', icon: CheckCircleIcon },
        { id: 'recent-activity', label: 'Recent Activity', href: '/admin/activity', icon: ClockIcon },
        { id: 'quick-actions', label: 'Quick Actions', href: '/admin/quick-actions', icon: BoltIcon },
      ],
    },
    {
      id: 'vendors',
      label: 'Vendors',
      href: '/admin/vendors',
      icon: BuildingOfficeIcon,
      children: [
        { id: 'all-vendors', label: 'All Vendors', href: '/admin/vendors', icon: BuildingOfficeIcon },
        { id: 'vendor-onboarding', label: 'Vendor Onboarding', href: '/admin/vendors/onboarding', icon: PlusIcon },
        { id: 'account-management', label: 'Account Management', href: '/admin/vendors/accounts', icon: CogIcon },
        { id: 'usage-monitoring', label: 'Usage Monitoring', href: '/admin/vendors/usage', icon: ChartBarIcon },
        { id: 'verification-status', label: 'Verification Status', href: '/admin/vendors/verification', icon: ShieldCheckIcon },
        { id: 'support-tickets', label: 'Support Tickets', href: '/admin/vendors/support', icon: QuestionMarkCircleIcon },
      ],
    },
    {
      id: 'users',
      label: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
      children: [
        { id: 'user-directory', label: 'User Directory', href: '/admin/users', icon: UsersIcon },
        { id: 'role-management', label: 'Role Management', href: '/admin/users/roles', icon: KeyIcon },
        { id: 'permission-settings', label: 'Permission Settings', href: '/admin/users/permissions', icon: ShieldCheckIcon },
        { id: 'activity-logs', label: 'Activity Logs', href: '/admin/users/activity', icon: ClockIcon },
        { id: 'user-analytics', label: 'User Analytics', href: '/admin/users/analytics', icon: ChartBarIcon },
        { id: 'access-control', label: 'Access Control', href: '/admin/users/access', icon: LockClosedIcon },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      children: [
        { id: 'platform-performance', label: 'Platform Performance', href: '/admin/analytics/performance', icon: ChartBarIcon },
        { id: 'revenue-analytics', label: 'Revenue Analytics', href: '/admin/analytics/revenue', icon: CreditCardIcon },
        { id: 'usage-statistics', label: 'Usage Statistics', href: '/admin/analytics/usage', icon: ChartBarIcon },
        { id: 'vendor-performance', label: 'Vendor Performance', href: '/admin/analytics/vendors', icon: BuildingOfficeIcon },
        { id: 'system-metrics', label: 'System Metrics', href: '/admin/analytics/system', icon: ServerIcon },
        { id: 'growth-insights', label: 'Growth Insights', href: '/admin/analytics/growth', icon: ChartBarSquareIcon },
      ],
    },
    {
      id: 'system',
      label: 'System',
      href: '/admin/system',
      icon: CogIcon,
      children: [
        { id: 'platform-configuration', label: 'Platform Configuration', href: '/admin/system/config', icon: CogIcon },
        { id: 'whatsapp-business', label: 'WhatsApp Business', href: '/admin/settings/whatsapp', icon: ChatBubbleLeftRightIcon },
        { id: 'feature-flags', label: 'Feature Flags', href: '/admin/system/features', icon: SwatchIcon },
        { id: 'api-management', label: 'API Management', href: '/admin/system/api', icon: CloudIcon },
        { id: 'webhook-settings', label: 'Webhook Settings', href: '/admin/system/webhooks', icon: GlobeAltIcon },
        { id: 'security-settings', label: 'Security Settings', href: '/admin/system/security', icon: ShieldCheckIcon },
        { id: 'backup-restore', label: 'Backup & Restore', href: '/admin/system/backup', icon: ArchiveBoxIcon },
      ],
    },
    {
      id: 'billing',
      label: 'Billing',
      href: '/admin/billing',
      icon: CreditCardIcon,
      children: [
        { id: 'subscription-management', label: 'Subscription Management', href: '/admin/billing/subscriptions', icon: CreditCardIcon },
        { id: 'payment-processing', label: 'Payment Processing', href: '/admin/billing/payments', icon: CreditCardIcon },
        { id: 'invoice-management', label: 'Invoice Management', href: '/admin/billing/invoices', icon: DocumentTextIcon },
        { id: 'revenue-tracking', label: 'Revenue Tracking', href: '/admin/billing/revenue', icon: ChartBarIcon },
        { id: 'tax-settings', label: 'Tax Settings', href: '/admin/billing/tax', icon: CogIcon },
        { id: 'refund-management', label: 'Refund Management', href: '/admin/billing/refunds', icon: ArrowPathIcon },
      ],
    },
    {
      id: 'support',
      label: 'Support',
      href: '/admin/support',
      icon: QuestionMarkCircleIcon,
      children: [
        { id: 'customer-support', label: 'Customer Support', href: '/admin/support/customers', icon: QuestionMarkCircleIcon },
        { id: 'ticket-management', label: 'Ticket Management', href: '/admin/support/tickets', icon: DocumentTextIcon },
        { id: 'knowledge-base', label: 'Knowledge Base', href: '/admin/support/knowledge', icon: DocumentDuplicateIcon },
        { id: 'training-materials', label: 'Training Materials', href: '/admin/support/training', icon: UserIcon },
        { id: 'support-analytics', label: 'Support Analytics', href: '/admin/support/analytics', icon: ChartBarIcon },
        { id: 'escalation-rules', label: 'Escalation Rules', href: '/admin/support/escalation', icon: ExclamationTriangleIcon },
      ],
    },
  ],

  VENDOR_ADMIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      children: [
        { id: 'overview', label: 'Overview', href: '/dashboard', icon: HomeIcon },
        { id: 'performance', label: 'Performance', href: '/dashboard/performance', icon: ChartBarIcon },
        { id: 'quick-stats', label: 'Quick Stats', href: '/dashboard/stats', icon: ChartBarIcon },
        { id: 'recent-activity', label: 'Recent Activity', href: '/dashboard/activity', icon: ClockIcon },
      ],
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: '/whatsapp',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { id: 'onboarding', label: 'Business Setup', href: '/whatsapp/onboarding', icon: PlusIcon },
        { id: 'phone-numbers', label: 'Phone Numbers', href: '/whatsapp/phone-numbers', icon: PhoneIcon },
        { id: 'webhook-settings', label: 'Webhook Settings', href: '/whatsapp/webhooks', icon: GlobeAltIcon },
        { id: 'verification-status', label: 'Verification Status', href: '/whatsapp/verification', icon: ShieldCheckIcon },
        { id: 'message-history', label: 'Message History', href: '/whatsapp/history', icon: ClockIcon },
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      href: '/contacts',
      icon: UsersIcon,
      children: [
        { id: 'all-contacts', label: 'All Contacts', href: '/contacts', icon: UsersIcon },
        { id: 'add-contact', label: 'Add Contact', href: '/contacts/add', icon: PlusIcon },
        { id: 'import-contacts', label: 'Import Contacts', href: '/contacts/import', icon: ArrowUpTrayIcon },
        { id: 'contact-groups', label: 'Contact Groups', href: '/contacts/groups', icon: UserGroupIcon },
        { id: 'contact-notes', label: 'Contact Notes', href: '/contacts/notes', icon: DocumentTextIcon },
        { id: 'contact-history', label: 'Contact History', href: '/contacts/history', icon: ClockIcon },
      ],
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      href: '/campaigns',
      icon: EnvelopeIcon,
      children: [
        { id: 'all-campaigns', label: 'All Campaigns', href: '/campaigns', icon: EnvelopeIcon },
        { id: 'create-campaign', label: 'Create Campaign', href: '/campaigns/create', icon: PlusIcon },
        { id: 'campaign-templates', label: 'Campaign Templates', href: '/campaigns/templates', icon: DocumentDuplicateIcon },
        { id: 'scheduled-campaigns', label: 'Scheduled Campaigns', href: '/campaigns/scheduled', icon: ClockIcon },
        { id: 'campaign-analytics', label: 'Campaign Analytics', href: '/campaigns/analytics', icon: ChartBarIcon },
        { id: 'campaign-logs', label: 'Campaign Logs', href: '/campaigns/logs', icon: DocumentTextIcon },
      ],
    },
    {
      id: 'templates',
      label: 'Templates',
      href: '/templates',
      icon: DocumentTextIcon,
      children: [
        { id: 'all-templates', label: 'All Templates', href: '/templates', icon: DocumentTextIcon },
        { id: 'create-template', label: 'Create Template', href: '/templates/create', icon: PlusIcon },
        { id: 'template-categories', label: 'Template Categories', href: '/templates/categories', icon: FolderIcon },
        { id: 'template-approval', label: 'Template Approval', href: '/templates/approval', icon: CheckCircleIcon },
        { id: 'template-analytics', label: 'Template Analytics', href: '/templates/analytics', icon: ChartBarIcon },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      href: '/automation',
      icon: CogIcon,
      children: [
        { id: 'bot-flows', label: 'Bot Flows', href: '/automation/flows', icon: ArrowPathIcon },
        { id: 'bot-replies', label: 'Bot Replies', href: '/automation/replies', icon: ChatBubbleLeftRightIcon },
        { id: 'flowise-ai-bot', label: 'Flowise AI Bot', href: '/automation/flowise', icon: BoltIcon },
        { id: 'triggers', label: 'Triggers', href: '/automation/triggers', icon: BoltIcon },
        { id: 'automation-rules', label: 'Automation Rules', href: '/automation/rules', icon: CogIcon },
        { id: 'automation-analytics', label: 'Automation Analytics', href: '/automation/analytics', icon: ChartBarIcon },
      ],
    },
    {
      id: 'chat',
      label: 'Chat',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { id: 'conversations', label: 'Conversations', href: '/chat', icon: ChatBubbleLeftRightIcon },
        { id: 'chat-history', label: 'Chat History', href: '/chat/history', icon: ClockIcon },
        { id: 'chat-analytics', label: 'Chat Analytics', href: '/chat/analytics', icon: ChartBarIcon },
        { id: 'chat-settings', label: 'Chat Settings', href: '/chat/settings', icon: CogIcon },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      children: [
        { id: 'overview', label: 'Overview', href: '/analytics', icon: ChartBarIcon },
        { id: 'message-analytics', label: 'Message Analytics', href: '/analytics/messages', icon: EnvelopeIcon },
        { id: 'contact-analytics', label: 'Contact Analytics', href: '/analytics/contacts', icon: UsersIcon },
        { id: 'campaign-analytics', label: 'Campaign Analytics', href: '/analytics/campaigns', icon: EnvelopeIcon },
        { id: 'conversion-tracking', label: 'Conversion Tracking', href: '/analytics/conversions', icon: ChartBarIcon },
        { id: 'custom-reports', label: 'Custom Reports', href: '/analytics/reports', icon: DocumentTextIcon },
      ],
    },
    {
      id: 'team',
      label: 'Team',
      href: '/team',
      icon: UserGroupIcon,
      children: [
        { id: 'team-members', label: 'Team Members', href: '/team', icon: UserGroupIcon },
        { id: 'add-member', label: 'Add Member', href: '/team/add', icon: PlusIcon },
        { id: 'role-management', label: 'Role Management', href: '/team/roles', icon: KeyIcon },
        { id: 'permissions', label: 'Permissions', href: '/team/permissions', icon: ShieldCheckIcon },
        { id: 'team-activity', label: 'Team Activity', href: '/team/activity', icon: ClockIcon },
        { id: 'team-analytics', label: 'Team Analytics', href: '/team/analytics', icon: ChartBarIcon },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: CogIcon,
      children: [
        { id: 'profile', label: 'Profile', href: '/settings/profile', icon: UserIcon },
        { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: BellIcon },
        { id: 'security', label: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
        { id: 'billing', label: 'Billing', href: '/settings/billing', icon: CreditCardIcon },
        { id: 'integrations', label: 'Integrations', href: '/settings/integrations', icon: CloudIcon },
        { id: 'api-keys', label: 'API Keys', href: '/settings/api-keys', icon: KeyIcon },
        { id: 'webhooks', label: 'Webhooks', href: '/settings/webhooks', icon: GlobeAltIcon },
      ],
    },
  ],

  AGENT: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      children: [
        { id: 'overview', label: 'Overview', href: '/dashboard', icon: HomeIcon },
        { id: 'my-stats', label: 'My Stats', href: '/dashboard/stats', icon: ChartBarIcon },
        { id: 'recent-activity', label: 'Recent Activity', href: '/dashboard/activity', icon: ClockIcon },
      ],
    },
    {
      id: 'conversations',
      label: 'Conversations',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { id: 'active-chats', label: 'Active Chats', href: '/chat', icon: ChatBubbleLeftRightIcon },
        { id: 'chat-history', label: 'Chat History', href: '/chat/history', icon: ClockIcon },
        { id: 'chat-templates', label: 'Chat Templates', href: '/chat/templates', icon: DocumentTextIcon },
        { id: 'quick-replies', label: 'Quick Replies', href: '/chat/quick-replies', icon: BoltIcon },
      ],
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      href: '/campaigns',
      icon: EnvelopeIcon,
      children: [
        { id: 'assigned-campaigns', label: 'Assigned Campaigns', href: '/campaigns', icon: EnvelopeIcon },
        { id: 'campaign-templates', label: 'Campaign Templates', href: '/campaigns/templates', icon: DocumentDuplicateIcon },
        { id: 'campaign-analytics', label: 'Campaign Analytics', href: '/campaigns/analytics', icon: ChartBarIcon },
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      href: '/contacts',
      icon: UsersIcon,
      children: [
        { id: 'assigned-contacts', label: 'Assigned Contacts', href: '/contacts', icon: UsersIcon },
        { id: 'contact-notes', label: 'Contact Notes', href: '/contacts/notes', icon: DocumentTextIcon },
        { id: 'contact-history', label: 'Contact History', href: '/contacts/history', icon: ClockIcon },
      ],
    },
    {
      id: 'templates',
      label: 'Templates',
      href: '/templates',
      icon: DocumentTextIcon,
      children: [
        { id: 'message-templates', label: 'Message Templates', href: '/templates', icon: DocumentTextIcon },
        { id: 'quick-replies', label: 'Quick Replies', href: '/templates/quick-replies', icon: BoltIcon },
        { id: 'template-categories', label: 'Template Categories', href: '/templates/categories', icon: FolderIcon },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/reports',
      icon: ChartBarIcon,
      children: [
        { id: 'my-performance', label: 'My Performance', href: '/reports/performance', icon: ChartBarIcon },
        { id: 'conversation-stats', label: 'Conversation Stats', href: '/reports/conversations', icon: ChatBubbleLeftRightIcon },
        { id: 'response-times', label: 'Response Times', href: '/reports/response-times', icon: ClockIcon },
        { id: 'customer-satisfaction', label: 'Customer Satisfaction', href: '/reports/satisfaction', icon: StarIcon },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: CogIcon,
      children: [
        { id: 'profile', label: 'Profile', href: '/settings/profile', icon: UserIcon },
        { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: BellIcon },
        { id: 'preferences', label: 'Preferences', href: '/settings/preferences', icon: CogIcon },
        { id: 'availability', label: 'Availability', href: '/settings/availability', icon: ClockIcon },
      ],
    },
  ],
};

// Helper function to get menu items for a specific role
export function getMenuForRole(role: string): MenuItem[] {
  return menuConfig[role] || [];
}

// Helper function to check if user has permission for a menu item
export function hasMenuPermission(menuItem: MenuItem, userPermissions: string[]): boolean {
  if (!menuItem.permissions || menuItem.permissions.length === 0) {
    return true;
  }
  return menuItem.permissions.some(permission => userPermissions.includes(permission));
}

// Helper function to get flattened menu items (for breadcrumbs, etc.)
export function getFlattenedMenu(role: string): MenuItem[] {
  const menu = getMenuForRole(role);
  const flattened: MenuItem[] = [];
  
  function flatten(items: MenuItem[]) {
    items.forEach(item => {
      flattened.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  }
  
  flatten(menu);
  return flattened;
}
