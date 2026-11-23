window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 6,
  title: "Projects, Showcase and the Startup Track",
  subtitle: "Finish and defend your group project, then take the next step: turning IoT skills into a home CCTV product and business.",
  outcomes: [
    "Complete a working IoT system across all five layers, with edge, fog and cloud parts.",
    "Present a final threat model and TARA backed by test evidence.",
    "Judge a product idea against GDPR, the RED cybersecurity rules, ETSI EN 303 645 and the Cyber Resilience Act.",
    "Design a home CCTV startup concept: customer, product, architecture, compliance, business model and pitch."
  ],
  sections: [
    {
      type: "mcq", bloom: "Remember", title: "Warm-up: whole-course recall",
      qs: [
        { q: "Which layer holds sensors and actuators?", opts: ["Transport", "Perception", "Processing", "Business"], a: 1 },
        { q: "What is the value of a red, red, brown, gold resistor?", opts: ["22 Ω", "220 Ω", "2.2 kΩ", "2 200 kΩ"], a: 1 },
        { q: "Which Arduino function times things without blocking the program?", opts: ["delay()", "millis()", "pulseIn()", "tone()"], a: 1 },
        { q: "Which STRIDE category is reading data without permission?", opts: ["Spoofing", "Tampering", "Information disclosure", "Repudiation"], a: 2 },
        { q: "Which port does MQTT over TLS normally use?", opts: ["80", "1883", "8883", "22"], a: 2 },
        { q: "Raspberry Pi GPIO pins work at…", opts: ["5 V", "3.3 V", "12 V", "1.8 V"], a: 1 },
        { q: "A gateway that combines data from many local devices is doing…", opts: ["Edge computing", "Fog computing", "Cloud computing", "Mist computing"], a: 1 },
        { q: "What does ETSI EN 303 645 say about default passwords?", opts: ["They must be at least 8 characters", "No universal default passwords", "They must be printed on the box", "Nothing"], a: 1 }
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "Project briefs",
      html: `<table class="t"><tr><th></th><th>Smart guitar</th><th>Smart gate</th><th>Smart bins</th></tr>
<tr><td>Goal</td><td>Strings or pads play notes and send them to a phone</td><td>Barrier opens for an approaching car and closes safely</td><td>Bins report fill level; a dashboard shows which to empty</td></tr>
<tr><td>Perception</td><td>Touch/piezo inputs, buzzer, LEDs</td><td>Ultrasonic sensor, servo, status LEDs</td><td>Ultrasonic sensor, full LED</td></tr>
<tr><td>Transport</td><td>BLE to phone; Wi-Fi/MQTT for session logs</td><td>Wi-Fi + MQTT over TLS</td><td>Wi-Fi + MQTT over TLS</td></tr>
<tr><td>Edge</td><td>Note detection on the ESP32</td><td>Open/close decision and safety check</td><td>Fill-level sum and full LED</td></tr>
<tr><td>Fog</td><td>Pi stores practice sessions</td><td>Pi logs events, manages users</td><td>Pi gateway filters and summarises</td></tr>
<tr><td>Cloud</td><td>Practice history dashboard</td><td>Remote status and open log</td><td>City dashboard and route list</td></tr>
<tr><td>Key threats</td><td>BLE spoofing, data privacy</td><td>Spoofed or replayed open command, jamming</td><td>Fake levels, location privacy, DoS</td></tr>
<tr><td>Core tutorials</td><td>1, 2, 8</td><td>1, 2, 5, 6, 7</td><td>1, 5, 7 + Week 5 Labs 2–3</td></tr></table>
<h4>Team roles (rotate if you can)</h4>
<p><strong>Hardware lead</strong> (wiring, safety), <strong>software lead</strong> (sketches, Python), <strong>security lead</strong> (threat model, tests), <strong>product lead</strong> (demo, documentation, business case).</p>`
    },
    {
      type: "build", bloom: "Apply", title: "Final week plan",
      steps: [
        { title: "Integrate", html: "<p>Join every part end to end: sensor → edge decision → MQTT over TLS → Pi gateway → dashboard. Fix one problem at a time; use the Serial Monitor, <code>mosquitto_sub</code> and <code>systemctl status</code> to see where data stops.</p>" },
        { title: "Test", html: "<p>Run a normal-use test, an offline test (internet unplugged) and a security retest of your top three risks. Record results in a table: what you did, what you expected, what happened.</p>" },
        { title: "Finalise the threat model", html: "<p>Use the Week 2 template. For each risk, show the rating before and after your changes, and the evidence.</p>" },
        { title: "Prepare the showcase", html: "<p>A 5-minute demo and 3 minutes of questions. Show it working, show one attack failing, and explain one design trade-off you made.</p>" }
      ]
    },
    {
      type: "concept", bloom: "Evaluate", title: "How the project is assessed",
      html: `<p>The criteria climb Bloom's taxonomy: from showing it works (apply) to defending your choices (evaluate) and designing improvements (create).</p>
<table class="t"><tr><th>Criterion</th><th>Weight</th><th>Excellent looks like</th></tr>
<tr><td>Working system (Apply)</td><td>25%</td><td>All parts work end to end and survive a reboot and an internet outage</td></tr>
<tr><td>Architecture: layers and edge/fog/cloud (Analyse)</td><td>15%</td><td>Every component placed correctly; each processing choice justified by latency, bandwidth, privacy or resilience</td></tr>
<tr><td>Threat model and TARA (Analyse/Evaluate)</td><td>25%</td><td>DFD with trust boundaries; six or more STRIDE threats; ratings before and after; clear treatment decisions</td></tr>
<tr><td>Security evidence (Evaluate)</td><td>20%</td><td>Captured proof that an attack worked, and proof that it now fails</td></tr>
<tr><td>Demo, reflection and next steps (Create)</td><td>15%</td><td>Clear demo; honest limits; a realistic plan to make it a product</td></tr></table>`
    },
    {
      type: "concept", bloom: "Analyse", label: "Startup track", title: "Startup track: from prototype to a home CCTV company",
      html: `<p>You can now build a camera that detects motion, records, alerts and is secured. A company needs much more. Work through these six blocks.</p>
<h4>1. Customer and problem</h4>
<p>Who exactly? (renters who cannot drill walls, small shops, elderly parents living alone, holiday homes). What do they fear, and what do current products do badly? Talk to at least ten real people before you build anything new.</p>
<h4>2. Product (minimum viable product)</h4>
<p>Start with the smallest product that solves the main problem: for example one indoor Wi-Fi camera with motion alerts, local recording and a simple app. Everything else waits.</p>
<h4>3. Architecture choices you already understand</h4>
<table class="t"><tr><th>Decision</th><th>Options</th><th>Trade-off</th></tr>
<tr><td>Processing</td><td>Edge detection vs cloud detection</td><td>Privacy, latency and running cost vs cheaper hardware</td></tr>
<tr><td>Storage</td><td>SD card, home hub (fog), cloud</td><td>Theft-proof evidence vs privacy and subscription cost</td></tr>
<tr><td>Power</td><td>Mains, battery + PIR wake, Power over Ethernet</td><td>Easy installation vs always-on recording</td></tr>
<tr><td>Compatibility</td><td>Own app only, or ONVIF/RTSP support</td><td>Lock-in revenue vs customer trust and reach</td></tr></table>
<h4>4. Compliance roadmap (EU)</h4>
<table class="t"><tr><th>Rule</th><th>What it means for a camera company</th></tr>
<tr><td>Radio Equipment Directive + Delegated Regulation (EU) 2022/30</td><td>A Wi-Fi/BLE camera needs CE marking, and since 1 August 2025 must meet the cybersecurity requirements (network protection, personal data and privacy, fraud), usually shown with EN 18031 standards.</td></tr>
<tr><td>Cyber Resilience Act (EU) 2024/2847</td><td>Report actively exploited vulnerabilities and severe incidents from 11 September 2026. From 11 December 2027: security by design, vulnerability handling and security updates for the support period, before you can sell.</td></tr>
<tr><td>ETSI EN 303 645</td><td>The practical baseline checklist: unique passwords, vulnerability reporting, updates, secure communication, easy data deletion.</td></tr>
<tr><td>GDPR</td><td>Video of identifiable people is personal data. The EU Court of Justice (Ryneš, C-212/13, 2014) held that a home camera that also films the public street is not purely household use, so GDPR applies to that homeowner. The EDPB's Guidelines 3/2019 explain the rules for video devices. If your cloud stores customers' footage, you also process personal data for them, with GDPR duties of your own.</td></tr></table>
<p>Good product design helps customers stay legal: <mark>privacy masks</mark> to blank out the street or the neighbours' windows, short default retention, easy deletion, clear signage advice and local-only modes.</p>
<div class="note">This is an overview for learning, not legal advice. A real company should get advice from a qualified lawyer and a test lab before selling.</div>
<h4>5. Business model</h4>
<table class="t"><tr><th>Revenue stream</th><th>Example</th><th>Watch out for</th></tr>
<tr><td>Hardware sales</td><td>Camera at a margin above its bill of materials</td><td>Big brands compete hard on price</td></tr>
<tr><td>Subscription</td><td>Monthly fee for cloud clips, smart alerts</td><td>Cloud and support cost per user, and churn</td></tr>
<tr><td>Installation and service</td><td>Local install, maintenance visits</td><td>Does not scale without staff</td></tr>
<tr><td>Partnerships (B2B2C)</td><td>Insurers, landlords, housing associations</td><td>Long sales cycles</td></tr></table>
<h4>6. Costs people forget</h4>
<p>Certification and test lab fees; security updates for the whole support period; cloud storage and bandwidth per customer; customer support; returns; insurance; and an incident response plan for the day something goes wrong.</p>`
    },
    {
      type: "match", bloom: "Analyse", label: "Startup track", title: "Matching: which rule or standard drives this decision?",
      pairs: [["Each camera ships with its own random password", "ETSI EN 303 645"], ["Reporting an actively exploited vulnerability to the authorities", "Cyber Resilience Act"], ["CE marking for a Wi-Fi camera including network and privacy protection", "RED Delegated Regulation 2022/30"], ["Privacy masks so the camera does not film the public street", "GDPR"], ["Classifying threats as spoofing, tampering and so on", "STRIDE"], ["Rating impact and feasibility to rank risks", "ISO/SAE 21434 TARA"]]
    },
    {
      type: "mcq", bloom: "Evaluate", label: "Startup track", title: "Scenario questions: startup decisions",
      qs: [
        { q: "Your startup can afford one: (A) person detection on the camera, or (B) a larger cloud subscription plan. Customers' main complaint is too many false alerts. Which do you choose?", opts: ["A: edge person detection cuts false alerts and keeps footage private", "B: more cloud storage", "Neither: customers will get used to it", "Turn off alerts"], a: 0, why: "Solve the customer's real problem. Edge detection also reduces cloud upload costs." },
        { q: "An investor says: let's launch without a security update system and add it later. Evaluate this.", opts: ["Fine: updates are optional", "Risky and, under the CRA from December 2027, not allowed: products need security updates for their support period, and fixes cannot reach devices already sold", "Fine if the price is low", "Only a problem in the USA"], a: 1, why: "Without updates, every vulnerability is permanent, and new EU rules make security updates a condition of sale." },
        { q: "A customer wants the camera pointed at the street to catch car thieves. What should your app do?", opts: ["Nothing, it's their choice", "Warn them that filming public space brings GDPR duties, and offer privacy masks and signage guidance", "Refuse to work", "Upload the footage to the police automatically"], a: 1, why: "Help the customer stay lawful (Ryneš and the EDPB guidelines), and make privacy-friendly settings easy." },
        { q: "Which launch plan best balances speed and trust?", opts: ["Many models at once, cloud-only, default passwords to simplify set-up", "One model, unique passwords, signed updates, local + optional cloud recording, a published vulnerability contact", "Hardware only, no app", "Copy a competitor's firmware"], a: 1, why: "A focused, secure product meets the ETSI baseline and the coming CRA duties, and builds trust from day one." }
      ]
    },
    {
      type: "create", bloom: "Create", label: "Startup track", title: "Design task: pitch a home CCTV startup",
      brief: "<p>In your group, create a one-page startup concept and a 3-minute pitch for a home camera product. Build on your project's prototype and threat model.</p>",
      checklist: ["Target customer and problem, with evidence from at least five real conversations", "MVP described in one sentence, with what you are not building yet", "Five-layer architecture with edge, fog and cloud choices justified", "Top five security risks from your TARA and how the product treats them", "Compliance roadmap: RED/EN 18031, ETSI EN 303 645, CRA dates, GDPR and privacy-by-design features", "Business model: revenue streams and the main running costs per customer", "One honest risk to the business and how you'd test it cheaply"]
    },
    {
      type: "create", bloom: "Create", title: "Final checklist: showcase ready",
      checklist: ["System works end to end in front of the audience", "Offline test result shown", "One attack shown failing, with evidence", "Final threat model with before/after ratings", "Five-layer and edge/fog/cloud diagram", "Each team member explains one part", "Reflection: what you would change for a real product"]
    }
  ],
  sources: [
    ["EDPB Guidelines 3/2019 on processing of personal data through video devices", "https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32019-processing-personal-data-through-video_en"],
    ["CJEU judgment C-212/13 Ryneš (11 December 2014)", "https://curia.europa.eu/juris/liste.jsf?num=C-212/13"],
    ["European Commission: Cyber Resilience Act implementation timeline", "https://digital-strategy.ec.europa.eu/en/factpages/cyber-resilience-act-implementation"],
    ["UK Government: Regulation (EU) 2022/30 factsheet (RED cybersecurity)", "https://www.gov.uk/government/publications/radio-equipment-regulations-2017/regulation-eu-202230-factsheet"],
    ["ETSI: Consumer IoT security (EN 303 645 and TR 103 621 implementation guide)", "https://www.etsi.org/technologies/consumer-iot-security"],
    ["ONVIF", "https://www.onvif.org/"],
    ["CISA Alert TA16-288A: Mirai and other botnets", "https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets"]
  ]
});
