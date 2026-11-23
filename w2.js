window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 2,
  title: "Architecture, Edge–Fog–Cloud and Threat Modelling",
  subtitle: "Where each part of an IoT system lives, where the processing happens, and how to find what could go wrong before you build.",
  outcomes: [
    "Name and describe the five layers of IoT architecture and place real components in them.",
    "Explain edge, fog and cloud computing using the NIST definitions, and decide where a task should run.",
    "Draw a data flow diagram with trust boundaries for an IoT system.",
    "Classify threats with STRIDE and follow the ISO/SAE 21434 TARA steps.",
    "Produce a first threat model for your group project."
  ],
  sections: [
    {
      type: "defs", bloom: "Remember", title: "Key terms",
      items: [
        ["Architecture", "The big-picture plan of a system: its parts, where they sit and how they connect."],
        ["Layer", "A group of parts with one job. Each layer serves the layer above it."],
        ["Edge computing", "Processing on or right next to the device that collects the data."],
        ["Fog computing", "A layer of nodes (for example gateways) <mark>between the devices and the cloud</mark> that offer computing, storage and networking close to the data (NIST SP 500-325)."],
        ["Mist computing", "A very light form of fog computing at the far edge of the network, on small devices themselves (NIST SP 500-325)."],
        ["Cloud computing", "On-demand network access to a shared pool of computing resources that can be set up and released quickly (NIST SP 800-145)."],
        ["Latency", "The delay between something happening and the system reacting."],
        ["Bandwidth", "How much data a link can carry per second."],
        ["Asset", "Anything with value that needs protecting: a device, data, a function, a password."],
        ["Threat", "Something that could go wrong and cause harm."],
        ["Vulnerability", "A weakness an attacker could use, such as a default password."],
        ["Attack surface", "All the points where an attacker could try to get in: ports, radios, apps, physical pins."],
        ["Risk", "How bad the impact would be, combined with how likely the attack is."],
        ["Mitigation (control)", "A measure that reduces a risk, such as encryption or authentication."],
        ["Trust boundary", "A line in a diagram where data passes between areas with different levels of trust, for example from the home Wi-Fi to the internet."],
        ["STRIDE", "Microsoft's six threat categories: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege."],
        ["TARA", "Threat Analysis and Risk Assessment: the step-by-step risk method in ISO/SAE 21434."]
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "The five-layer IoT architecture",
      html: `<p>Sethi and Sarangi (2017) describe IoT in five layers. Data travels <mark>up</mark> from the world to people. Commands travel <mark>down</mark> from people to the world.</p>
<figure><svg viewBox="0 0 760 330" width="100%" style="max-width:760px" role="img" aria-label="Five IoT layers with smart gate examples">
<g font-family="system-ui,Arial" font-size="14">
<rect x="20" y="10" width="440" height="52" rx="6" fill="#f6f6f4" stroke="#999"/><text x="36" y="42" font-weight="600">5. Business layer</text><text x="470" y="42" fill="#444">Who pays, rules, privacy, reports</text>
<rect x="20" y="72" width="440" height="52" rx="6" fill="#f6f6f4" stroke="#999"/><text x="36" y="104" font-weight="600">4. Application layer</text><text x="470" y="104" fill="#444">Gate app, dashboard, alerts</text>
<rect x="20" y="134" width="440" height="52" rx="6" fill="#f6f6f4" stroke="#999"/><text x="36" y="166" font-weight="600">3. Processing layer (middleware)</text><text x="470" y="166" fill="#444">Store, analyse, decide</text>
<rect x="20" y="196" width="440" height="52" rx="6" fill="#f6f6f4" stroke="#999"/><text x="36" y="228" font-weight="600">2. Transport layer</text><text x="470" y="228" fill="#444">Wi-Fi, BLE, MQTT, gateway</text>
<rect x="20" y="258" width="440" height="52" rx="6" fill="#f6f6f4" stroke="#999"/><text x="36" y="290" font-weight="600">1. Perception layer</text><text x="470" y="290" fill="#444">Ultrasonic sensor, servo</text>
<line x1="740" y1="300" x2="740" y2="20" stroke="#1d4e89" stroke-width="2"/><polygon points="740,12 734,24 746,24" fill="#1d4e89"/>
</g></svg><figcaption>Right column: the smart gate at each layer. The arrow shows data flowing upwards.</figcaption></figure>
<table class="t"><tr><th>Layer</th><th>Job</th><th>Key question</th></tr>
<tr><td>Perception</td><td>Senses and acts on the physical world</td><td>What do we measure and move?</td></tr>
<tr><td>Transport</td><td>Moves data between devices, gateways and servers</td><td>How does data travel?</td></tr>
<tr><td>Processing</td><td>Stores, analyses and processes large amounts of data</td><td>Where is data stored and decided on?</td></tr>
<tr><td>Application</td><td>Delivers the service to the user</td><td>What does the user see and control?</td></tr>
<tr><td>Business</td><td>Manages the whole system: business model, rules, privacy</td><td>Who owns it, who pays, which laws apply?</td></tr></table>
<h4>How the other models line up</h4>
<table class="t"><tr><th>5-layer model</th><th>3-layer model</th><th>IoT World Forum (7 levels)</th></tr>
<tr><td>Perception</td><td>Perception</td><td>1 Physical devices and controllers</td></tr>
<tr><td>Transport</td><td rowspan="2">Network</td><td>2 Connectivity</td></tr>
<tr><td>Processing</td><td>3 Edge computing, 4 Data accumulation, 5 Data abstraction</td></tr>
<tr><td>Application</td><td rowspan="2">Application</td><td>6 Application</td></tr>
<tr><td>Business</td><td>7 Collaboration and processes</td></tr></table>
<p>The models differ in how much detail they show, not in the idea. This course uses the five-layer model.</p>`
    },
    {
      type: "concept", bloom: "Understand", title: "Edge, fog and cloud: where does processing happen?",
      html: `<figure><img src="img/edge_fog_cloud.gif" alt="Animation of smart bins sending data to a Raspberry Pi fog gateway which sends a summary to the cloud" width="800" height="450"><figcaption>The processing layer is not one place. It is spread across edge, fog and cloud.</figcaption></figure>
<table class="t"><tr><th></th><th>Edge</th><th>Fog</th><th>Cloud</th></tr>
<tr><td>Where</td><td>On the device</td><td>Gateway or local server on site</td><td>Data centres on the internet</td></tr>
<tr><td>Example</td><td>ESP32 in the bin</td><td>Raspberry Pi in the street cabinet</td><td>Dashboard and storage online</td></tr>
<tr><td>Speed (latency)</td><td>Fastest</td><td>Fast</td><td>Slowest</td></tr>
<tr><td>Computing power</td><td>Small</td><td>Medium</td><td>Huge, grows on demand</td></tr>
<tr><td>Works offline?</td><td>Yes</td><td>Yes, on site</td><td>No</td></tr>
<tr><td>Best for</td><td>Instant reactions, saving power</td><td>Combining and filtering many devices</td><td>History, analytics, access from anywhere</td></tr></table>
<p>NIST says fog computing places resources <mark>between smart end-devices and centralised cloud services</mark>, which cuts delay because data is handled locally (NIST SP 500-325). NIST also gives cloud computing five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service (NIST SP 800-145).</p>
<div class="note">How to decide: if the reaction must be instant or must work without the internet, process at the <mark>edge</mark>. If many devices must be combined on site, use the <mark>fog</mark>. If you need long history, heavy analysis or access from anywhere, use the <mark>cloud</mark>.</div>`
    },
    {
      type: "fill", bloom: "Remember", title: "Fill the blanks: layers and computing",
      text: "The lowest layer, which holds sensors and actuators, is the {{perception}} layer. The {{transport}} layer moves data using Wi-Fi, BLE or MQTT. The {{processing}} layer stores and analyses data. Users see dashboards in the {{application}} layer. Business models and privacy rules belong to the {{business}} layer. Processing on the device itself is {{edge}} computing. A gateway between devices and the internet does {{fog}} computing. The delay before a system reacts is called {{latency}}.",
      extra: ["bandwidth", "physical"]
    },
    {
      type: "match", bloom: "Understand", title: "Matching: put each part in its layer",
      pairs: [["HC-SR04 ultrasonic sensor", "Perception"], ["MQTT messages over Wi-Fi", "Transport"], ["Database of every gate opening", "Processing"], ["Phone app showing the gate status", "Application"], ["Monthly subscription price and privacy policy", "Business"], ["Servo motor that lifts the barrier", "Perception"], ["Raspberry Pi working out which bins are full", "Processing"], ["Bluetooth Low Energy link to the guitar app", "Transport"]]
    },
    {
      type: "match", bloom: "Apply", title: "Matching: edge, fog or cloud?",
      instr: "Choose where each task should run, using the decision rule above.",
      pairs: [["Stop the gate closing when a car is underneath, within 50 ms", "Edge"], ["Combine 20 bins in one street and send one summary", "Fog"], ["Keep 2 years of bin data and plan weekly routes", "Cloud"], ["Turn on the full LED on a bin when it is 90% full", "Edge"], ["Let a manager check the gate log from another country", "Cloud"], ["Keep a building's cameras recording when the internet is down", "Fog"]]
    },
    {
      type: "concept", bloom: "Understand", title: "Threat modelling: thinking like an attacker",
      html: `<p>Threat modelling means finding what could go wrong <mark>while the system is still a design</mark>, when fixes are cheap. Four simple questions guide it:</p>
<ol><li>What are we working on? (draw the system)</li><li>What can go wrong? (find threats)</li><li>What are we going to do about it? (choose mitigations)</li><li>Did we do a good enough job? (review)</li></ol>
<h4>Step 1: draw a data flow diagram (DFD)</h4>
<figure><svg viewBox="0 0 760 300" width="100%" style="max-width:760px" role="img" aria-label="Data flow diagram of the smart gate with trust boundaries">
<g font-family="system-ui,Arial" font-size="13">
<rect x="15" y="110" width="110" height="50" fill="#fff" stroke="#333"/><text x="70" y="140" text-anchor="middle">Car / driver</text>
<circle cx="250" cy="135" r="55" fill="#f6f6f4" stroke="#333"/><text x="250" y="131" text-anchor="middle" font-weight="600">Gate</text><text x="250" y="148" text-anchor="middle">controller</text>
<rect x="200" y="235" width="100" height="40" fill="#fff" stroke="#333"/><text x="250" y="260" text-anchor="middle">Servo</text>
<circle cx="470" cy="135" r="50" fill="#f6f6f4" stroke="#333"/><text x="470" y="131" text-anchor="middle" font-weight="600">Raspberry Pi</text><text x="470" y="148" text-anchor="middle">broker + log</text>
<rect x="610" y="40" width="130" height="45" fill="#fff" stroke="#333"/><text x="675" y="67" text-anchor="middle">Cloud dashboard</text>
<rect x="610" y="190" width="130" height="45" fill="#fff" stroke="#333"/><text x="675" y="217" text-anchor="middle">Owner's phone</text>
<g stroke="#1d4e89" stroke-width="1.6" fill="none"><path d="M125 135 H192"/><path d="M250 190 V233"/><path d="M305 128 H418"/><path d="M515 115 L608 70"/><path d="M608 205 L518 155"/></g>
<g fill="#1d4e89"><polygon points="195,135 185,130 185,140"/><polygon points="250,235 245,225 255,225"/><polygon points="420,128 410,123 410,133"/><polygon points="610,69 598,70 604,79"/><polygon points="516,156 527,152 523,162"/></g>
<text x="130" y="125" fill="#1d4e89">echo / distance</text><text x="258" y="215" fill="#1d4e89">angle</text><text x="318" y="120" fill="#1d4e89">event: opened</text><text x="530" y="78" fill="#1d4e89">summary</text><text x="528" y="196" fill="#1d4e89">open command</text>
<g stroke="#b3261e" stroke-dasharray="6 5" stroke-width="1.5"><line x1="160" y1="20" x2="160" y2="290"/><line x1="360" y1="20" x2="360" y2="290"/><line x1="575" y1="20" x2="575" y2="290"/></g>
<g fill="#b3261e" font-size="12"><text x="166" y="32">physical world</text><text x="366" y="32">home Wi-Fi</text><text x="581" y="290">internet</text></g>
</g></svg><figcaption>Circles are processes, boxes are external parts, arrows are data flows, red dashed lines are trust boundaries. Threats gather where arrows cross a boundary.</figcaption></figure>
<h4>Step 2: find threats with STRIDE</h4>
<table class="t"><tr><th>Threat</th><th>Meaning</th><th>Property it breaks</th><th>Smart gate example</th></tr>
<tr><td><mark>S</mark>poofing</td><td>Pretending to be someone or something else</td><td>Authentication</td><td>A fake phone app sends the open command</td></tr>
<tr><td><mark>T</mark>ampering</td><td>Changing data or code without permission</td><td>Integrity</td><td>Someone edits the gate's firmware or the event log</td></tr>
<tr><td><mark>R</mark>epudiation</td><td>Denying you did something, with no proof either way</td><td>Non-repudiation</td><td>No log of who opened the gate at 2 a.m.</td></tr>
<tr><td><mark>I</mark>nformation disclosure</td><td>Seeing data without permission</td><td>Confidentiality</td><td>Wi-Fi sniffing shows when the owner is away</td></tr>
<tr><td><mark>D</mark>enial of service</td><td>Stopping the system working</td><td>Availability</td><td>Jamming Wi-Fi so the gate never opens</td></tr>
<tr><td><mark>E</mark>levation of privilege</td><td>Getting more rights than you should have</td><td>Authorisation</td><td>A guest account changes the admin password</td></tr></table>`
    },
    {
      type: "concept", bloom: "Understand", title: "From threats to risk: the TARA steps (ISO/SAE 21434)",
      html: `<p>STRIDE finds threats. A TARA ranks them so you fix the most important first. ISO/SAE 21434 was written for cars, but the steps work for any connected product.</p>
<table class="t"><tr><th>Step</th><th>Question</th><th>Smart gate example</th></tr>
<tr><td>1. Asset identification</td><td>What has value, and which property (confidentiality, integrity, availability) matters?</td><td>The open command: integrity</td></tr>
<tr><td>2. Threat scenario identification</td><td>How could that property be broken?</td><td>Attacker replays a captured open command</td></tr>
<tr><td>3. Impact rating</td><td>How bad would it be? (safety, financial, operational, privacy)</td><td>Severe: intruder enters the property</td></tr>
<tr><td>4. Attack path analysis</td><td>What steps would an attacker take?</td><td>Join Wi-Fi → sniff MQTT → resend message</td></tr>
<tr><td>5. Attack feasibility rating</td><td>How easy is it? (time, skill, knowledge, equipment)</td><td>High if MQTT is unencrypted with no login</td></tr>
<tr><td>6. Risk value determination</td><td>Combine impact and feasibility</td><td>High risk</td></tr>
<tr><td>7. Risk treatment decision</td><td>Avoid, reduce, share or retain the risk?</td><td>Reduce: TLS + passwords + signed commands</td></tr></table>
<h4>A simple risk matrix</h4>
<table class="t" style="max-width:520px;text-align:center"><tr><th>Impact ↓ / Feasibility →</th><th>Low</th><th>Medium</th><th>High</th></tr>
<tr><th>Severe</th><td>Medium</td><td style="background:#fbeaea">High</td><td style="background:#fbeaea">High</td></tr>
<tr><th>Moderate</th><td>Low</td><td>Medium</td><td style="background:#fbeaea">High</td></tr>
<tr><th>Negligible</th><td>Low</td><td>Low</td><td>Medium</td></tr></table>
<p>ISO/SAE 21434 itself uses four feasibility levels and a risk value from 1 to 5. This three-by-three version is a simpler classroom version of the same idea.</p>`
    },
    {
      type: "order", bloom: "Apply", plain: true, title: "Puzzle: put the TARA steps in order",
      items: ["Asset identification", "Threat scenario identification", "Impact rating", "Attack path analysis", "Attack feasibility rating", "Risk value determination", "Risk treatment decision"],
      why: "You must know what you protect before you can say how it is attacked, how bad that is, and how easy. Only then can you rank and treat the risk."
    },
    {
      type: "match", bloom: "Analyse", title: "Matching: classify the gate threats with STRIDE",
      pairs: [["An attacker records the open message and plays it back later", "Spoofing"], ["A visitor changes the gate's closing delay in the settings file", "Tampering"], ["The owner says they never opened the gate, and there is no log", "Repudiation"], ["The MQTT topic shows each time the family leaves home", "Information disclosure"], ["Thousands of fake messages flood the broker so real ones are lost", "Denial of service"], ["A guest login can add new admin users", "Elevation of privilege"]]
    },
    {
      type: "build", bloom: "Apply", title: "Build: paper model of the smart gate",
      intro: "<p>No hardware today. You'll build the gate in Week 3, so design it and threat-model it first.</p>",
      steps: [
        { title: "Draw the five layers", html: "<p>Draw five stacked boxes. Write each gate component in the correct layer: ultrasonic sensor, servo, Arduino, ESP32/Wi-Fi, MQTT, Raspberry Pi, cloud dashboard, phone app, owner and pricing.</p>" },
        { title: "Mark edge, fog and cloud", html: "<p>Draw a bracket on the right: which parts are edge, fog and cloud? Write one sentence on why the open/close decision must stay at the edge.</p>" },
        { title: "Draw the data flow diagram", html: "<p>Copy the DFD above. Add any flows you think are missing (for example a manual push button, or a firmware update from the internet). Draw the trust boundaries.</p>" },
        { title: "Fill in the threat table", html: "<p>For every arrow that crosses a trust boundary, write at least one STRIDE threat. Copy this template into a document or spreadsheet:</p>", code: `| # | Asset | Data flow / part | STRIDE | Threat scenario | Impact (Severe/Moderate/Negligible) | Feasibility (High/Medium/Low) | Risk | Treatment |
|---|-------|------------------|--------|-----------------|-----------------------------------|------------------------------|------|-----------|
| 1 | Open command | Phone → Pi | Spoofing | Fake app sends open | Severe | High | High | Reduce: login + TLS |
| 2 |       |                  |        |                 |                                   |                              |      |           |` },
        { title: "Rank and pick the top three", html: "<p>Use the risk matrix. Circle the three highest risks. These are what you'll test in Week 4.</p>" }
      ]
    },
    {
      type: "bug", bloom: "Analyse", title: "Error hunt: a flawed threat table",
      instr: "A group handed in this threat table. Click every row that has a mistake (wrong STRIDE category, wrong layer, or a mitigation that does not fit).",
      code: `1. Fake app sends open command      | Spoofing        | Fix: login + TLS
2. Sniffing Wi-Fi shows when owner is out | Tampering   | Fix: encryption
3. Flooding the broker with messages | Denial of service | Fix: rate limits
4. Changing the firmware on the Arduino | Tampering     | Fix: brighter LED
5. No record of who opened the gate | Repudiation     | Fix: signed event log
6. Servo motor is in the application layer | Layer check | Fix: none needed`,
      bugs: { 1: "Reading traffic is <strong>Information disclosure</strong>, not Tampering. Encryption is the right fix, though.", 3: "Tampering is right, but a brighter LED does nothing. Fixes: signed firmware, secure boot, locking the programming port.", 5: "The servo is an actuator, so it belongs in the <strong>perception</strong> layer, not the application layer." }
    },
    {
      type: "concept", bloom: "Analyse", label: "Industry link: home CCTV", title: "Industry link: a home CCTV system in five layers",
      html: `<table class="t"><tr><th>Layer</th><th>Home CCTV product</th></tr>
<tr><td>Perception</td><td>Image sensor, PIR, infrared LEDs, siren</td></tr>
<tr><td>Transport</td><td>Wi-Fi / Ethernet, RTSP video streams, MQTT or HTTPS events</td></tr>
<tr><td>Processing</td><td><mark>Edge:</mark> motion and person detection on the camera. <mark>Fog:</mark> a home network video recorder (NVR) or hub storing footage. <mark>Cloud:</mark> remote storage, alerts, search.</td></tr>
<tr><td>Application</td><td>Phone app: live view, playback, alerts</td></tr>
<tr><td>Business</td><td>Hardware price, cloud subscription, GDPR, the EU Cyber Resilience Act, support and updates</td></tr></table>
<h4>Design choice: local or cloud recording?</h4>
<table class="t"><tr><th></th><th>Local (edge/fog: SD card or NVR)</th><th>Cloud</th></tr>
<tr><td>Privacy</td><td>Footage stays in the home</td><td>Footage leaves the home; you hold customers' personal data</td></tr>
<tr><td>Burglar steals the device</td><td>Footage is lost</td><td>Footage is safe</td></tr>
<tr><td>Internet cut</td><td>Still records</td><td>Stops uploading</td></tr>
<tr><td>Business model</td><td>One-off sale</td><td>Monthly subscription</td></tr></table>
<p>Many products mix both: detection at the edge, a local copy, and short cloud clips of important events only. That is the edge–fog–cloud pattern from this week.</p>
<h4>Top CCTV threats (STRIDE)</h4>
<ul><li><strong>Spoofing:</strong> logging in with the default password. In 2016 the Mirai malware took over huge numbers of cameras and recorders this way.</li>
<li><strong>Information disclosure:</strong> an unencrypted stream lets anyone on the network watch the family.</li>
<li><strong>Denial of service:</strong> Wi-Fi jamming blinds a wireless camera during a burglary.</li>
<li><strong>Tampering:</strong> deleting footage or installing malicious firmware.</li></ul>`
    },
    {
      type: "mcq", bloom: "Evaluate", title: "Scenario questions: judge the design",
      qs: [
        { q: "A team plans to send every ultrasonic reading (10 per second) from 500 bins straight to the cloud. What is the strongest criticism?", opts: ["MQTT cannot send numbers", "It wastes bandwidth and power; a fog gateway or edge rule should send only changes or summaries", "Cloud servers cannot store numbers", "Ultrasonic sensors need BLE"], a: 1, why: "Most readings barely change. Filtering at the edge or fog cuts traffic, battery use and cloud costs." },
        { q: "The gate's open/close decision runs in the cloud. Why is this a poor design?", opts: ["Cloud servers are always insecure", "Latency and internet outages could leave the gate stuck or closing on a car; safety decisions belong at the edge", "The cloud cannot run if-statements", "It makes the servo weaker"], a: 1, why: "A safety reaction must be fast and must work offline, which only edge processing guarantees." },
        { q: "Two threats: (A) an attacker reads bin fill levels; (B) an attacker opens the house gate. Both are equally easy. Which should be treated first?", opts: ["A, because it affects more devices", "B, because its impact (physical entry) is far more severe", "Neither; equal feasibility means equal risk", "Both should be accepted"], a: 1, why: "Risk combines impact and feasibility. With equal feasibility, the higher impact wins." },
        { q: "A CCTV startup stores all footage only on the camera's SD card. A reviewer says this is a problem for burglaries. What is the best improvement?", opts: ["Remove the SD card", "Also send short encrypted event clips to a hub or cloud, so evidence survives if the camera is stolen", "Record at a lower resolution", "Turn off motion detection"], a: 1, why: "A copy off the device keeps the evidence. Encryption protects the customer's privacy while it is stored and sent." }
      ]
    },
    {
      type: "create", bloom: "Create", title: "Design task: your group project's first threat model",
      brief: "<p>Choose your group project now (smart guitar, smart gate or smart bins). Produce a one-page design and threat model. You'll test it in Week 4 and finish it in Week 6.</p>",
      checklist: ["Five-layer diagram with every component placed correctly", "Edge, fog and cloud marked, with one reason for each choice", "Data flow diagram with at least two trust boundaries", "At least six threats, covering at least four STRIDE categories", "Each threat has an impact, a feasibility and a risk rating", "Top three risks chosen, each with a treatment decision"]
    }
  ],
  sources: [
    ["Sethi, P. and Sarangi, S. R. (2017) Internet of Things: Architectures, Protocols, and Applications", "https://doi.org/10.1155/2017/9324035", "three- and five-layer models"],
    ["NIST SP 500-325 Fog Computing Conceptual Model (2018)", "https://doi.org/10.6028/NIST.SP.500-325"],
    ["NIST SP 800-145 The NIST Definition of Cloud Computing (2011)", "https://doi.org/10.6028/NIST.SP.800-145"],
    ["Microsoft Learn: Threat modeling framework (STRIDE)", "https://learn.microsoft.com/en-us/training/modules/tm-use-a-framework-to-identify-threats-and-find-ways-to-reduce-or-eliminate-risk/1b-threat-modeling-framework"],
    ["Threat Modeling Manifesto (the four questions)", "https://www.threatmodelingmanifesto.org/"],
    ["ISO/SAE 21434:2021 Road vehicles — Cybersecurity engineering", "https://www.iso.org/standard/70918.html"],
    ["Cisco / IoT World Forum Reference Model (2014)", "http://cdn.iotwf.com/resources/71/IoT_Reference_Model_White_Paper_June_4_2014.pdf"],
    ["CISA Alert TA16-288A: Heightened DDoS Threat Posed by Mirai and Other Botnets", "https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets"]
  ]
});
