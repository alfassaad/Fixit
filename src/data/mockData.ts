
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
