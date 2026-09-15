/** Core domain types — keep stable; backend will map to these later. */

export type UserRole = "owner" | "clerk" | "foreman";

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";

export type VehicleKind = "owned" | "hired";

export type LabourPaymentType = "daily" | "weekly" | "piecework" | "salary";

/** How a site worker is engaged on this project (not app login). */
export type WorkerPayBasis = "daily" | "weekly" | "contract";

export type WorkerStatus = "active" | "paused" | "completed";

export type SessionUser = {
  userId: string;
  companyId: string;
  role: UserRole;
  name: string;
  email: string;
  companyName: string;
};

export type Company = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  companyId: string;
  name: string;
  location: string;
  client: string;
  status: ProjectStatus;
  /** Whole KES amounts */
  contractValueKes: number;
  budgetKes: number;
  startDate: string;
  updatedAt: string;
  /** Owner/foreman estimate of physical completion 0–100 */
  progressPct: number;
};

export type ProjectInput = {
  name: string;
  location: string;
  client: string;
  status: ProjectStatus;
  contractValueKes: number;
  budgetKes: number;
  startDate: string;
  progressPct?: number;
};

export type CostLine = {
  key: string;
  label: string;
  amountKes: number;
  count: number;
};

export type ProjectCostBreakdown = {
  projectId: string;
  materialsByName: CostLine[];
  materialsBySupplier: CostLine[];
  labourByRole: CostLine[];
  deliveriesByItem: CostLine[];
};

export type SpendPace = "ahead" | "aligned" | "behind" | "unknown";

export type ProjectPulse = {
  projectId: string;
  finance: ProjectFinanceSummary;
  progressPct: number;
  budgetUsedPct: number;
  spendPace: SpendPace;
  riskMessage: string | null;
  todaySpentKes: number;
  monthSpentKes: number;
  latestProgressTitle: string | null;
  latestProgressAt: string | null;
};

export type ProjectFinanceSummary = {
  projectId: string;
  contractValueKes: number;
  budgetKes: number;
  materialsKes: number;
  labourKes: number;
  deliveriesKes: number;
  totalSpentKes: number;
  remainingBudgetKes: number;
  /** Owner-only fields — omit/null for site roles at the service layer */
  runningProfitKes: number | null;
  marginPct: number | null;
};

export type ActivityKind =
  | "material"
  | "labour"
  | "delivery"
  | "progress"
  | "team"
  | "vehicle"
  | "workforce";

export type ProjectActivity = {
  id: string;
  projectId: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  amountKes?: number;
  createdAt: string;
  createdByName: string;
};

export type ProgressMedia = {
  id: string;
  kind: "image" | "video";
  name: string;
  /** Compressed data-URL preview for images; null for videos */
  thumbnailUrl: string | null;
};

export type ProgressUpdate = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  createdAt: string;
  createdByName: string;
  /** Placeholder until Cloudinary */
  mediaLabel: string;
  photoCount: number;
  videoCount: number;
  mediaFiles: ProgressMedia[];
  /** Optional link to a delivery that day */
  linkedDeliveryId: string | null;
  linkedDeliveryLabel: string | null;
};

export type MaterialEntry = {
  id: string;
  projectId: string;
  companyId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPriceKes: number;
  supplier: string;
  date: string;
  createdAt: string;
  createdByUserId: string;
  createdByName: string;
};

export type LabourPayment = {
  id: string;
  projectId: string;
  companyId: string;
  workerName: string;
  roleLabel: string;
  amountKes: number;
  paymentType: LabourPaymentType;
  date: string;
  createdAt: string;
  createdByUserId: string;
  createdByName: string;
  /** Optional link to project crew directory */
  workerId?: string | null;
};

/**
 * Site crew on a project — plumbers, masons, etc.
 * Separate from Team (clerks/foremen with app access).
 */
export type ProjectWorker = {
  id: string;
  projectId: string;
  companyId: string;
  name: string;
  /** Trade / department e.g. Plumbing, Masonry, Electrical */
  trade: string;
  /** Specific role e.g. Lead plumber, Helper */
  roleLabel: string;
  payBasis: WorkerPayBasis;
  /** Daily/weekly rate, or agreed contract amount */
  rateKes: number;
  phone: string | null;
  status: WorkerStatus;
  startDate: string;
  notes: string | null;
  createdAt: string;
  createdByUserId: string;
  createdByName: string;
};

export type Vehicle = {
  id: string;
  projectId: string;
  companyId: string;
  plateNumber: string;
  label: string;
  kind: VehicleKind;
  createdAt: string;
  createdByUserId: string;
  createdByName: string;
};

export type Delivery = {
  id: string;
  projectId: string;
  companyId: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  deliveryFeeKes: number;
  date: string;
  receivedBy: string;
  vehicleId: string | null;
  vehicleLabel: string;
  createdAt: string;
  createdByUserId: string;
  createdByName: string;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  companyId: string;
  name: string;
  email: string;
  role: Exclude<UserRole, "owner">;
  status: "invited" | "active";
  invitedAt: string;
  createdByUserId: string;
  /** Links to CompanyPerson.userId when set */
  userId: string;
};

/** Org-level directory — one person can be on many projects */
export type CompanyPerson = {
  id: string;
  companyId: string;
  userId: string;
  name: string;
  email: string;
  role: Exclude<UserRole, "owner">;
  status: "invited" | "active";
  projectIds: string[];
  invitedAt: string;
  createdByUserId: string;
};
