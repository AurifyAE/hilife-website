# PRD: Hi-Life Furniture Rentals Website + Lead Admin

| | |
|---|---|
| **Status** | Draft v0.4: collections and staff count confirmed; ready for sign-off (14 Sep 2026) |
| **Source** | Codex planning session "Plan furniture rental website", brochure (*New brochure Hi life_Compressed.pdf*), reference sites homekode.com and electrasolutions.com |
| **Current build state** | Homepage header and hero built in Next.js 16 and redesigned to the shared reference. Nothing else is built yet |

> **TBD** means not decided yet. **Proposed** means a recommendation that needs sign-off. **Deferred** means the owner will decide later.

---

## 1. Executive Summary

**Problem statement**
Hi-Life's furniture range only exists in a PDF brochure. B2B event clients can't search it or send a structured enquiry, and the team has no single place to see and follow up on leads.

**Proposed solution**
There are two parts:
1. **Public website.** An English-only B2B rental catalogue covering all of the UAE. There are no prices and no payments on the site, and every request goes through an enquiry form.
2. **Simple lead admin.** A private admin area where every enquiry is saved as a lead. The team gets a WhatsApp notification and handles the lead there: customer details, requested products, status and notes.

**Success criteria**
1. Enquiries go from the current **10–15 per month** to **at least 25 per month** within 3 months of launch (target Proposed).
2. **100% of website enquiries** are saved in the admin, and the WhatsApp notification is delivered within **60 seconds**.
3. Every lead is moved out of "New" within **1 business day**.
4. Lighthouse scores of **90 or higher** for Performance, Accessibility and SEO on mobile for the homepage, catalogue and product pages.

---

## 2. Confirmed Decisions

| Decision | Value |
|---|---|
| Coverage | All UAE |
| Audience | B2B: event agencies, corporate clients, wedding planners, exhibition companies, hotels |
| Language | English only |
| Prices | **Not shown on website and not stored in the admin**. Quotes are handled outside the system |
| Payments | None |
| Availability | Checked manually by the team, outside the system |
| Lead management | **Simple custom admin**: leads, notifications, customer details, status, notes. **Not a full CRM** |
| WhatsApp | **Internal lead notifications only**, sent to **one internal number** (number to be provided later) |
| Admin users | **2 staff logins** at launch |
| Header CTA | **Request a Quote** |
| Main navigation | **Furniture · Events · Portfolio · Contact** |
| Collections (homepage + catalogue) | **Chairs · Arm Chairs · Bar Stools · Office Chairs · Sofas · Pouffes · Furniture Sets · Tables · Accessories & Appliances** (9 total) |
| Logo | **Placeholder logo** for now; owner will supply the original later |
| About page | Includes the relationship with **Palm Corner Events** and **VK Exhibitions** |
| Rental rules | Not included in this version |
| Content readiness | Excel/CSV catalogue, original images, portfolio, testimonials and company info are available and approved |
| Domain / hosting / email | Already owned; Vercel hosting confirmed |
| Timeline / budget | Not constrained by this PRD |
| Analytics / email provider | Deferred |

---

# PART A: PUBLIC WEBSITE

## A1. User Personas
| Persona | Need |
|---|---|
| Event agency planner | Shortlist many items quickly and request a quote for specific dates |
| Corporate client | Furnish a corporate event or temporary office without buying |
| Wedding planner | Browse by style and colour to match a theme |
| Exhibition company | Bulk seating and tables delivered to a venue on a fixed date |
| Hotel / hospitality buyer | Extra furniture for hosted events or outdoor setups |

## A2. Sitemap
- **Header nav:** Furniture · Events · Portfolio · Contact · [Request a Quote]
- **Furniture:** Collections → Catalogue listing → Product detail
- **Events:** service pages per event type (Corporate events & exhibitions, Weddings & celebrations, Brand activations, Outdoor events, Temporary offices)
- **Portfolio:** photo gallery, each photo tagged with an event type (filterable; no written case studies)
- **Contact**
- **Footer:** About (incl. Palm Corner Events & VK Exhibitions), Catalogue download, Privacy, Terms
- **Utility:** Enquiry list, Quote form, Thank-you page

## A3. Customer Flow
```
Home / Collections → Catalogue (filter, search) → Product page → Add to Enquiry (qty)
  → Enquiry list → Quote form → Thank-you
  → [Admin] lead saved → WhatsApp notification to internal number
```

## A4. User Stories & Acceptance Criteria

**A-1 Homepage**
*As a B2B buyer, I want to understand right away what Hi-Life rents and where, so that I know whether it fits my event.*
- The header has the placeholder logo, the nav "Furniture · Events · Portfolio · Contact" and a **Request a Quote** button.
- The placeholder logo is a single swappable component or asset.
- Hero follows the approved reference design.
- Sections, in order (Proposed): Collections · Events we furnish · Portfolio highlights · About strip (Palm Corner Events / VK Exhibitions) · Testimonials · Catalogue download · Quote CTA.
- Montserrat with a documented type scale (H1–H6, body, small, button) and spacing scale used site-wide.
- Responsive at 360px, 768px, 1024px and 1440px with no horizontal scroll.

**A-2 Collections**
*As an event planner, I want to jump straight to the type of furniture I need, so that I can find items quickly.*
- There are 9 collections, and they are the same as the catalogue categories: **Chairs · Arm Chairs · Bar Stools · Office Chairs · Sofas · Pouffes · Furniture Sets · Tables · Accessories & Appliances**.
- The homepage shows all 9 as image cards (name + cover image). Each card opens the catalogue filtered to that collection.
- Each collection's cover image and short description are managed in the CMS. Products are assigned to a collection using the category column in the Excel/CSV.

**A-3 Catalogue browsing**
*As an event planner, I want to filter by collection, style, colour, indoor/outdoor and event type, so that I can shortlist items quickly.*
- The collection filter uses the 9 collections in A-2.
- Every product in the Excel/CSV must belong to exactly one of the 9 collections; the import script flags any that don't.
- Filters can be combined, are reflected in the URL and can be shared. Search matches name and reference code.
- Results return in **under 500ms** for the full catalogue.
- Empty state links to "Request a custom item".

**A-4 Product detail**
*As a buyer, I want full specs, so that I can confirm fit and style.*
- Shows: gallery, name, reference code, dimensions, colour, category, style, indoor/outdoor, related products.
- Actions: quantity, **Add to Enquiry**, **Request a Quote**.
- No price appears anywhere.

**A-5 Enquiry list & quote form**
*As a buyer, I want to send one enquiry for many products with my event details, so that I get one consolidated quote.*
- The enquiry list is kept on the device (local storage); users can edit quantities and remove items.
- Required fields: name, company, email, phone, customer type, event type, event date, emirate/venue, products + quantities.
- Optional fields: notes, file upload (floor plan / mood board; PDF/JPG/PNG, max 10MB).
- Validation runs on both client and server, with a honeypot and bot protection.
- If saving the lead fails, the customer sees an error and can retry. The submission is never silently lost.

**A-6 Events (services) pages**
*As a corporate client, I want to see how Hi-Life handles my type of event, so that I trust them with the setup.*
- Each page links to relevant collections, portfolio projects and the quote form.

**A-7 Portfolio**
*As a planner, I want to see completed setups, so that I can picture the result.*
- Photos only (no case studies yet): each photo is tagged with an event type, the gallery filters by it, photos open full size, and each event page shows its own photos.

**A-8 Contact & catalogue download**
- The contact form also creates a lead, with source "Contact form".
- Catalogue download: a short form (name, company, email, phone) unlocks the PDF and creates a lead with source "Catalogue download".

**A-9 Content management**
*As an admin, I want to edit products, collections, events pages, portfolio and testimonials without a developer.*
- Managed in Sanity CMS.
- The Excel/CSV catalogue is imported with a repeatable script, matched on reference code.

## A5. Website Non-Goals
Public prices · online payment · customer accounts · live availability · Arabic · rental rules pages · two-way WhatsApp · mobile app.

---

# PART B: LEAD ADMIN (Simple)

A private area of the same website (e.g. `/admin`). It does one job: **receive leads, notify the team, and let staff handle each lead with the customer's details.**

## B1. Lead Flow
```
Customer submits form ─► Lead saved (status: New) ─► WhatsApp notification to internal number
   ─► Staff open lead in admin ─► Contact customer (phone / email)
   ─► Update status + add notes ─► Won or Lost
```

## B2. Features

### 1. Login
- Email and password login for staff, plus password reset.
- **2 staff accounts** at launch. Both have the **same access** (no roles), and the owner can add or remove accounts later.

### 2. New Lead Notification
- **WhatsApp message to one internal number** for every new lead. The message includes:
  - Customer name, company, phone, email
  - Event type, event date, emirate/venue
  - Requested products or collection, with quantities
  - Link that opens the lead in the admin
- **No prices** in the message.
- Leads not yet opened show a "New" badge in the admin, and the list shows a count of new leads.

### 3. Leads List
- Table of all leads, newest first: date received, customer name, company, phone, event type, event date, source, status.
- Search by name, company, phone or email.
- Filter by status and by date range.

### 4. Lead Detail
- **Customer details:** name, company, customer type, email (click to email), phone (click to call).
- **Event details:** event type, event date, emirate/venue.
- **Requested products:** image, name, reference code, quantity (each links to the product page).
- **Attachment:** download the uploaded file.
- **Message / notes from the customer.**
- **Source:** Quote form, Contact form or Catalogue download, plus the date and time received.

### 5. Handle the Lead
- **Status:** New → Contacted → Quote sent → Won / Lost. Changed with a single dropdown.
- **Internal notes:** staff add notes such as "Called, needs 50 chairs, sending quote tomorrow". Each note shows the author and time.
- Status changes are recorded automatically in the notes list, so the history is visible.

## B3. Admin User Stories

| ID | Story | Acceptance criteria |
|---|---|---|
| B-1 | As staff, I want every website enquiry saved as a lead, so that nothing gets lost. | Lead appears in the admin within 10s of submit, with all form fields, products and attachment |
| B-2 | As staff, I want a WhatsApp notification for new leads, so that we respond quickly. | Delivered to the internal number within 60s; contains customer and event details and an admin link; no prices |
| B-3 | As staff, I want to see all the customer's details in one place, so that I can contact them right away. | Lead page shows contact, event, products and attachment; phone and email are clickable |
| B-4 | As staff, I want to update the status and add notes, so that the team knows where each lead stands. | Status saved instantly; notes show author and time; history visible on the lead |
| B-5 | As staff, I want to search and filter leads, so that I can find a customer quickly. | Search by name, company, phone or email; filter by status and date |
| B-6 | As the owner, I want only my team to access the admin. | Every admin page and API needs a login; the owner can add or remove staff |

## B4. Admin Non-Goals
The admin will **not** include:
- Quotations, prices or invoices
- Sales pipeline boards, reports or dashboards
- Staff roles or lead assignment
- Stock or availability tracking
- Customer login or customer portal
- Emailing or messaging customers from the admin

## B5. Possible Later Add-ons (not committed)
Assign lead to a staff member · export leads to CSV · follow-up reminder date · simple monthly lead count.

---

# PART C: TECHNICAL SPECIFICATIONS

## C1. Architecture
```
                  ┌──────────── Next.js 16 app on Vercel ─────────────┐
[Customer] ──────►│  Public website (/)  ◄── Sanity CMS (products,     │
                  │                          collections, content)      │
                  │  Form API ─► validate + bot check + upload file    │
                  │      └─► save Lead to database                     │
                  │      └─► send WhatsApp notification                │
[Staff] ─────────►│  Lead admin (/admin) ─ login                       │
                  └───────────────────────┬────────────────────────────┘
                                          │
                                PostgreSQL database
                          (leads, lead products, notes, staff users)
```

## C2. Stack
| Layer | Choice | Status |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Agreed |
| Styling | Tailwind CSS + Hi-Life design tokens, Montserrat | Agreed |
| Components | shadcn/ui (website + admin) | Agreed |
| CMS | Sanity (products, collections, events, portfolio, testimonials) | Agreed |
| Database (leads) | PostgreSQL (e.g. Neon or Supabase) | Proposed |
| Admin login | Auth.js (email + password) | Proposed |
| File uploads | Vercel Blob (private) | Proposed |
| WhatsApp | WhatsApp Business Cloud API (Meta) using an approved message template | Proposed |
| Analytics / email | Deferred | Deferred |
| Hosting | Vercel + existing domain | Agreed |

## C3. Data Model (Admin)
- `User`: name, email, password hash
- `Lead`: customer name, company, customer type, email, phone, event type, event date, venue/emirate, message, source, status, created time, opened flag
- `LeadProduct`: lead, product reference code, product name, quantity
- `LeadNote`: lead, author, text, created time (also stores status-change entries)
- `Attachment`: lead, private file URL, file name

## C4. Security & Privacy
- Every admin page and API needs a login.
- Secrets (database, WhatsApp token) live in server environment variables only.
- HTTPS everywhere; rate limiting and bot protection on public forms.
- Uploads are limited by type and size and stored privately, with signed download links for staff only.
- Daily database backups.
- UAE PDPL-aligned privacy policy and a consent checkbox on forms.

---

# PART D: RISKS & ROADMAP

## D1. Phased Rollout
| Phase | Scope |
|---|---|
| **0. Foundation** *(in progress)* | Next.js setup, design system, header (placeholder logo, new nav, Request a Quote) + hero |
| **1. Website MVP** | Full homepage with collections, catalogue + filters + search, product pages, enquiry list + quote form, Events, Portfolio, About, Contact, Sanity + CSV import, SEO basics |
| **2. Lead Admin** *(launches together with the website)* | Database, admin login, lead saving from all forms, WhatsApp notification, leads list, lead detail, status + notes |
| **3. Later (optional)** | Items from B5, catalogue download gate, SEO landing pages per emirate and event type |

**Launch gate:** the website goes live only when leads save correctly and WhatsApp notifications arrive.

## D2. Risks
| Risk | Impact | Mitigation |
|---|---|---|
| WhatsApp Business API verification and template approval take time | Notifications not ready at launch | Start Meta Business verification early; leads still save in the admin, and the "New" badge works without WhatsApp |
| Catalogue data quality (codes, colours, categories) | Broken filters | Validate the CSV before import; one clean-up pass with the owner |
| Spam submissions | Fake leads and noise | Honeypot, bot protection and rate limiting |
| Placeholder logo reaches production | Brand issue | Logo swap is a launch checklist item |
| Scope creep back toward a full CRM | Delay | New admin features go through B5 as separate, approved add-ons |

---

## E. Open Items

**Deferred (owner will decide later):**
- Email provider
- Analytics
- Original logo file
- **Internal WhatsApp number**: the website and admin can be built without it, but it is needed before launch. A sending business number also needs Meta verification, which can take several days.

**Needed during development (content, not decisions):**
- Excel/CSV catalogue, with every product assigned to one of the 9 collections
- Original product images
- Cover image for each of the 9 collections
- Portfolio projects, testimonials and company/contact details
- Names and emails of the 2 staff who need admin logins
