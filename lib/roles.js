// ============================================================================
// Staff roles & per-tab permissions. Pure JS (no React) — safe from server &
// client. The admin sidebar and the account APIs both derive access from here.
// ============================================================================

// Every admin section a staff member can be granted. `key` matches the
// activeTab value used in app/admin/page.js.
export const ADMIN_TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "landingPages", label: "Landing Pages", icon: "🚀" },
  { key: "newsletter", label: "Newsletter Subscribers", icon: "📧" },
  { key: "blogs", label: "Manage Blogs", icon: "📝" },
  { key: "contacts", label: "Contact Inbox", icon: "📬" },
  { key: "liveChat", label: "Live Chat", icon: "💬" },
  { key: "freeTrials", label: "Free Trial Bookings", icon: "🎯" },
  { key: "teacherApps", label: "Teacher Applications", icon: "🧑‍🏫" },
  { key: "studentApps", label: "Student Registrations", icon: "🧒" },
  { key: "jobs", label: "Career Jobs", icon: "💼" },
  { key: "seo", label: "SEO Manager", icon: "🌐" },
  { key: "footer", label: "Header & Footer", icon: "🧩" },
  { key: "pages", label: "Page Management", icon: "📄" },
  { key: "teachers", label: "Manage Teachers", icon: "🎓" },
  { key: "courses", label: "Manage Courses", icon: "📚" },
  { key: "testimonials", label: "Manage Testimonials", icon: "💬" },
  { key: "plans", label: "Manage Plans", icon: "💵" },
];

export const ALL_TAB_KEYS = ADMIN_TABS.map((t) => t.key);

// "profile" (own credentials) is always available; "staff" is super-admin only.
export const ALWAYS_TABS = ["profile"];

// Role presets. `tabs: "ALL"` means every section. `manageStaff` unlocks the
// Staff Accounts tab. `custom` lets the creator hand-pick tabs.
export const ROLE_PRESETS = {
  super_admin: { label: "Super Admin", tabs: "ALL", manageStaff: true, desc: "Full access to everything, including staff management." },
  manager: { label: "Manager", tabs: ALL_TAB_KEYS, manageStaff: false, desc: "Access to every section except staff management." },
  content_editor: { label: "Content Editor", tabs: ["overview", "landingPages", "newsletter", "blogs", "pages", "courses", "testimonials", "teachers", "seo", "footer"], manageStaff: false, desc: "Manages website content, landing pages, courses, blogs and SEO." },
  support: { label: "Support Agent", tabs: ["overview", "contacts", "newsletter", "liveChat", "freeTrials", "teacherApps", "studentApps"], manageStaff: false, desc: "Handles inquiries, live chat, bookings and applications." },
  seo_specialist: { label: "SEO Specialist", tabs: ["overview", "landingPages", "seo", "pages", "blogs"], manageStaff: false, desc: "Manages SEO, landing pages, page content and blog articles." },
  custom: { label: "Custom", tabs: [], manageStaff: false, desc: "Hand-pick exactly which sections this staff member can access." },
};

export const ROLE_KEYS = Object.keys(ROLE_PRESETS);

export function roleLabel(role) {
  return (ROLE_PRESETS[role] || {}).label || role || "Staff";
}

// Admins that predate the role system (role null/undefined) were full-access,
// so treat them as super admins. This also lets the owner work before the
// staff SQL migration has been run.
function isLegacyFullAccess(admin) {
  return !!admin && (admin.role === null || admin.role === undefined || admin.role === "");
}

export function isSuperAdmin(admin) {
  return !!admin && (admin.role === "super_admin" || isLegacyFullAccess(admin));
}

// Can this admin open the Staff Accounts tab / manage other staff?
export function canManageStaff(admin) {
  if (!admin) return false;
  if (isSuperAdmin(admin)) return true;
  const preset = ROLE_PRESETS[admin.role];
  return !!(preset && preset.manageStaff);
}

// Resolve the tab keys an admin may access (does not include profile/staff).
export function allowedTabs(admin) {
  if (!admin) return [];
  if (isSuperAdmin(admin)) return [...ALL_TAB_KEYS];
  const preset = ROLE_PRESETS[admin.role];
  if (preset && preset.tabs === "ALL") return [...ALL_TAB_KEYS];
  if (admin.role === "custom" || !preset) {
    const perms = Array.isArray(admin.permissions) ? admin.permissions : [];
    return perms.filter((k) => ALL_TAB_KEYS.includes(k));
  }
  return (preset.tabs || []).filter((k) => ALL_TAB_KEYS.includes(k));
}

export function hasTab(admin, tabKey) {
  if (tabKey === "profile") return true;
  if (tabKey === "staff") return canManageStaff(admin);
  return allowedTabs(admin).includes(tabKey);
}

// Given a chosen role (+ optional custom perms), return the permissions array to store.
export function resolvePermissions(role, customPerms) {
  if (role === "super_admin") return [...ALL_TAB_KEYS];
  const preset = ROLE_PRESETS[role];
  if (preset && preset.tabs === "ALL") return [...ALL_TAB_KEYS];
  if (role === "custom" || !preset) {
    return (Array.isArray(customPerms) ? customPerms : []).filter((k) => ALL_TAB_KEYS.includes(k));
  }
  return [...(preset.tabs || [])];
}
