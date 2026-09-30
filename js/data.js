// =====================================================================
// CNA — data layer (shared by reader & publisher)
// All article / bookmark / follow data is stored in a local IndexedDB
// database (see db.js). SEED_ARTICLES is used only to initialise the
// database on first run — every runtime read/write goes through the DB.
// =====================================================================

import { dbGetAll, dbGet, dbPut, dbDelete, dbCount, dbClear, dbSeedIfEmpty } from './db.js';

export const CATEGORIES = [
  "Singapore", "Asia", "East Asia", "World", "Commentary",
  "Business", "Sport", "Tech", "Sustainability", "Lifestyle",
];

// Calendly-inspired, restrained palette for category thumbnails.
export const CATEGORY_COLORS = {
  Singapore:      ["#071A31", "#0d3a66"],
  Asia:           ["#0d5ca6", "#083b6b"],
  "East Asia":    ["#3b82f6", "#1d4ed8"],
  World:          ["#33475b", "#071A31"],
  Commentary:     ["#5a2fb0", "#381e6e"],
  Business:       ["#1d7a4f", "#115336"],
  Sport:          ["#0e7490", "#155e75"],
  Tech:           ["#006BFF", "#0047b3"],
  Sustainability: ["#2b8a5c", "#1b5c3d"],
  Lifestyle:      ["#c94f7c", "#8f3256"],
};

export function categoryGradient(category) {
  const c = CATEGORY_COLORS[category] || ["#071A31", "#0d3a66"];
  return `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
export function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

export function formatDate(iso) {
  if (iso == null) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso) {
  if (iso == null) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 0) return d.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return h === 1 ? "1 hr ago" : h + " hr ago";
  }
  const days = Math.floor(diff / 86400);
  if (days < 7) return days === 1 ? "1 day ago" : days + " days ago";
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
}

export function readTimeMins(text) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------------------------------------------------------------
// Seed articles (original, demo content)
// ---------------------------------------------------------------
export const SEED_ARTICLES = [
  {
    id: "seed-1",
    title: "Singapore's beverage container return scheme is shifting recycling habits",
    category: "Singapore",
    summary:
      "As the transition period for the Beverage Container Return Scheme draws to a close, consumers and hawkers alike are adjusting to a new way of dealing with cans and bottles.",
    content:
      "SINGAPORE: At a hawker centre in Toa Payoh, stall owner Lim Ah Heng has stopped throwing away empty drink cans.\n\nSince the Beverage Container Return Scheme began, he has been collecting them for the deposit refund, and says customers have started returning bottles on their own.\n\nEnvironment experts say the scheme is nudging Singapore toward better recycling habits, though long-term success depends on how easily people can find return points.\n\nThe National Environment Agency said more collection machines will be rolled out in the coming months.",
    author: "Dawn Ang",
    date: "2026-09-30T10:20:00",
    published: true,
    featured: true,
  },
  {
    id: "seed-2",
    title: "India's homegrown chip startups eye cameras and cars to crack the AI market",
    category: "Asia",
    summary:
      "A nascent Indian industry around specialised edge-AI chips has emerged, with firms moving their first products into customer testing and commercialisation.",
    content:
      "NEW DELHI: At a semiconductor conference this month, startups showed off circuit boards that let cameras and machines spot fires, count people or spot factory defects without sending data to the cloud.\n\nKnown as edge-AI chips, they run artificial intelligence locally inside devices, and can be tailored to individual markets and tasks.\n\nIndustry executives say India does not need to build the world's fastest AI processor to compete — putting intelligence into cameras, vehicles and everyday electronics may be a more realistic opening.\n\nInvestors are taking notice: Indian edge-AI chip startups raised nearly four times more money in 2026 than in 2022, according to data firm Tracxn.",
    author: "Shadma Shaikh",
    date: "2026-09-30T08:40:00",
    published: true,
    featured: true,
  },
  {
    id: "seed-3",
    title: "Global leaders sign voluntary AI safety pact at White House summit",
    category: "World",
    summary:
      "Technology executives and officials backed a voluntary framework while endorsing continued expansion of data centre capacity.",
    content:
      "WASHINGTON: Heads of leading AI companies joined officials at the White House to sign a voluntary safety pact, pledging to test powerful models before they are released.\n\nThe agreement stops short of binding regulation, relying instead on company commitments and third-party audits.\n\nExecutives also backed a push to expand data centre capacity, arguing that computing infrastructure is now a matter of national competitiveness.\n\nCritics said voluntary pledges lack teeth, while supporters called the meeting an important step toward shared standards.",
    author: "CNA Correspondent",
    date: "2026-09-30T07:15:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-4",
    title: "North Korea denies South's claim it was behind DMZ mine blasts",
    category: "East Asia",
    summary:
      "Pyongyang dismissed Seoul's accusation as fabrication, in the latest exchange across the heavily fortified border.",
    content:
      "SEOUL: North Korea on Tuesday rejected South Korea's claim that its forces were behind a series of mine explosions inside the Demilitarized Zone.\n\nA North Korean military spokesperson called the accusation a fabrication aimed at justifying South Korean military exercises.\n\nThe two sides have traded accusations for weeks, and tensions along the border remain high.\n\nAnalysts said the mine blasts, regardless of responsibility, underscore how fragile the armistice-era buffer zone has become.",
    author: "Regional Desk",
    date: "2026-09-30T06:30:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-5",
    title: "Commentary: Who can make a deal with Iran — and make it stick?",
    category: "Commentary",
    summary:
      "As Iran threatens new strikes and awaits a US response, the real question is which power centres in Tehran can credibly negotiate.",
    content:
      "The escalation in the Strait of Hormuz has focused attention on a familiar question: who in Iran actually has the authority to cut a deal?\n\nPower in Tehran is fragmented between the supreme leader, the Revolutionary Guard and an elected government, each with different incentives.\n\nAny lasting agreement would need to satisfy a security establishment that sees the nuclear programme as insurance against regime change.\n\nWestern negotiators, meanwhile, must decide whether to offer sanctions relief before or after verifiable concessions — a sequencing problem that has derailed every previous round.",
    author: "Javier Blas",
    date: "2026-09-30T05:50:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-6",
    title: "Inside McDonald's push to have AI price its menus",
    category: "Business",
    summary:
      "The fast-food chain is testing dynamic pricing tools that adjust menu items based on demand, weather and time of day.",
    content:
      "McDonald's is testing artificial-intelligence systems that recommend menu prices in real time, drawing on factors such as weather, traffic and historical demand.\n\nFranchisees say the tools could lift margins, but consumer groups warn that dynamic pricing risks alienating customers who value predictable prices.\n\nThe company stressed that any rollout would be gradual and that franchisees retain final control.\n\nEconomists say the experiment is a test case for how far AI-driven pricing will spread across retail.",
    author: "Business Desk",
    date: "2026-09-30T04:25:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-7",
    title: "Singapore shuttler claims historic silver at Asian Games",
    category: "Sport",
    summary:
      "The national badminton star's run to the final delivered Singapore's first men's singles medal at the Asian Games.",
    content:
      "Singapore's top shuttler fell just short of gold but made history by claiming the country's first men's singles silver at the Asian Games.\n\nThe 26-year-old pushed the top seed to three games in a final that stretched past midnight.\n\nCoaches said the result vindicated years of investment in the sport's development pathway.\n\nThe shuttler said the silver would serve as motivation ahead of next year's world championships.",
    author: "Sports Desk",
    date: "2026-09-29T23:10:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-8",
    title: "OpenAI unveils 'App Store for AI' as safety concerns grow",
    category: "Tech",
    summary:
      "The ChatGPT maker wants developers to build and sell AI assistants through its marketplace, even as regulators press for safeguards.",
    content:
      "OpenAI this week opened its marketplace to third-party developers, positioning itself as the app store for artificial intelligence.\n\nDevelopers will be able to publish AI assistants that handle tasks from scheduling to data analysis, with OpenAI taking a cut of revenue.\n\nThe move comes as safety researchers warn that a proliferation of third-party agents could make it harder to track how AI is being used.\n\nExecutives said every assistant would be subject to review, and that usage limits would prevent abuse.",
    author: "Tech Desk",
    date: "2026-09-29T21:05:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-9",
    title: "Rain brings relief as Indonesia battles toxic haze from wildfires",
    category: "Sustainability",
    summary:
      "Downpours over Sumatra helped clear the air, but officials warn the fire season is far from over.",
    content:
      "Heavy rain over parts of Sumatra brought temporary relief to communities choking on smoke from wildfires, clearing skies that had been grey for weeks.\n\nHealth authorities said hospital admissions for respiratory complaints eased as air quality improved.\n\nBut officials warned that the dry season is not over, and that fires could flare again without sustained rainfall.\n\nEnvironmental groups renewed calls for stronger enforcement against companies that clear land by burning.",
    author: "Environment Desk",
    date: "2026-09-29T19:45:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-10",
    title: "Singapore Writers Festival 2026 announces headline authors",
    category: "Lifestyle",
    summary:
      "Amitav Ghosh and Silvia Moreno-Garcia are among the names headlining this year's festival programme.",
    content:
      "The Singapore Writers Festival has unveiled its 2026 programme, headlined by Booker-nominated novelist Amitav Ghosh and Mexican-Canadian author Silvia Moreno-Garcia.\n\nOrganisers said this year's edition would explore themes of memory, migration and technology.\n\nMore than 200 events are planned across the city, including readings, panel discussions and workshops for young writers.\n\nTickets go on sale next month, with early-bird discounts for festival pass holders.",
    author: "Lifestyle Desk",
    date: "2026-09-29T17:30:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-11",
    title: "Brunei's crown prince visits Singapore to deepen bilateral ties",
    category: "Singapore",
    summary:
      "Leaders discussed cooperation in trade, education and the digital economy during the two-day visit.",
    content:
      "SINGAPORE: Brunei's crown prince met Singapore leaders on Monday, with both sides pledging to deepen cooperation in trade, education and the digital economy.\n\nThe two countries signed agreements covering carbon credits and the exchange of digital certificates.\n\nAnalysts said the visit reinforced a long-standing defence and economic relationship that has weathered regional uncertainty.\n\nThe crown prince's delegation also toured Singapore's port and technology hubs.",
    author: "Political Desk",
    date: "2026-09-29T15:00:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-12",
    title: "Fed's Williams sees no urgency for next rate hike",
    category: "Business",
    summary:
      "The New York Fed president said policy was well positioned, pushing back on market bets of imminent tightening.",
    content:
      "New York Federal Reserve President John Williams said there was no urgency to raise interest rates again, arguing that policy remains restrictive enough to keep inflation in check.\n\nHis remarks pushed back against market expectations that had begun pricing in a near-term hike.\n\nWilliams said the central bank could afford to be patient while data on the labour market and services inflation remained mixed.\n\nEconomists said the comments signalled a preference for holding rates steady through the end of the year.",
    author: "Markets Desk",
    date: "2026-09-29T13:20:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-13",
    title: "Nepal suspends search after avalanche sweeps away 16 climbers",
    category: "Asia",
    summary:
      "Authorities called off the search operation as heavy snow continued to fall in the Himalayas.",
    content:
      "KATHMANDU: Nepali authorities suspended the search for 16 climbers swept away by an avalanche in the Himalayas, as continuing snowfall made further efforts too dangerous.\n\nRescue teams said the avalanche struck a route popular with commercial expeditions, burying tents and equipment under metres of snow.\n\nThe incident is the deadliest on the mountain this season and has renewed debate over overcrowding and safety on commercial climbs.\n\nOfficials said the search could resume if weather conditions improve.",
    author: "Asia Desk",
    date: "2026-09-29T11:10:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-14",
    title: "Man City found guilty of using 'sham' deals to distort finances",
    category: "Sport",
    summary:
      "The Premier League ruled the club breached financial rules, in a landmark decision that could bring heavy penalties.",
    content:
      "An independent panel has found Manchester City guilty of using sham sponsorship deals to inflate revenue and circumvent spending rules, the Premier League said.\n\nThe ruling follows a years-long investigation into the club's finances and could result in a points deduction or a heavy fine.\n\nThe club said it would appeal, describing the process as unfair and the findings as unfounded.\n\nLegal experts said the case could reshape how the league polices financial fair play.",
    author: "Sports Desk",
    date: "2026-09-29T09:35:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-15",
    title: "Commentary: The promise and peril of letting AI price our groceries",
    category: "Commentary",
    summary:
      "Dynamic pricing may lift margins for retailers, but it also risks eroding the trust that keeps shoppers loyal.",
    content:
      "Supermarkets are quietly experimenting with software that nudges prices up and down through the day, responding to demand, weather and even the time of the week.\n\nThe economics are seductive: a few extra cents on thousands of baskets adds up quickly.\n\nBut pricing is not just arithmetic. Shoppers notice when the same loaf of bread costs more on a rainy afternoon, and that feeling of being played is hard to win back.\n\nThe retailers that thrive will be the ones that use these tools to smooth supply, not to squeeze the last dollar from a captive customer.",
    author: "Mei Lin Tan",
    date: "2026-09-28T18:00:00",
    published: true,
    featured: false,
  },
  {
    id: "seed-16",
    title: "Commentary: Why coastal cities must plan now for the next big flood",
    category: "Commentary",
    summary:
      "Sea levels are rising faster than most infrastructure budgets assume — and adaptation can no longer wait for the next disaster.",
    content:
      "The floods that swept through Bangkok this month were a reminder that Asia's coastal cities sit on the front line of a warming world.\n\nYet too much of the response remains reactive: pump water out, rebuild, and wait for the next storm.\n\nWhat is needed instead is a shift toward long-term adaptation — elevated transit, sponge parks that absorb runoff, and honest maps of which neighbourhoods can be defended and which cannot.\n\nNone of this is cheap, but the cost of doing nothing is measured in lives and lost decades of growth.",
    author: "Arif Rahman",
    date: "2026-09-28T10:30:00",
    published: true,
    featured: false,
  },
];

// ---------------------------------------------------------------
// Catalogs (static demo content for home sections)
// ---------------------------------------------------------------
export const SEED_PODCASTS = [
  { id: "p1", title: "Foreigners in Malaysia — who gets to stay and who doesn't?", show: "CNA Correspondent", dur: "21 mins", ago: "3 hr ago" },
  { id: "p2", title: "Interest rates are up: should you pay down your debt now?", show: "Money Talks", dur: "27 mins", ago: "a day ago" },
  { id: "p3", title: "Retrenched? Here's how outplacement support can help", show: "Work It", dur: "27 mins", ago: "2 days ago" },
  { id: "p4", title: "Trump-Xi summit: did they both win?", show: "CNA Correspondent", dur: "22 mins", ago: "4 days ago" },
];

export const SEED_VIDEOS = [
  { id: "v1", title: "Asian Games 2026: Singapore's Loh Kean Yew misses out on badminton gold", kind: "News Report", dur: "2m", ago: "11 hr ago" },
  { id: "v2", title: "Inside the National Museum's revamped Singapore History Gallery", kind: "Lifestyle", dur: "1m 19s", ago: "2 hr ago" },
  { id: "v3", title: "When you run a pizza business from home as husband and wife", kind: "Insider", dur: "1m 49s", ago: "5 hr ago" },
  { id: "v4", title: "Singapore wins first medal in digital construction at WorldSkills", kind: "News Report", dur: "6m", ago: "11 hr ago" },
  { id: "v5", title: "Scrapping PSLE could create new pressures for students: David Neo", kind: "Shorts", dur: "2m 01s", ago: "1 hr ago" },
];

export const SEED_VISUAL = [
  { id: "s1", title: "Thai Airways to clear 5,000 bags stranded at Bangkok airport", ago: "20 hr ago" },
  { id: "s2", title: "New cat species identified in Bolivia, first in over a century", ago: "22 hr ago" },
  { id: "s3", title: "Singapore athletes in action at the 20th Asian Games", ago: "2 days ago" },
  { id: "s4", title: "Bangkok floods force thousands into shelters", ago: "2 days ago" },
  { id: "s5", title: "What happens to Singapore's unwanted clothes?", ago: "8 days ago" },
];

export const NEWSLETTERS = [
  { id: "n1", name: "Morning Brief", cadence: "Daily", blurb: "An automated feed of our top stories to start your morning." },
  { id: "n2", name: "Recommended Read", cadence: "As it happens", blurb: "A handpicked story that we think you shouldn't miss." },
  { id: "n3", name: "Week in Review", cadence: "Weekly", blurb: "Our chief editor shares analysis and picks of the week's biggest news." },
  { id: "n4", name: "CNA TODAY Big Read", cadence: "Weekly", blurb: "A deep dive into the big issues that matter." },
  { id: "n5", name: "CNA Insider", cadence: "Weekly", blurb: "Current affairs and documentaries with a deeper look at Asia." },
];

export const EDITIONS = [
  { id: "world", name: "World", label: "International edition", home: "/us" },
  { id: "singapore", name: "Singapore", label: "Singapore edition", home: "/singapore" },
  { id: "asia", name: "Asia", label: "Asia edition", home: "/asia" },
  { id: "indonesia", name: "Indonesia", label: "Bahasa Indonesia", home: "https://www.cna.id/" },
];

export const STATS = [
  { value: "24/7", label: "Live news coverage" },
  { value: "10M+", label: "Monthly readers" },
  { value: "1,600+", label: "Stories published weekly" },
  { value: "200+", label: "Reporters across Asia" },
];

// ---------------------------------------------------------------
// Articles (async — local IndexedDB via db.js)
// ---------------------------------------------------------------
export async function getArticles() {
  await dbSeedIfEmpty("articles", SEED_ARTICLES);
  return dbGetAll("articles");
}

export async function saveArticles(articles) {
  await dbClear("articles");
  for (const a of articles) await dbPut("articles", a);
}

export async function getArticleById(id) {
  const a = await dbGet("articles", id);
  return a || null;
}

export function makeId() {
  return "a-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------------------------------------------------------------
// Bookmarks (async — local IndexedDB)
// ---------------------------------------------------------------
export async function getBookmarks() {
  return (await dbGetAll("bookmarks")).map((b) => b.id);
}
export async function saveBookmarks(ids) {
  await dbClear("bookmarks");
  for (const id of ids) await dbPut("bookmarks", { id });
}
export async function isBookmarked(id) {
  return !!(await dbGet("bookmarks", id));
}
export async function toggleBookmark(id) {
  if (await isBookmarked(id)) { await dbDelete("bookmarks", id); return false; }
  await dbPut("bookmarks", { id });
  return true;
}

// ---------------------------------------------------------------
// Follows (async — local IndexedDB)
// ---------------------------------------------------------------
export async function getFollows() {
  return (await dbGetAll("follows")).map((f) => f.author);
}
export async function saveFollows(list) {
  await dbClear("follows");
  for (const author of list) await dbPut("follows", { author });
}
export async function isFollowed(author) {
  return !!(await dbGet("follows", author));
}
export async function toggleFollow(author) {
  if (await isFollowed(author)) { await dbDelete("follows", author); return false; }
  await dbPut("follows", { author });
  return true;
}
