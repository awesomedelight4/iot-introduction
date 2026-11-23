window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 4,
  title: "IoT Security: Attacks and Defences",
  subtitle: "Attack your own Week 3 build in a safe lab, then secure it, and check it against the standards and laws that real products must meet.",
  outcomes: [
    "Use the CIA triad, the OWASP IoT Top 10 and ETSI EN 303 645 to judge an IoT design.",
    "Show why unencrypted, unauthenticated MQTT is dangerous by capturing it in a lab.",
    "Secure an MQTT broker with passwords, access control lists and TLS.",
    "Explain which EU rules (RED delegated act, Cyber Resilience Act, GDPR) apply to connected products.",
    "Update the Week 2 threat model with tested results."
  ],
  sections: [
    {
      type: "defs", bloom: "Remember", title: "Key terms",
      items: [
        ["CIA triad", "The three goals of security: <mark>Confidentiality</mark> (only the right people see data), <mark>Integrity</mark> (data is not changed without permission), <mark>Availability</mark> (the system works when needed)."],
        ["Authentication", "Proving who you are (password, certificate, key)."],
        ["Authorisation", "What you are allowed to do once you are known."],
        ["Encryption", "Scrambling data so only someone with the key can read it."],
        ["Plaintext", "Data that is not encrypted and can be read by anyone who captures it."],
        ["TLS", "Transport Layer Security: encrypts a network connection and proves the server's identity with a certificate. MQTT over TLS uses port 8883."],
        ["Certificate", "A digital ID card for a server or device, signed by a certificate authority (CA)."],
        ["Sniffing", "Capturing network traffic to read it."],
        ["Replay attack", "Recording a valid message and sending it again later, for example an open command."],
        ["Default credentials", "Usernames and passwords set at the factory, often the same on every device."],
        ["Access control list (ACL)", "A list saying which user may read or write which topic or resource."],
        ["Least privilege", "Give each user or device only the rights it needs, nothing more."],
        ["Firmware", "The software that runs a device. Updating it securely is a core security duty."],
        ["Secure boot", "The device checks that its firmware is signed by the maker before running it."],
        ["Botnet", "Many hacked devices controlled together, often used for denial-of-service attacks."]
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "The OWASP IoT Top 10 (2018)",
      html: `<p>OWASP's list of the ten things to avoid when you build, deploy or manage IoT systems.</p>
<table class="t"><tr><th>#</th><th>Weakness</th><th>In our projects</th></tr>
<tr><td>1</td><td>Weak, guessable or hardcoded passwords</td><td><code>bin1 / 1234</code> typed into the ESP32 code</td></tr>
<tr><td>2</td><td>Insecure network services</td><td>MQTT on port 1883 open to the whole network</td></tr>
<tr><td>3</td><td>Insecure ecosystem interfaces</td><td>A cloud dashboard or phone app with no login</td></tr>
<tr><td>4</td><td>Lack of secure update mechanism</td><td>No way to patch the gate once installed</td></tr>
<tr><td>5</td><td>Use of insecure or outdated components</td><td>Old libraries, an old Raspberry Pi OS image</td></tr>
<tr><td>6</td><td>Insufficient privacy protection</td><td>Bin or camera data that shows when people are home</td></tr>
<tr><td>7</td><td>Insecure data transfer and storage</td><td>Plaintext MQTT; unencrypted SD card recordings</td></tr>
<tr><td>8</td><td>Lack of device management</td><td>No list of which bins exist or what firmware they run</td></tr>
<tr><td>9</td><td>Insecure default settings</td><td><code>allow_anonymous true</code> in the broker</td></tr>
<tr><td>10</td><td>Lack of physical hardening</td><td>Anyone can plug a USB cable into the gate box and reflash it</td></tr></table>`
    },
    {
      type: "concept", bloom: "Understand", title: "Standards and laws every IoT maker should know",
      html: `<h4>ETSI EN 303 645: the European baseline for consumer IoT</h4>
<p>Thirteen cybersecurity provisions (plus data protection provisions). The first three matter most:</p>
<ol><li><mark>No universal default passwords</mark>: each device's password must be unique or set by the user.</li>
<li>Implement a means to manage reports of vulnerabilities (a way for researchers to report bugs).</li>
<li>Keep software updated.</li>
<li>Securely store sensitive security parameters.</li><li>Communicate securely.</li><li>Minimise exposed attack surfaces.</li><li>Ensure software integrity.</li><li>Ensure that personal data is secure.</li><li>Make systems resilient to outages.</li><li>Examine system telemetry data.</li><li>Make it easy for users to delete user data.</li><li>Make installation and maintenance of devices easy.</li><li>Validate input data.</li></ol>
<h4>NIST IR 8259A: six device capabilities</h4>
<p>Device identification, device configuration, data protection, logical access to interfaces, software update, and cybersecurity state awareness.</p>
<h4>EU law for products you sell</h4>
<table class="t"><tr><th>Rule</th><th>What it means for an IoT product</th><th>When</th></tr>
<tr><td>Radio Equipment Directive, Delegated Regulation (EU) 2022/30</td><td>Internet-connected radio products (Wi-Fi, BLE) must protect the network, personal data and against fraud. Harmonised standards: EN 18031-1/-2/-3.</td><td>Applies to products placed on the EU market from 1 August 2025</td></tr>
<tr><td>Cyber Resilience Act, Regulation (EU) 2024/2847</td><td>Security by design, vulnerability handling and security updates for products with digital elements. Actively exploited vulnerabilities and severe incidents must be reported.</td><td>Reporting from 11 September 2026; full obligations from 11 December 2027</td></tr>
<tr><td>GDPR</td><td>Personal data (including video of identifiable people) must be protected and used lawfully.</td><td>In force since 2018</td></tr></table>
<p>For a startup, this is not paperwork at the end. These rules decide what you are <mark>allowed to sell</mark>, so design for them from day one.</p>`
    },
    {
      type: "fill", bloom: "Remember", title: "Fill the blanks: security basics",
      text: "The CIA triad stands for confidentiality, {{integrity}} and {{availability}}. Proving who you are is {{authentication}}; deciding what you may do is {{authorisation}}. Unencrypted data is called {{plaintext}}. MQTT without encryption normally uses port {{1883}}, and MQTT over TLS uses port {{8883}}. Recording an open command and sending it again is a {{replay}} attack. ETSI EN 303 645 says there must be no universal default {{passwords}}.",
      extra: ["443", "firewall", "hashing"]
    },
    {
      type: "concept", bloom: "Understand", title: "How the attack works",
      html: `<figure><img src="img/mqtt_sniff.gif" alt="Animation showing an attacker reading plaintext MQTT credentials, then only scrambled bytes when TLS is used" width="800" height="450"><figcaption>Watch steps 4 and 5: the same message without and with TLS.</figcaption></figure>
<p>With <code>allow_anonymous true</code> and no TLS, three attacks are easy:</p>
<ol><li><strong>Read everything</strong> (information disclosure): subscribe to <code>#</code>, the wildcard for every topic.</li>
<li><strong>Send fake data</strong> (spoofing/tampering): publish <code>school/bins/bin1/level = 0</code> so a full bin is never emptied, or send a fake open command to the gate.</li>
<li><strong>Steal passwords</strong>: even when a password is set, it crosses the network in plaintext unless TLS is used.</li></ol>`
    },
    {
      type: "build", bloom: "Apply", title: "Lab: attack, then secure, your MQTT system",
      intro: `<div class="warn"><strong>Ethics and law:</strong> only test devices and networks that you own or have written permission to test, on the isolated lab network. Capturing other people's traffic without permission is illegal in most countries.</div>
<p>You need: the Raspberry Pi (broker), your Week 3 ESP32 bin, and a laptop. Commands run on the Pi unless stated.</p>`,
      steps: [
        { title: "Install the broker in its insecure state", html: "<p>Install Mosquitto and create an open lab listener.</p>", code: `sudo apt update
sudo apt install -y mosquitto mosquitto-clients tcpdump
echo "listener 1883
allow_anonymous true" | sudo tee /etc/mosquitto/conf.d/lab.conf
sudo systemctl restart mosquitto` },
        { title: "Attack 1: read every message", html: "<p>From the laptop (any device on the network), subscribe to everything. You did not need a password.</p>", code: `mosquitto_sub -h raspberrypi.local -t "#" -v` },
        { title: "Attack 2: send a fake reading", html: "<p>Pretend to be bin 1 and report it empty. Watch the dashboard believe you.</p>", code: `mosquitto_pub -h raspberrypi.local -t "school/bins/bin1/level" -m "0"` },
        { title: "Attack 3: capture a password in plaintext", html: "<p>Give the ESP32 a username and password (<code>client.connect(\"bin1\", \"bin1\", \"1234\")</code>), then capture packets on the Pi. The <code>-A</code> option prints the bytes as text.</p>", code: `sudo tcpdump -i wlan0 -A port 1883`, after: "<p>Look for <code>MQTT</code>, <code>bin1</code> and <code>1234</code> in the output. In Wireshark, the display filter <code>mqtt</code> shows the CONNECT packet with the username and password fields. A real attacker needs a position on the network path (for example a fake access point), which is why public Wi-Fi is risky.</p>" },
        { title: "Defence 1: passwords and access control (least privilege)", html: "<p>Create one account per device and role, then give each only the topics it needs.</p>", code: `sudo mosquitto_passwd -c /etc/mosquitto/passwd bin1
sudo mosquitto_passwd /etc/mosquitto/passwd gateway
sudo mosquitto_passwd /etc/mosquitto/passwd dashboard

echo "user bin1
topic write school/bins/bin1/#

user gateway
topic read school/bins/#
topic write school/summary

user dashboard
topic read school/#" | sudo tee /etc/mosquitto/acl` },
        { title: "Defence 2: TLS certificates", html: "<p>Make a small lab certificate authority (CA) and a server certificate for the Pi. Change the IP address to your Pi's.</p>", code: `sudo mkdir -p /etc/mosquitto/certs && cd /etc/mosquitto/certs
sudo openssl req -new -x509 -days 365 -nodes -keyout ca.key -out ca.crt -subj "/CN=IoT-Lab-CA"
sudo openssl req -new -nodes -newkey rsa:2048 -keyout server.key -out server.csr \\
  -subj "/CN=raspberrypi.local" -addext "subjectAltName=DNS:raspberrypi.local,IP:192.168.1.50"
sudo openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial \\
  -out server.crt -days 365 -copy_extensions copyall
sudo chown mosquitto: server.key` },
        { title: "Defence 3: the secure broker configuration", html: "<p>Replace the lab file. Plain 1883 is now only reachable from the Pi itself (for local scripts); the network gets TLS on 8883 with logins.</p>", code: `echo "listener 1883 localhost
listener 8883
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
allow_anonymous false
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl" | sudo tee /etc/mosquitto/conf.d/lab.conf
sudo systemctl restart mosquitto` },
        { title: "Test again: the attacks should now fail", html: "<p>Copy <code>ca.crt</code> to the laptop. Anonymous access is refused, a wrong user cannot read other topics, and tcpdump on port 8883 shows only scrambled bytes.</p>", code: `# refused: no username
mosquitto_sub -h raspberrypi.local -p 8883 --cafile ca.crt -t "#" -v

# works: dashboard may read school/#
mosquitto_sub -h raspberrypi.local -p 8883 --cafile ca.crt -u dashboard -P "your-password" -t "school/#" -v` },
        { title: "Update the ESP32 to use TLS", html: "<p>Swap <code>WiFiClient</code> for <code>WiFiClientSecure</code>, paste in the CA certificate, use port 8883 and log in. Keep passwords out of shared code (for example in a separate <code>secrets.h</code> file that is not uploaded to GitHub).</p>", code: `#include <WiFiClientSecure.h>
#include "secrets.h"              // defines BIN_PASSWORD, WIFI_PASSWORD

const char* caCert = R"EOF(
-----BEGIN CERTIFICATE-----
...paste the contents of ca.crt here...
-----END CERTIFICATE-----
)EOF";

WiFiClientSecure net;
PubSubClient client(net);

void setup() {
  // ... Wi-Fi as before ...
  net.setCACert(caCert);              // trust only our lab CA
  client.setServer(broker, 8883);     // MQTT over TLS
}

void connectMQTT() {
  while (!client.connected()) {
    client.connect("bin1", "bin1", BIN_PASSWORD);
    delay(1000);
  }
}` }
      ]
    },
    {
      type: "order", bloom: "Apply", plain: true, title: "Puzzle: secure a broker in the right order",
      items: ["Show the risk: subscribe to # with no password", "Create a separate account for each device and role", "Write an ACL giving each account only the topics it needs", "Create a CA and a server certificate", "Configure listener 8883 with TLS and allow_anonymous false", "Restart Mosquitto and repeat the attacks to prove they now fail", "Update the threat model with the tested results"],
      why: "Show the problem, add identities, limit rights, add encryption, then test and record what changed."
    },
    {
      type: "bug", bloom: "Analyse", title: "Error hunt: an insecure broker configuration",
      instr: "This configuration is meant to be secure for the smart gate. Click every line that is a security mistake.",
      code: `listener 8883
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
allow_anonymous true
password_file /etc/mosquitto/passwd
listener 1883
acl_file /etc/mosquitto/acl
# acl: user gate_app
# acl: topic readwrite #`,
      bugs: { 3: "Anonymous clients are still allowed, so the password file does not protect anything. Set <code>allow_anonymous false</code>.", 5: "A second plain listener on 1883, open to the whole network, sends everything in plaintext. Remove it or use <code>listener 1883 localhost</code>.", 8: "<code>readwrite #</code> gives the app every topic. Least privilege: only the gate topics it needs." }
    },
    {
      type: "match", bloom: "Analyse", title: "Matching: attack → best defence",
      pairs: [["Sniffing MQTT passwords on Wi-Fi", "TLS encryption (port 8883)"], ["Logging in with admin/admin on every camera", "Unique per-device passwords"], ["Any client can subscribe to #", "Authentication + ACLs"], ["Replaying a captured open command", "Message counters or timestamps checked by the receiver"], ["Flashing malicious firmware via USB", "Secure boot and signed updates"], ["A known bug in an old library", "Secure software updates"]]
    },
    {
      type: "concept", bloom: "Analyse", label: "Industry link: home CCTV", title: "Industry link: what a secure home camera must have",
      html: `<p>In 2016 the Mirai malware scanned the internet for cameras and video recorders that still used factory passwords, took over huge numbers of them, and used them for massive denial-of-service attacks (US CISA alert TA16-288A). For a CCTV startup the lesson is clear: <mark>security failures become headlines, recalls and lost trust</mark>.</p>
<table class="t"><tr><th>Requirement</th><th>Where it comes from</th><th>How you build it</th></tr>
<tr><td>Unique password or set-up-on-first-use</td><td>ETSI EN 303 645 provision 1; OWASP #1</td><td>Random password printed per unit, or forced change in the app</td></tr>
<tr><td>Encrypted video and events</td><td>ETSI provision 5; OWASP #7</td><td>TLS for streams and MQTT; encrypted storage</td></tr>
<tr><td>Signed over-the-air updates for the whole support period</td><td>ETSI provisions 3 and 7; CRA</td><td>Secure boot, signed firmware, a published support period</td></tr>
<tr><td>Vulnerability disclosure policy</td><td>ETSI provision 2; CRA reporting from 11 Sep 2026</td><td>A security contact page and a process to fix and report</td></tr>
<tr><td>Privacy controls</td><td>GDPR; ETSI data protection provisions</td><td>Privacy masks over neighbours' windows, easy deletion, local-only mode</td></tr>
<tr><td>App and account security</td><td>OWASP #3</td><td>Two-factor login, rate limits on password guesses</td></tr></table>`
    },
    {
      type: "mcq", bloom: "Evaluate", title: "Scenario questions: judge the security decision",
      qs: [
        { q: "A team says: our broker has passwords, so we don't need TLS. Evaluate this.", opts: ["Correct: passwords are enough", "Wrong: without TLS the passwords and data cross the network in plaintext and can be captured", "Correct, because MQTT is encrypted by default", "Wrong, because MQTT cannot use passwords"], a: 1, why: "Authentication without encryption still leaks the credentials and the data." },
        { q: "A startup ships every camera with the password admin123 and tells customers to change it. Under ETSI EN 303 645, is that acceptable?", opts: ["Yes, if the manual says to change it", "No: universal default passwords are not allowed; each must be unique per device or set by the user", "Yes, if the password is long", "Only outside the EU"], a: 1, why: "Provision 5.1 bans universal default passwords; asking users to change them is not enough." },
        { q: "Which single change gives the biggest risk reduction for the open, anonymous lab broker?", opts: ["Changing the topic names", "Requiring authentication with ACLs and TLS", "Publishing less often", "Using a faster Raspberry Pi"], a: 1, why: "It blocks reading, faking and password theft at once. Obscure topic names hide nothing from a # subscription." },
        { q: "A camera company finds a bug that attackers are actively exploiting, in November 2026. What does the EU Cyber Resilience Act now require?", opts: ["Nothing until December 2027", "Report the actively exploited vulnerability to the authorities, and fix it", "Only fix it in the next model", "Tell no one, to avoid panic"], a: 1, why: "CRA reporting obligations apply from 11 September 2026, including for products already on the market." }
      ]
    },
    {
      type: "create", bloom: "Create", title: "Design task: security upgrade of your project",
      brief: "<p>Apply this week to your group project and prove it with evidence (screenshots or terminal output).</p>",
      checklist: ["Before: evidence that at least one Week 2 threat really worked (for example a tcpdump capture)", "Unique credentials for each device; no passwords in shared code", "ACLs follow least privilege", "TLS on every network link that leaves the device", "After: evidence that the same attack now fails", "Threat model updated: each top-three risk has a new feasibility and risk rating", "Two ETSI EN 303 645 provisions your project now meets, and one it does not yet meet"]
    }
  ],
  sources: [
    ["OWASP Internet of Things Project: IoT Top 10 (2018)", "https://owasp.org/www-project-internet-of-things/"],
    ["ETSI EN 303 645 V2.1.1 Cyber Security for Consumer IoT: Baseline Requirements", "https://www.etsi.org/deliver/etsi_en/303600_303699/303645/02.01.01_60/en_303645v020101p.pdf"],
    ["NIST IR 8259A IoT Device Cybersecurity Capability Core Baseline", "https://doi.org/10.6028/NIST.IR.8259A"],
    ["European Commission: Cyber Resilience Act implementation", "https://digital-strategy.ec.europa.eu/en/factpages/cyber-resilience-act-implementation"],
    ["UK Government: Regulation (EU) 2022/30 factsheet (RED cybersecurity, from 1 August 2025)", "https://www.gov.uk/government/publications/radio-equipment-regulations-2017/regulation-eu-202230-factsheet"],
    ["Mosquitto: mosquitto.conf manual", "https://mosquitto.org/man/mosquitto-conf-5.html"],
    ["Mosquitto: migrating to 2.0 (allow_anonymous defaults to false)", "https://mosquitto.org/documentation/migrating-to-2-0/"],
    ["MQTT.org FAQ (ports 1883 and 8883)", "https://mqtt.org/faq/"],
    ["CISA Alert TA16-288A: Mirai and other botnets", "https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets"]
  ]
});
