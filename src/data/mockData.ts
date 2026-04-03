
export const CATEGORIES = [
  { id: "roads", name: "Roads & Potholes", icon: "🚧", color: "#C0392B" },
  { id: "lighting", name: "Street Lighting", icon: "💡", color: "#F39C12" },
  { id: "water", name: "Water & Drainage", icon: "💧", color: "#2E86C1" },
  { id: "waste", name: "Waste Management", icon: "🗑️", color: "#1D8348" },
  { id: "parks", name: "Parks & Recreation", icon: "🌳", color: "#8E44AD" },
  { id: "other", name: "Other", icon: "❓", color: "#717D7E" }
];

export const mockIssues = [
  {
    id: "ISS-001",
    title: "Large pothole in Blue Area",
    category: "Roads & Potholes",
    status: "in_progress",
    priority: "high",
    description: "Deep pothole approximately 40cm wide causing vehicle damage. Very dangerous at night.",
    location: { lat: 33.6850, lng: 73.0480, address: "Jinnah Avenue, Blue Area, Islamabad" },
    upvotes: 47,
    reportedBy: "Haris Zafar",
    reportedAt: "2024-03-10T09:30:00Z",
    assignedTo: "Ali Hassan",
    photos: ["https://picsum.photos/seed/pothole/600/400"],
    resolvedAt: null,
    comments: [{ user: "Haris Zafar", text: "Still not fixed after 3 days!", time: "2024-03-12T14:00:00Z" }]
  },
  {
    id: "ISS-002",
    title: "Street light out in F-6 Markaz",
    category: "Street Lighting",
    status: "open",
    priority: "critical",
    description: "Three consecutive street lights not working. Area is completely dark after 8pm — very unsafe.",
    location: { lat: 33.6920, lng: 73.0420, address: "F-6 Markaz, Islamabad" },
    upvotes: 89,
    reportedBy: "Sara Ahmed",
    reportedAt: "2024-03-11T19:00:00Z",
    assignedTo: null,
    photos: ["https://picsum.photos/seed/streetlight/600/400"],
    resolvedAt: null,
    comments: []
  },
  {
    id: "ISS-003",
    title: "Water pipe burst near Centaurus",
    category: "Water & Drainage",
    status: "resolved",
    priority: "critical",
    description: "Major water pipe burst flooding the road near the mall entrance. Immediate action required.",
    location: { lat: 33.6840, lng: 73.0490, address: "Jinnah Avenue, near Centaurus, Islamabad" },
    upvotes: 134,
    reportedBy: "Usman Khan",
    reportedAt: "2024-03-08T07:00:00Z",
    assignedTo: "Bilal Raza",
    photos: ["https://picsum.photos/seed/pipe/600/400"],
    resolvedAt: "2024-03-09T16:00:00Z",
    comments: []
  },
  {
    id: "ISS-004",
    title: "Garbage pile in G-9/2",
    category: "Waste Management",
    status: "assigned",
    priority: "medium",
    description: "Garbage bins overflowing. Waste is spilling onto the street and creating health hazard.",
    location: { lat: 33.6780, lng: 73.0350, address: "Street 42, G-9/2, Islamabad" },
    upvotes: 23,
    reportedBy: "Fatima Malik",
    reportedAt: "2024-03-12T10:00:00Z",
    assignedTo: "Kamran Shah",
    photos: ["https://picsum.photos/seed/garbage/600/400"],
    resolvedAt: null,
    comments: []
  },
  {
    id: "ISS-005",
    title: "Broken bench in F-9 Park",
    category: "Parks & Recreation",
    status: "open",
    priority: "low",
    description: "Wooden bench near the main gate has collapsed. Risk of injury to children.",
    location: { lat: 33.6820, lng: 73.0380, address: "Fatima Jinnah Park (F-9), Islamabad" },
    upvotes: 8,
    reportedBy: "Zara Hussain",
    reportedAt: "2024-03-13T11:00:00Z",
    assignedTo: null,
    photos: ["https://picsum.photos/seed/bench/600/400"],
    resolvedAt: null,
    comments: []
  },
  {
    id: "ISS-006",
    title: "Traffic signal malfunction",
    category: "Roads & Potholes",
    status: "in_progress",
    priority: "critical",
    description: "Traffic signal at main intersection is stuck on red causing severe traffic jam.",
    location: { lat: 33.6890, lng: 73.0520, address: "Kashmir Highway Intersection, Islamabad" },
    upvotes: 201,
    reportedBy: "Asad Mirza",
    reportedAt: "2024-03-09T08:00:00Z",
    assignedTo: "Tariq Mehmood",
    photos: [],
    resolvedAt: null,
    comments: []
  }
];

export const mockUser = {
  id: "USR-001",
  name: "Haris Zafar Bhatti",
  email: "citizen@demo.com",
  phone: "+92-300-1234567",
  role: "citizen",
  avatar: null,
  reportsCount: 5,
  resolvedCount: 2,
  joinedAt: "2024-01-15"
};

export const mockAdminUser = {
  id: "ADM-001",
  name: "Admin User",
  email: "admin@demo.com",
  role: "admin",
  department: "City Administration"
};

export const mockNotifications = [
  { id: 1, type: "status_change", title: "Your report was assigned", message: "ISS-001 has been assigned to Ali Hassan.", time: "2 hours ago", read: false, issueId: "ISS-001" },
  { id: 2, type: "comment", title: "New comment on your report", message: "A team member commented on ISS-001.", time: "5 hours ago", read: false, issueId: "ISS-001" },
  { id: 3, type: "resolved", title: "Issue Resolved! 🎉", message: "ISS-003 has been marked as resolved.", time: "1 day ago", read: true, issueId: "ISS-003" },
  { id: 4, type: "escalation", title: "Report escalated", message: "ISS-002 has been escalated due to SLA breach.", time: "2 days ago", read: true, issueId: "ISS-002" },
  { id: 5, type: "chat",    title: "New message from Ali Hassan", message: "ISS-001 pothole repair starting tomorrow.", time: "10 min ago", read: false, issueId: "ISS-001" },
  { id: 6, type: "mention", title: "You were mentioned",          message: "Admin mentioned you in General Chat.",       time: "25 min ago", read: false, issueId: null },
  { id: 7, type: "sla",     title: "SLA Breach Warning",          message: "ISS-002 is approaching its 72hr deadline.", time: "1 hr ago",   read: false, issueId: "ISS-002" },
  { id: 8, type: "upvote",  title: "Your report gained traction", message: "ISS-001 now has 50+ upvotes.",              time: "2 hrs ago",  read: true,  issueId: "ISS-001" }
];

export const mockDashboardStats = {
  totalIssues: 1284,
  openIssues: 342,
  resolvedThisMonth: 198,
  avgResolutionHours: 38,
  criticalIssues: 12,
  totalUsers: 4891,
};

export const mockChartData = {
  monthlyTrend: [
    { month: "Oct", reported: 89, resolved: 72 },
    { month: "Nov", reported: 115, resolved: 98 },
    { month: "Dec", reported: 94, resolved: 87 },
    { month: "Jan", reported: 142, resolved: 110 },
    { month: "Feb", reported: 178, resolved: 145 },
    { month: "Mar", reported: 201, resolved: 163 },
  ],
  categoryBreakdown: [
    { name: "Roads & Potholes", value: 38, fill: "#C0392B" },
    { name: "Street Lighting", value: 22, fill: "#F39C12" },
    { name: "Water & Drainage", value: 18, fill: "#2E86C1" },
    { name: "Waste Management", value: 12, fill: "#1D8348" },
    { name: "Parks", value: 6, fill: "#8E44AD" },
    { name: "Other", value: 4, fill: "#717D7E" },
  ],
  resolutionTime: [
    { category: "Roads", hours: 48 },
    { category: "Lighting", hours: 32 },
    { category: "Water", hours: 18 },
    { category: "Waste", hours: 72 },
    { category: "Parks", hours: 120 },
  ],
};

export const mockTechnicians = [
  { id: "T001", name: "Ali Hassan", department: "Roads", activeTasks: 3, resolved: 45 },
  { id: "T002", name: "Bilal Raza", department: "Water", activeTasks: 2, resolved: 38 },
  { id: "T003", name: "Kamran Shah", department: "Waste", activeTasks: 4, resolved: 29 },
  { id: "T004", name: "Tariq Mehmood", department: "Roads", activeTasks: 1, resolved: 61 },
];

export const mockChatMessages = [
  { id: 1, roomId: "general", senderId: "T001", senderName: "Ali Hassan", senderRole: "technician",
    message: "ISS-001 pothole repair starting tomorrow morning.", time: "2024-03-13T09:00:00Z", mentions: [] },
  { id: 2, roomId: "general", senderId: "ADM-001", senderName: "Admin User", senderRole: "admin",
    message: "Good. @Ali Hassan please upload before photos first.", time: "2024-03-13T09:05:00Z", mentions: ["T001"] },
  { id: 3, roomId: "ISS-002", senderId: "T002", senderName: "Bilal Raza", senderRole: "technician",
    message: "Lights replacement parts ordered, ETA 2 days.", time: "2024-03-13T10:00:00Z", mentions: [] },
  { id: 4, roomId: "ISS-002", senderId: "ADM-001", senderName: "Admin User", senderRole: "admin",
    message: "Escalating ISS-002 — SLA breached. @Bilal Raza expedite please.", time: "2024-03-13T11:00:00Z", mentions: ["T002"] },
  { id: 5, roomId: "dm-T001", senderId: "ADM-001", senderName: "Admin User", senderRole: "admin",
    message: "Ali, can you take on ISS-005 today as well?", time: "2024-03-13T12:00:00Z", mentions: [] },
  { id: 6, roomId: "dm-T001", senderId: "T001", senderName: "Ali Hassan", senderRole: "technician",
    message: "Yes, I\'ll head there after finishing ISS-001.", time: "2024-03-13T12:10:00Z", mentions: [] },
];

export const mockDMThreads = [
  { id: "dm-T001", participantId: "T001", participantName: "Ali Hassan", participantRole: "technician",
    lastMessage: "Yes, I\'ll head there after finishing ISS-001.", lastTime: "2024-03-13T12:10:00Z", unread: 0 },
  { id: "dm-T002", participantId: "T002", participantName: "Bilal Raza", participantRole: "technician",
    lastMessage: "Lights replacement parts ordered, ETA 2 days.", lastTime: "2024-03-13T10:00:00Z", unread: 2 },
  { id: "dm-T003", participantId: "T003", participantName: "Kamran Shah", participantRole: "technician",
    lastMessage: "Waste collection scheduled for tomorrow.", lastTime: "2024-03-12T15:00:00Z", unread: 0 },
];

export const mockPerformanceData = [
  { name: "Ali Hassan",    assigned: 12, completed: 10, avgHours: 36, rating: 4.7, department: "Roads" },
  { name: "Bilal Raza",   assigned: 9,  completed: 7,  avgHours: 42, rating: 4.2, department: "Water" },
  { name: "Kamran Shah",  assigned: 14, completed: 9,  avgHours: 58, rating: 3.8, department: "Waste" },
  { name: "Tariq Mehmood",assigned: 8,  completed: 8,  avgHours: 28, rating: 4.9, department: "Roads" },
];

export const mockActivityFeed = [
  { id: 1, type: "resolved",  actor: "Ali Hassan",  action: "resolved",       target: "ISS-001", time: "10 min ago" },
  { id: 2, type: "assigned",  actor: "Admin User",  action: "assigned",       target: "ISS-004 to Kamran Shah", time: "1 hr ago" },
  { id: 3, type: "new",       actor: "Sara Ahmed",  action: "submitted",      target: "ISS-007", time: "2 hrs ago" },
  { id: 4, type: "escalated", actor: "System",      action: "auto-escalated", target: "ISS-002", time: "3 hrs ago" },
  { id: 5, type: "comment",   actor: "Haris Zafar", action: "commented on",   target: "ISS-001", time: "4 hrs ago" },
];

export const mockWidgets = [
  { id: "w1", label: "Open Issues",            enabled: true  },
  { id: "w2", label: "Monthly Trend",          enabled: true  },
  { id: "w3", label: "Category Breakdown",     enabled: true  },
  { id: "w4", label: "Technician Performance", enabled: true  },
  { id: "w5", label: "Resolution Time",        enabled: false },
  { id: "w6", label: "Activity Feed",          enabled: true  },
  { id: "w7", label: "SLA Breach Risk",        enabled: false },
];
