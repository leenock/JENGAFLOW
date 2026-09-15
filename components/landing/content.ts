/**
 * Temporary media: public construction videos from maman-corp.com used only as
 * layout placeholders until Jengaflow supplies its own footage. Replace before
 * any public marketing launch. Do not treat these as licensed product assets.
 */
const PLACEHOLDER_VIDEO = {
  landing: "https://www.maman-corp.com/assets/video/home-landing.mp4",
  home1: "https://www.maman-corp.com/assets/video/home-1.mp4",
  home2: "https://www.maman-corp.com/assets/video/home-2.mp4",
  home3: "https://www.maman-corp.com/assets/video/home-3.mp4",
  home4: "https://www.maman-corp.com/assets/video/home-4.mp4",
  home5: "https://www.maman-corp.com/assets/video/home-5.mp4",
  home6: "https://www.maman-corp.com/assets/video/home-6.mp4",
  home7: "https://www.maman-corp.com/assets/video/home-7.mp4",
} as const;

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  linkLabel: string;
  href: string;
  video: string;
};

export const brand = {
  name: "Jengaflow",
  tagline: "Construction site tracking",
};

export const hero = {
  baseline: "Built for construction teams",
  title:
    "Jengaflow keeps site spending and construction progress in one project record.",
  body: "Clerks and foremen capture materials, labour, deliveries, and site photos on their phones. Owners see budget, spend, and how the building is actually moving — without sharing profit with the site team.",
  cta: "Scroll to discover",
  video: PLACEHOLDER_VIDEO.landing,
};

export const chapters: Chapter[] = [
  {
    id: "problem",
    title: "The problem",
    subtitle:
      "Most site records never make it past WhatsApp, notebooks, and someone's photo gallery.",
    body: "Purchases, labour payments, and deliveries get scattered across chats and paper. Photos sit on a phone. By month-end, owners are reconstructing the project instead of managing it — and nobody can clearly answer what was spent or what was actually built.",
    linkLabel: "See how Jengaflow fixes this",
    href: "#two-questions",
    video: PLACEHOLDER_VIDEO.home1,
  },
  {
    id: "two-questions",
    title: "Two questions",
    subtitle:
      "Every owner needs the same answers: how much have we spent, and how far has the work reached?",
    body: "Expense tools cover money. Photo albums cover progress. Jengaflow connects both inside the project — materials, labour, deliveries, vehicles, and a visual construction diary — so financial records and physical progress live in one place.",
    linkLabel: "Explore what you can record",
    href: "#capture",
    video: PLACEHOLDER_VIDEO.home2,
  },
  {
    id: "how-it-works",
    title: "How it works",
    subtitle:
      "Create the project. Add the team. Capture the site. Review the record.",
    body: "Set contract value and budget, invite clerks and foremen to specific projects, register vehicles, then record daily activity from the phone. As entries accumulate, owners monitor spend against budget and follow a dated progress timeline with photos and videos.",
    linkLabel: "Request early access",
    href: "#early-access",
    video: PLACEHOLDER_VIDEO.home3,
  },
  {
    id: "capture",
    title: "What you capture",
    subtitle:
      "Materials, labour, deliveries, vehicles, and progress media — recorded where the work happens.",
    body: "Log material purchases with quantity, unit price, and supplier. Record labour payments by worker or team. Note deliveries with fees, receiving person, and the vehicle that brought them. Upload progress photos and short videos with descriptions like “Foundation completed — Block A.”",
    linkLabel: "See the site-team experience",
    href: "#site-team",
    video: PLACEHOLDER_VIDEO.home4,
  },
  {
    id: "site-team",
    title: "For site teams",
    subtitle:
      "A simple phone interface for clerks and foremen — built for 10–20 seconds on site.",
    body: "Site staff add materials, labour payments, deliveries, vehicle details, and progress updates quickly. They do not see sensitive financial views such as running profit or profit margin. Capture stays fast; ownership of the numbers stays with the company owner.",
    linkLabel: "See the owner view",
    href: "#owners",
    video: PLACEHOLDER_VIDEO.home5,
  },
  {
    id: "owners",
    title: "For owners",
    subtitle:
      "One dashboard for budget, spend breakdown, running profit, and the construction diary.",
    body: "Review contract value, planned budget, total spending, and costs by materials, labour, and deliveries. Compare spend to budget, understand running profit and margin, and scroll a visual timeline of how the building developed — then export records for reporting or billing support.",
    linkLabel: "Get early access",
    href: "#early-access",
    video: PLACEHOLDER_VIDEO.home6,
  },
  {
    id: "early-access",
    title: "Early access",
    subtitle:
      "Put every site on one record — spending, deliveries, and progress together.",
    body: "Jengaflow is being built for contractors, engineers, and site managers across East Africa and beyond. Join the early access list to help shape the MVP: project setup, team invites, daily capture, progress media, owner finance views, and exportable project history.",
    linkLabel: "Email hello@jengaflow.com",
    href: "mailto:hello@jengaflow.com",
    video: PLACEHOLDER_VIDEO.home7,
  },
];

export type NavLink = { label: string; href: string };

export type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; children: NavLink[] };

/** Desktop top bar — grouped to keep the header uncrowded */
export const topNavItems: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "group",
    label: "Product",
    children: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Capture", href: "/capture" },
    ],
  },
  {
    type: "group",
    label: "Who it's for",
    children: [
      { label: "Site teams", href: "/site-teams" },
      { label: "Owners", href: "/owners" },
    ],
  },
  { type: "link", label: "About", href: "/about" },
];

/** Flat list kept for places that still need every href */
export const topNavLinks: NavLink[] = topNavItems.flatMap((item) =>
  item.type === "link" ? [item] : item.children,
);

/** Mobile overlay — sectioned groups + company links */
export const navGroups: { title?: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "What you capture", href: "/capture" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { label: "For site teams", href: "/site-teams" },
      { label: "For owners", href: "/owners" },
    ],
  },
  {
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Early access", href: "mailto:hello@jengaflow.com" },
    ],
  },
];

export const navLinks: NavLink[] = navGroups.flatMap((group) => group.links);

/** Utility auth actions — not product chapters */
export const authLinks = {
  login: { label: "Log in", href: "/login" },
  signup: { label: "Get started", href: "/signup" },
} as const;

export const contact = {
  email: "hello@jengaflow.com",
  phone: "+254 700 000 000",
  location: "Nairobi, Kenya — serving East Africa and beyond",
};

export const footerCta = {
  eyebrow: "Next step",
  title: "Put your sites on one record.",
  body: "Early access for contractors and site managers. Start a workspace, or leave a note and we’ll follow up.",
  formTitle: "Tell us about your sites",
  formBody: "Demos, early access, or partnership — send a short note.",
};
