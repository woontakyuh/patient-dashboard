import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpineTrack — Perioperative tracking for spine surgery patients",
  description:
    "SpineTrack guides spine surgery patients from pre-op preparation to full recovery, collects patient-reported outcomes for clinicians, and flags problems early.",
};

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          dark ? "bg-slate-900" : "bg-white/10"
        }`}
      >
        <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="3" r="2" />
          <circle cx="10" cy="7.5" r="1.8" />
          <circle cx="10" cy="11.5" r="1.6" />
          <circle cx="10" cy="15" r="1.4" />
          <circle cx="10" cy="18" r="1.2" />
        </svg>
      </div>
      <span
        className={`text-[15px] font-semibold tracking-tight ${
          dark ? "text-slate-900" : "text-white"
        }`}
      >
        SpineTrack
      </span>
    </div>
  );
}

const features = [
  {
    title: "Surgical journey timeline",
    body: "From admission to full recovery: what to do today and what comes next, at a glance.",
  },
  {
    title: "Patient-reported outcomes",
    body: "Short, regular questionnaires (VAS, ODI, NDI, EQ-5D) turn pain and function into trackable numbers.",
  },
  {
    title: "Recovery charts",
    body: "Results are visualized over time so patients and clinicians can see whether recovery is on track.",
  },
  {
    title: "Stage-based education",
    body: "Pre-op preparation, post-discharge precautions and rehab exercises, delivered at the right time.",
  },
  {
    title: "AI assistant with triage",
    body: "Patients can ask everyday recovery questions. Warning signs are routed to the care team.",
  },
  {
    title: "Daily checklist",
    body: "Tasks and outpatient appointments so nothing important is missed.",
  },
];

const screens = [
  {
    src: "/screens/demo-home.png",
    alt: "SpineTrack patient home screen",
    title: "Home",
    body: "Surgery details, days since surgery, today's tasks and the next clinic visit.",
  },
  {
    src: "/screens/demo-prom.png",
    alt: "SpineTrack PROM questionnaire screen",
    title: "PROM questionnaire",
    body: "Pain, back function, neurological and daily function, and overall health.",
  },
  {
    src: "/screens/demo-progress.png",
    alt: "SpineTrack recovery charts",
    title: "Recovery charts",
    body: "Pain, ODI and EQ-VAS trends against the pre-op baseline.",
  },
  {
    src: "/screens/demo-timeline.png",
    alt: "SpineTrack surgical journey timeline",
    title: "Journey timeline",
    body: "Every stage from admission to the 1-year follow-up, with what to do at each step.",
  },
];

const steps = [
  { n: "01", title: "Scan the QR code", body: "Patients receive a QR code at admission that opens their personal dashboard." },
  { n: "02", title: "Daily check-in", body: "A one-minute questionnaire records how recovery is going." },
  { n: "03", title: "Track progress", body: "Results are charted against pre-op baseline and monitored by the care team." },
  { n: "04", title: "Ask anytime", body: "Questions on rehab, return to daily life and pain management, 24/7." },
];

export default function EnglishLandingPage() {
  return (
    <div lang="en">
      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <a href="/en">
            <Logo />
          </a>
          <div className="flex items-center gap-1">
            <a href="#product" className="hidden rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/60 hover:text-white sm:block">
              Product
            </a>
            <a href="#screens" className="hidden rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/60 hover:text-white sm:block">
              Screens
            </a>
            <a href="#company" className="hidden rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/60 hover:text-white sm:block">
              Company
            </a>
            <a href="/" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/60 hover:text-white">
              한국어
            </a>
            <a
              href="https://dashboard.spinetrack.ai"
              className="ml-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-white/20"
            >
              Clinician login
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[80dvh] items-center overflow-hidden bg-[#0a0f1a]">
          <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[150px]" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-sky-400/60" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-sky-400/80">
                  Patient Recovery Platform
                </span>
              </div>
              <h1 className="mt-7 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
                Automated perioperative tracking
                <br />
                <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  for spine surgery patients
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-slate-400">
                SpineTrack shows patients where they are in their surgical journey, from pre-op
                preparation to full recovery. It collects patient status and patient-reported
                outcomes for clinicians, flags problems early, and analyzes outcomes by surgery type.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#product" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
                  Learn more
                </a>
                <a href="#company" className="rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 hover:text-white">
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Product */}
        <section id="product" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Product</h2>
            <p className="mt-3 max-w-2xl text-slate-500">
              One platform for patients and their care team, designed by a practicing spine surgeon.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screens */}
        <section id="screens" className="border-t border-slate-100 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">See it in action</h2>
            <p className="mt-3 max-w-2xl text-slate-500">
              The patient app as patients see it on their phones (Korean UI, fictional demo patient).
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {screens.map((s) => (
                <figure key={s.src}>
                  <div className="overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-slate-50 shadow-xl">
                    <img src={s.src} alt={s.alt} width={480} height={844} className="block h-auto w-full" loading="lazy" />
                  </div>
                  <figcaption className="mt-4">
                    <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">{s.body}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-10 text-sm text-slate-500">
              Try the live demo:{" "}
              <a href="https://patient.spinetrack.ai/DEMO" className="font-medium text-sky-600 hover:underline">
                patient.spinetrack.ai/DEMO
              </a>{" "}
              (demo code: 800101)
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50/80 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n}>
                  <div className="text-sm font-semibold text-sky-500">{s.n}</div>
                  <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For whom */}
        <section className="py-24">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-8">
              <h3 className="text-lg font-semibold text-slate-900">For patients</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>✓ Daily guidance on what to do and what to avoid</li>
                <li>✓ Objective view of recovery in numbers</li>
                <li>✓ 24/7 answers to everyday recovery questions</li>
                <li>✓ Reminders for upcoming visits and preparation</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 p-8">
              <h3 className="text-lg font-semibold text-slate-900">For clinicians</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>✓ Real-time PROM collection and trend charts per patient</li>
                <li>✓ Identify non-responders and manage response rates</li>
                <li>✓ Triage and prioritize patient questions</li>
                <li>✓ Outcome dashboards by surgery type</li>
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-6xl px-6 text-xs leading-relaxed text-slate-400">
            SpineTrack provides general health information and recovery guidance. It does not
            provide medical advice, diagnosis or treatment. Patients should always follow the
            instructions of their own care team.
          </p>
        </section>

        {/* Company */}
        <section id="company" className="border-t border-slate-100 bg-slate-50/80 py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Company</h2>
              <p className="mt-4 text-slate-600">
                SpineTrack was founded in March 2026 in Hwaseong (Dongtan), Gyeonggi-do, Korea, to make post-operative
                recovery measurable and less uncertain for spine surgery patients and their care
                teams.
              </p>
              <div className="mt-8 space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-900">Woon Tak Yuh, MD</div>
                  <div className="text-slate-500">Founder &amp; CEO · Spine surgeon</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Tae Shin Kim</div>
                  <div className="text-slate-500">CTO</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-8">
              <h3 className="text-lg font-semibold text-slate-900">Contact</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400">Email</dt>
                  <dd>
                    <a href="mailto:woontakyuh@spinetrack.ai" className="font-medium text-sky-600 hover:underline">
                      woontakyuh@spinetrack.ai
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Address</dt>
                  <dd className="text-slate-700">
                    150, Dongtanyeongcheon-ro, Dongtan-gu, Hwaseong-si,
                    <br />
                    Gyeonggi-do 18462, Republic of Korea
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Founded</dt>
                  <dd className="text-slate-700">March 2026</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
          <Logo dark />
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SpineTrack · Hwaseong-si, Gyeonggi-do, Korea ·{" "}
            <a href="mailto:woontakyuh@spinetrack.ai" className="hover:text-slate-600">
              woontakyuh@spinetrack.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
