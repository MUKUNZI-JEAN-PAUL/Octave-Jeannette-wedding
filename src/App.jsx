import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ────────────────────────────────────────────────────────────
 *  EDIT ME — everything you need to personalize lives here.
 * ────────────────────────────────────────────────────────────
 */
const CONFIG = {
  partner1: "Octave",
  partner2: "Jeannette",

  weddingDateISO: "2026-12-27T09:00:00", // drives the countdown
  weddingDayLine: "Sunday · 27 December 2026 · Kigali",
  weddingDateDisplay: "Sunday, 27 December 2026",
  city: "Kigali, Rwanda",

  // A short poetic line or two for the very top of the invitation.
  // Wrap any part in *asterisks* to italicize it, like the closing line here.
  introLines: [
    "Before we knew, God was preparing our hearts,",
    "Love found us in His perfect time and grace,",
    "*And in each other, we found the one our souls love.*",
  ],

  greeting:
    "Dear family and friends, on 27th December we will stand together and speak the words that turn two lives into one. Come and be our witnesses — bring your prayers, your laughter, and your dancing shoes; the rest we'll take care of.",

  // Optional short welcome line under the greeting. Leave as "" to hide it.
  localWelcome: "You are warmly invited.",

  // "Our story" section — set storyPhoto to a file you add in /public,
  // or leave it as-is and a labeled placeholder will show instead.
  storyTitle: "How it began",
  story:
       "It started on an evening like any other, during choir rehearsal. Voices filled the room, the music rose, and somewhere between the first scale and the final song, we found each other. What began as easy conversation after practice soon grew into a friendship, and then into something deeper. Through the years, we have shown up for one another in every season. in new cities, on long drives, and in the small, everyday moments that slowly became home. Along the way, we learned that the harmony we first found in song is the same one we share in life. Now, surrounded by the people who have shaped us, we are ready to begin our next chapter and promise each other forever.",
  storyPhoto: "/story-photo.jpeg",

  schedule: [
    {
      time: "9:00 AM",
      title: "Dowry",
      place: "Makita tent Kimironko",
      description: "Celebrating love, tradition and the union of two families.",
      items: [],
    },
    {
      time: "2:00 PM – 4:30 PM",
      title: "Religious wedding",
      place: "chapelle Jésuite Kimironko",
      description: "Joining our hearts in love and committing our lives before God.",
      items: [],
    },
    {
      time: "5:00 PM - 6:00 PM",
      title: "Taking picture",
      place: "Makita tent Kimironko",
      description: "Capturing beautiful moments to treasure for a lifetime.",
      items: [],
    },
    {
      time: "From 6:00 PM",
      title: "Reception",
      place: "Makita tent Kimironko",
      description: "Celebrating our love with family, Until the joy runs out.",
      items: [], 
    }
  ],

  galleryTitle: "Us, Lately",

  venueName: "Makita tent Kimironko",
  mapQuery: "MAKITA Tent Design Kimironko, Kigali, Rwanda",

  dressCode: " Wear your finest to celebrate with us in style.",

  rsvpBy: "27 December 2026",

  // Where RSVP replies get emailed. rsvpEmail is required (this is where
  // the free FormSubmit.co service sends them); rsvpCcEmail is optional —
  // leave it "" to send to just one address.
  //
  // IMPORTANT ONE-TIME STEP: the very first RSVP submitted after you
  // deploy will NOT arrive as a reply — instead, FormSubmit sends an
  // activation email to rsvpEmail with a "Confirm" link. Someone must
  // click that link once before any replies start arriving normally.
  // It's free and needs no account or sign-up.
  rsvpEmail: "romeoctave11@gmail.com",
  rsvpCcEmail: "janetreigns98@gmail.com",

  // ── CONTACTS (VIEW ONLY) ──
  // Only DISPLAYED on the last page ("Get in touch"). NOT used for RSVPs.
  // numbers: one or more phone numbers per person — add as many as you like.
  //          Any format works ("0784259192", "+250 784 259 192", ...).
  // email:   optional — leave it out to hide.
  contacts: [
    {
      label: "Jeannette",
      role: "The bride",
      numbers: ["250784259192", "250781323010"], // <- replace the 2nd number
    },
    {
      label: "Octave",
      role: "The groom",
      numbers: ["250782020662", "250788654711"], // <- replace the 2nd number
    },
  ],

  // ── OPTIONAL: RSVP via WhatsApp ──
  // RSVPs are delivered by EMAIL (rsvpEmail above). Leave this list empty
  // and no WhatsApp buttons appear in the form. If you ever want them,
  // add entries like { label: "Octave", number: "250788123456" }.
  rsvpWhatsapp: [],
};

/** Photo placeholders — drop real files into /public and update these paths. */
const GALLERY = [
  { src: "/1.jpeg", alt: "Add a photo of the two of you" },
  { src: "/2.jpeg", alt: "Add a favorite candid" },
  { src: "/3.jpeg", alt: "Add an engagement photo" },
  { src: "/4.jpeg", alt: "Add a photo with family" },
];

// Cleans any way of typing a Rwanda number into WhatsApp/tel format:
// "0788 123 456", "+250 788 123 456", "250 0788123456" -> "250788123456"
function normalizePhone(raw) {
  let n = String(raw).replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2); // 00250... -> 250...
  if (n.startsWith("2500")) n = "250" + n.slice(4); // 2500788... -> 250788...
  if (n.startsWith("0")) n = "250" + n.slice(1); // 0788... -> 250788...
  if (n.length === 9) n = "250" + n; // 788123456 -> 250788123456
  return n;
}

function formatPhone(number) {
  // 250788123456 -> +250 788 123 456
  const n = normalizePhone(number);
  return `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`.trim();
}

function renderEmphasis(line) {
  const parts = line.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>
  );
}

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(remaining, 0);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped / 3600000) % 24),
    minutes: Math.floor((clamped / 60000) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    isPast: remaining <= 0,
  };
}

function Seal({ size = 64 }) {
  const initials = `${CONFIG.partner1[0]}${CONFIG.partner2[0]}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize="26"
        fill="currentColor"
      >
        {initials}
      </text>
    </svg>
  );
}

function GoldLock({ unlocked = false, size = 84 }) {
  const initials = `${CONFIG.partner1[0]}&${CONFIG.partner2[0]}`;
  return (
    <svg
      className={`lock ${unlocked ? "lock--open" : ""}`}
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
    >
      {/* shackle: lifts and swings open when unlocked */}
      <g className="lock-shackle">
        <path
          d="M29 54 V38 C 29 22, 39 12, 50 12 C 61 12, 71 22, 71 38 V54"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      {/* body */}
      <rect
        x="14"
        y="52"
        width="72"
        height="60"
        rx="10"
        fill="rgba(8,25,18,0.75)"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <rect
        x="21"
        y="59"
        width="58"
        height="46"
        rx="6"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />
      {/* initials */}
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="'League Spartan', sans-serif"
        fontSize="17"
        fontWeight="500"
        fill="currentColor"
      >
        {initials}
      </text>
      {/* keyhole */}
      <circle cx="50" cy="91" r="4.2" fill="currentColor" />
      <path d="M48 93 L46.5 102 H53.5 L52 93 Z" fill="currentColor" />
    </svg>
  );
}

function DiscIcon({ on, size = 34 }) {
  return (
    <svg
      className={`disc ${on ? "disc--spinning" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="47" fill="rgba(8,25,18,0.85)" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {/* light glint so the spin is visible */}
      <path d="M50 8 A42 42 0 0 1 86 30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      {/* centre label */}
      <circle cx="50" cy="50" r="17" fill="currentColor" />
      {/* heart */}
      <path
        d="M50 61 C 40 54, 36 49, 36 45 C 36 41, 39 39, 42 39 C 45 39, 48 41, 50 44 C 52 41, 55 39, 58 39 C 61 39, 64 41, 64 45 C 64 49, 60 54, 50 61 Z"
        fill="#0f2a1e"
      />
    </svg>
  );
}

function Sprig({ className, flip }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M100 190 C 60 150, 40 110, 55 10" stroke="currentColor" strokeWidth="1.3" />
      {[30, 65, 100, 135].map((y, i) => (
        <path
          key={y}
          d={`M${65 - i * 4} ${190 - y} C ${40 - i * 4} ${180 - y}, ${30 - i * 4} ${165 - y}, ${28 - i * 4} ${150 - y}`}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function Divider() {
  return (
    <svg className="divider" viewBox="0 0 200 20" aria-hidden="true">
      <line x1="0" y1="10" x2="85" y2="10" stroke="currentColor" strokeWidth="1" />
      <path d="M100 3 L107 10 L100 17 L93 10 Z" fill="currentColor" />
      <line x1="115" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Countdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(CONFIG.weddingDateISO);

  if (isPast) {
    return <p className="countdown-past">Today is the day.</p>;
  }

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map((u, i) => (
        <div className="countdown-unit" key={u.label}>
          {i > 0 && <span className="countdown-sep">—</span>}
          <div>
            <strong>{String(u.value).padStart(2, "0")}</strong>
            <span>{u.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " reveal--visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

function App() {
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [childrenAttending, setChildrenAttending] = useState("");
  const [phone, setPhone] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = entered ? "auto" : "hidden";
  }, [entered]);

  const [unlocking, setUnlocking] = useState(false);

  const openInvitation = () => {
    if (unlocking) return;
    setUnlocking(true);
    // start music right away (must happen inside the tap), then let the
    // lock animation play before revealing the invitation
    if (musicAvailable && audioRef.current) {
      audioRef.current.play().then(
        () => setMusicOn(true),
        () => setMusicOn(false)
      );
    }
    setTimeout(() => setEntered(true), 900);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.play().then(() => setMusicOn(true), () => {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.rsvpEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `RSVP · ${guestName || "A guest"} ${
            attending === "yes" ? "will attend" : "cannot attend"
          } — ${CONFIG.partner1} & ${CONFIG.partner2}`,
          _cc: CONFIG.rsvpCcEmail || undefined,
          _template: "table",
          // Field order below is the order they appear in the email.
          "Guest name": guestName,
          Response:
            attending === "yes" ? "✔ Accepts with pleasure" : "✘ Declines with regret",
          "Number of guests": attending === "yes" ? guestCount : "—",
          "Children attending": attending === "yes" ? childrenAttending || "None listed" : "—",
          "Phone number": phone || "Not provided",
          "Song request": song || "No request",
          "Message for the couple": message || "No message",
          Event: `${CONFIG.weddingDateDisplay} · ${CONFIG.venueName}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Builds a neat, line-by-line WhatsApp message. Lines the guest left
  // empty are skipped, so nothing looks half-filled.
  const buildWhatsappText = () => {
    const yes = attending === "yes";
    const lines = [
      `*RSVP — ${CONFIG.partner1} & ${CONFIG.partner2}*`,
      `${CONFIG.weddingDateDisplay} · ${CONFIG.venueName}`,
      "",
      `*Name:* ${guestName || "—"}`,
      `*Response:* ${yes ? "✔ Accepts with pleasure" : "✘ Declines with regret"}`,
    ];
    if (yes) lines.push(`*Guests:* ${guestCount}`);
    if (yes && childrenAttending) lines.push(`*Children:* ${childrenAttending}`);
    if (phone) lines.push(`*Phone:* ${phone}`);
    if (song) lines.push(`*Song request:* ♪ ${song}`);
    if (message) lines.push("", `*Message:*`, message);
    return lines.join("\n");
  };

  const whatsappHref = (number) =>
    `https://wa.me/${normalizePhone(number)}?text=${encodeURIComponent(buildWhatsappText())}`;

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src="/love.mp3"
        loop
        onError={() => setMusicAvailable(false)}
      />

      {/* ENTRY GATE */}
      {!entered && (
        <div className="entry">
          <img
            src="/2.jpeg"
            alt=""
            className="entry-image"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="entry-overlay" />
          <div className="entry-content">
            <p className="entry-names">
              {CONFIG.partner1} <span className="amp">&amp;</span> {CONFIG.partner2}
            </p>
            <button
              className="entry-seal-button"
              onClick={openInvitation}
              aria-label="Tap the lock to open the invitation"
            >
              <span className="entry-seal-ring" />
              <span className="entry-seal-ring entry-seal-ring--delay" />
              <span className="entry-pin">
                <GoldLock unlocked={unlocking} size={84} />
              </span>
            </button>
            <p className="entry-tap-label">
              {unlocking ? "Welcome" : "Tap the lock to open"}
            </p>
          </div>
        </div>
      )}

      {entered && (
        <>
          <a className="skip-link" href="#main">
            Skip to content
          </a>

          {/* NAVIGATION */}
          <nav className="navbar">
            <a href="#home" className="nav-mark" onClick={() => setMenuOpen(false)}>
              {CONFIG.partner1} <span className="amp">&amp;</span> {CONFIG.partner2}
            </a>

            <button
              className="menu-button"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>

            <div className={`nav-links ${menuOpen ? "show" : ""}`}>
              <a href="#schedule" onClick={() => setMenuOpen(false)}>
                Order of the day
              </a>
              <a href="#gallery" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
              <a href="#location" onClick={() => setMenuOpen(false)}>
                Location
              </a>
              <a href="#rsvp" onClick={() => setMenuOpen(false)}>
                RSVP
              </a>
              {musicAvailable && (
                <button
                  className={`music-toggle ${musicOn ? "is-on" : ""}`}
                  onClick={toggleMusic}
                  aria-label={musicOn ? "Turn music off" : "Turn music on"}
                  title={musicOn ? "Music on" : "Music off"}
                >
                  <DiscIcon on={musicOn} />
                </button>
              )}
            </div>
          </nav>

          <main id="main">
            {/* HERO */}
            <section id="home" className="hero">
              <img
                src="/hero.jpeg"
                alt=""
                className="hero-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="hero-overlay" />

              <div className="hero-content">
                <p className="eyebrow">Together with our families</p>
                <h1 className="hero-names">
                  {CONFIG.partner1}
                  <span className="amp">&amp;</span>
                  {CONFIG.partner2}
                </h1>
                <p className="hero-line">{CONFIG.weddingDayLine}</p>
              </div>

              <a href="#story" className="scroll-cue">
                Scroll
              </a>
            </section>

            {/* INTRO */}
            <section id="story" className="intro">
              <Reveal className="sprig-row">
                <Sprig className="sprig" />
                <Sprig className="sprig" flip />
              </Reveal>

              <Reveal as="p" className="intro-poem" delay={120}>
                {CONFIG.introLines.map((line, i) => (
                  <span className="intro-line" key={i}>
                    {renderEmphasis(line)}
                  </span>
                ))}
              </Reveal>

              <Reveal delay={240}>
                <Divider />
              </Reveal>
            </section>

            {/* OUR STORY */}
            <section id="our-story" className="our-story">
              <Reveal className="our-story-frame" delay={0}>
                <img
                  src={CONFIG.storyPhoto}
                  alt="The couple"
                  className="our-story-photo"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
                <div className="our-story-placeholder">
                  <span>Add a photo at /public{CONFIG.storyPhoto}</span>
                </div>
              </Reveal>

              <Reveal className="our-story-copy" delay={150}>
                <p className="eyebrow">Our story</p>
                <h2>{CONFIG.storyTitle}</h2>
                <p>{CONFIG.story}</p>
                <p className="our-story-signature">
                  {CONFIG.partner1} <span className="amp">&amp;</span> {CONFIG.partner2}
                </p>
              </Reveal>
            </section>

            {/* GREETING */}
            <section className="greeting-section">
              <Reveal as="p" className="greeting">
                {CONFIG.greeting}
              </Reveal>

              {CONFIG.localWelcome && (
                <Reveal as="p" className="local-welcome" delay={150}>
                  {CONFIG.localWelcome}
                </Reveal>
              )}
            </section>

            {/* COUNTDOWN */}
            <section className="countdown-section">
              <Reveal>
                <p className="eyebrow">The celebration begins in</p>
                <Countdown />
                <p className="countdown-date">{CONFIG.weddingDateDisplay}</p>
              </Reveal>
            </section>

            {/* SCHEDULE */}
            <section id="schedule" className="schedule">
              <Reveal className="schedule-header">
                <h2>Order of the Day</h2>
                <Divider />
              </Reveal>

              <div className="schedule-list">
                {CONFIG.schedule.map((seg, i) => (
                  <Reveal
                    as="div"
                    className="schedule-segment"
                    key={seg.title}
                    delay={i * 120}
                  >
                    <p className="segment-time">{seg.time}</p>
                    <h3>{seg.title}</h3>
                    {seg.place && <p className="segment-place">{seg.place}</p>}
                    <p className="segment-description">{seg.description}</p>

                    {seg.items.length > 0 && (
                      <ul className="segment-items">
                        {seg.items.map((item) => (
                          <li key={item.time + item.label}>
                            <span className="item-time">{item.time}</span>
                            <span className="item-label">{item.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                ))}
              </div>
            </section>

            {/* GALLERY */}
            <section id="gallery" className="gallery">
              <Reveal>
                <p className="eyebrow">A few of our moments</p>
                <h2>{CONFIG.galleryTitle}</h2>
                <Divider />
              </Reveal>

              <div className="gallery-grid">
                {GALLERY.map((photo, i) => (
                  <Reveal
                    as="div"
                    className="gallery-tile"
                    key={i}
                    delay={i * 90}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="gallery-placeholder">
                      <span>{photo.alt}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* LOCATION */}
            <section id="location" className="location">
              <Reveal>
                <p className="eyebrow">Where we will be</p>
                <h2>{CONFIG.venueName}</h2>
                <p className="location-city">{CONFIG.city}</p>
              </Reveal>

              <Reveal className="map-frame" delay={150}>
                <iframe
                  title="Venue location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    CONFIG.mapQuery
                  )}&z=16&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>

              <Reveal delay={260}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    CONFIG.mapQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button--outline"
                >
                  Open in Google Maps
                </a>
              </Reveal>
            </section>

            {/* DRESS CODE */}
            <section className="dress-code">
              <Reveal>
                <Sprig className="sprig sprig--center" />
                <p className="eyebrow">A few gentle notes</p>
                <h3>Dress Code</h3>
                <p>{CONFIG.dressCode}</p>
              </Reveal>
            </section>

            {/* RSVP */}
            <section id="rsvp" className="rsvp">
              <Reveal>
                <p className="eyebrow">Kindly reply</p>
                <h2>Confirm Your Attendance</h2>
                <Divider />
              </Reveal>

              <Reveal delay={150}>
                <button className="seal-button" onClick={() => setModalOpen(true)}>
                  <Seal size={80} />
                  <span>Tap the seal</span>
                </button>
              </Reveal>

              <Reveal delay={260}>
                <p className="rsvp-deadline">Kindly respond before {CONFIG.rsvpBy}</p>
              </Reveal>
            </section>
          </main>

          {/* FOOTER */}
          <footer className="footer">
            <img
              src="/2.jpeg"
              alt=""
              className="footer-image"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="footer-overlay" />

            <Reveal className="footer-content">
              <div className="footer-top">
                <p className="footer-hope">Hope to see you there</p>
                <Divider />
                <p className="footer-names">
                  {CONFIG.partner1} <span className="amp">&amp;</span> {CONFIG.partner2}
                </p>
              </div>

              <div className="footer-contact">
                <p className="eyebrow">Get in touch</p>
                <p className="footer-contact-note">
                  Questions about the day? Reach either of us directly.
                </p>
                <div className="contact-cards">
                  {CONFIG.contacts.map((c) => (
                    <div className="contact-card" key={c.label}>
                      <p className="contact-role">{c.role}</p>
                      <p className="contact-name">{c.label}</p>

                      {(c.numbers || [c.number]).filter(Boolean).map((num) => (
                        <div className="contact-line" key={num}>
                          <a className="contact-number" href={`tel:+${normalizePhone(num)}`}>
                            {formatPhone(num)}
                          </a>
                          <div className="contact-actions">
                            <a className="button button--outline" href={`tel:+${normalizePhone(num)}`}>
                              Call
                            </a>
                            <a
                              className="button button--outline"
                              href={`https://wa.me/${normalizePhone(num)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      ))}

                      {c.email && (
                        <a className="contact-email" href={`mailto:${c.email}`}>
                          {c.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="footer-meta">
                {CONFIG.weddingDateDisplay} · {CONFIG.venueName}
              </p>
            </Reveal>
          </footer>
        </>
      )}

      {/* RSVP MODAL */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-label="RSVP form">
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <p className="eyebrow">
              {CONFIG.partner1} &amp; {CONFIG.partner2}
            </p>
            <h2>Your Reply</h2>
            <Divider />

            {submitted ? (
              <div className="modal-thanks">
                <p>Thank you — your reply is safe with us.</p>
                <button
                  className="button button--outline"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={handleSubmit}>
                <label className="rsvp-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </label>

                <label className="rsvp-field">
                  <span>Will you be joining us?</span>
                  <div className="attend-toggle">
                    <button
                      type="button"
                      className={attending === "yes" ? "active" : ""}
                      onClick={() => setAttending("yes")}
                    >
                      Accepts with pleasure
                    </button>
                    <button
                      type="button"
                      className={attending === "no" ? "active" : ""}
                      onClick={() => setAttending("no")}
                    >
                      Declines with regret
                    </button>
                  </div>
                </label>

                {attending === "yes" && (
                  <>
                    <label className="rsvp-field">
                      <span>Number of guests attending</span>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="rsvp-field">
                      <span>Children attending (names & ages, optional)</span>
                      <input
                        type="text"
                        value={childrenAttending}
                        onChange={(e) => setChildrenAttending(e.target.value)}
                      />
                    </label>
                  </>
                )}

                <label className="rsvp-field">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>

                <label className="rsvp-field">
                  <span>A song that gets you dancing (optional)</span>
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                  />
                </label>

                <label className="rsvp-field">
                  <span>A word for the couple (optional)</span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>

                {submitError && (
                  <p className="rsvp-error">
                    Something went wrong sending that — please try again in a
                    moment{CONFIG.rsvpWhatsapp.length > 0 ? ", or use the WhatsApp option below" : ""}.
                  </p>
                )}

                <div className="rsvp-actions">
                  <button
                    type="submit"
                    className="button button--primary-light"
                    disabled={submitting || !attending}
                  >
                    {submitting ? "Sending…" : "Send my reply"}
                  </button>

                  {attending &&
                    CONFIG.rsvpWhatsapp.map((c) => (
                      <a
                        key={c.number}
                        href={whatsappHref(c.number)}
                        target="_blank"
                        rel="noreferrer"
                        className="button button--ghost-light"
                      >
                        Or WhatsApp {c.label}
                      </a>
                    ))}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
