import { useNavigate } from "react-router-dom";

const icons = {
  document: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v4h4 M10 13h6 M10 16.5h6 M10 9.5h2"
    />
  ),
  review: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 5h9l4 4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z M15 5v4h4 M9 14.5l2 2 4-4.5"
    />
  ),
  history: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12a7 7 0 1 1 2.3 5.2 M5 12V8 M5 12H9 M12 8.5V12l2.5 1.5"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 4.5v2M14 4.5v2M4.5 8.5h11M4.5 6.5A1 1 0 0 1 5.5 5.5h9a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V6.5Z M7.5 11h1.2M11.5 11h1.2M7.5 13.2h1.2"
    />
  ),
  roles: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.2 10.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z M3.6 18c.5-2.8 2.4-4.5 4.6-4.5s4.1 1.7 4.6 4.5 M15.4 10.2a2.3 2.3 0 1 0 0-4.6 M17 18c-.3-1.9-1.2-3.3-2.5-4"
    />
  ),
  folder: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7a1 1 0 0 1 1-1h4l1.6 1.8H19a1 1 0 0 1 1 1V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
    />
  ),
};

const Icon = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-5 w-5"
  >
    {icons[name]}
  </svg>
);

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    icon: "document",
    title: "Article creation & editing",
    body: "Writers draft articles with a title, summary and section, then keep refining the draft until it is ready to submit.",
  },
  {
    icon: "review",
    title: "Structured review & approval",
    body: "Editors open every submission in a dedicated review screen and either approve it or send it back with feedback.",
  },
  {
    icon: "history",
    title: "Revisions & full history",
    body: "Every status change and edit is recorded, so nothing about how an article reached publication is ever lost.",
  },
  {
    icon: "calendar",
    title: "Scheduled publishing",
    body: "Approved articles can be scheduled ahead of time and are published automatically when their date arrives.",
  },
  {
    icon: "folder",
    title: "Section organization",
    body: "Articles live under editorial sections with an owner and an assigned list of writers, keeping desks separate.",
  },
  {
    icon: "roles",
    title: "Role-based access",
    body: "Writers and editors see different tools and routes, so everyone works inside the part of the workflow meant for them.",
  },
];

const STEPS = [
  { status: "DRAFT", label: "Draft", body: "A writer starts an article inside their section." },
  { status: "SUBMITTED", label: "Submit", body: "The draft is submitted and enters the review queue." },
  { status: "CHANGES_REQUESTED", label: "Review", body: "An editor approves it or requests changes." },
  { status: "APPROVED", label: "Approve", body: "Once approved, the article is ready to go out." },
  { status: "SCHEDULED", label: "Schedule", body: "An editor sets a publish date, or publishes right away." },
  { status: "PUBLISHED", label: "Publish", body: "The article goes live and appears in Published." },
];

const BOARD_COLUMNS = [
  { label: "Draft", tone: "bg-hairline" },
  { label: "Submitted", tone: "bg-press/70" },
  { label: "Approved", tone: "bg-ink/70" },
  { label: "Published", tone: "bg-press" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      {/* Masthead rule */}
      <div className="h-[3px] bg-press" />

      {/* Nav */}
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif text-xl text-ink"
          >
            Editorial Workflow
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-[15px] font-medium text-ink transition-colors hover:text-press"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded bg-blue-600 px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="animate-[fadeUp_0.6s_ease-out]">
            <p className="text-[15px] text-press">For writers and editors</p>
            <h1 className="mt-3 font-serif text-[2.75rem] leading-[1.1] text-ink md:text-[3.4rem]">
              A smarter way to manage your editorial workflow
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">
              Editorial Workflow gives writers and editors one structured
              place to draft, submit, review, approve, schedule and publish
              articles — with a clear record of every step along the way.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="rounded bg-blue-600 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded border border-hairline px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:border-ink"
              >
                Login
              </button>
            </div>
          </div>

          {/* Static workflow mockup */}
          <div className="animate-[fadeUp_0.7s_ease-out] rounded border border-hairline bg-white p-5 shadow-[0_1px_2px_rgba(28,27,24,0.06)]">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <span className="text-sm font-medium text-ink">This week</span>
              <span className="text-xs text-muted">Editorial calendar</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {BOARD_COLUMNS.map((col) => (
                <div key={col.label}>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${col.tone}`} />
                    <span className="text-[11px] text-muted">{col.label}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="h-12 rounded border border-hairline bg-paper/60" />
                    <div className="h-12 rounded border border-hairline bg-paper/60" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded border border-hairline bg-paper px-3 py-2.5">
              <span className="text-[13px] text-muted">Overdue reviews</span>
              <span className="rounded-full bg-press px-2 py-0.5 text-[11px] font-medium text-white">
                2
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-hairline bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-lg">
            <h2 className="font-serif text-[2rem] text-ink">
              Built around how editorial teams actually work
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Every part of the app maps to a real step a writer or editor
              takes, from a first draft to a published piece.
            </p>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="border-t border-hairline pt-5">
                <div className="text-press">
                  <Icon name={feature.icon} />
                </div>
                <h3 className="mt-3 text-[16px] font-medium text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-lg">
            <h2 className="font-serif text-[2rem] text-ink">
              From draft to publication
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Every article moves through the same set of stages, and the
              app always shows exactly where it stands.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
            {STEPS.map((step, i) => (
              <div key={step.status} className="relative">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink text-[12px] font-medium text-ink">
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="hidden h-px flex-1 bg-hairline md:block" />
                  )}
                </div>
                <h3 className="mt-3 text-[15px] font-medium text-ink">
                  {step.label}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[13.5px] text-muted">
            If an editor requests changes, the article returns to the
            writer for revision and re-enters the review step once resubmitted.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section id="about" className="border-t border-hairline bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-[2rem] text-ink">
            One workflow, two roles
          </h2>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:divide-x md:divide-hairline">
            <div>
              <h3 className="font-serif text-xl text-ink">For writers</h3>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
                <li>Create and edit articles inside assigned sections</li>
                <li>Submit drafts for editorial review</li>
                <li>Revise articles sent back with feedback</li>
                <li>Track every article's status from one place</li>
              </ul>
            </div>
            <div className="md:pl-12">
              <h3 className="font-serif text-xl text-ink">For editors</h3>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
                <li>Review submitted articles and request changes</li>
                <li>Approve, schedule and publish finished work</li>
                <li>Manage sections and the writers assigned to them</li>
                <li>Get alerted when a review is overdue</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-serif text-[2rem] text-paper md:text-[2.4rem]">
            Ready to streamline your editorial workflow?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-paper/70">
            Create an account and start moving articles from draft to
            publication today.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-8 rounded bg-blue-600 px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <p className="font-serif text-lg text-ink">Editorial Workflow</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                A structured home for drafting, reviewing and publishing
                articles.
              </p>
            </div>

            <div className="flex gap-16">
              <div>
                <p className="text-[13px] font-medium text-ink">Navigate</p>
                <ul className="mt-3 space-y-2 text-[14px] text-muted">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="hover:text-ink">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[13px] font-medium text-ink">Account</p>
                <ul className="mt-3 space-y-2 text-[14px] text-muted">
                  <li>
                    <button onClick={() => navigate("/login")} className="hover:text-ink">
                      Login
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/register")} className="hover:text-ink">
                      Sign up
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-hairline pt-6 text-[13px] text-muted">
            © {new Date().getFullYear()} Editorial Workflow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;