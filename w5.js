window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 5,
  title: "Raspberry Pi, Hardware Systems and the Fog Gateway",
  subtitle: "Bring the Raspberry Pi in as the system's fog node: GPIO in Python, a gateway that filters data, a link to the cloud, and a motion-triggered camera.",
  outcomes: [
    "Describe the Raspberry Pi's hardware and the 40-pin GPIO header, and wire it safely at 3.3 V.",
    "Control GPIO from Python with gpiozero, using BCM pin numbers.",
    "Build a fog gateway that subscribes to many devices, filters their data and sends a summary on.",
    "Send summary data to a cloud dashboard.",
    "Build a motion-triggered camera prototype: the core of a home CCTV product."
  ],
  sections: [
    {
      type: "defs", bloom: "Remember", title: "Key terms",
      items: [
        ["System on a chip (SoC)", "One chip holding the processor, graphics and memory controller. The Raspberry Pi is built around one."],
        ["Raspberry Pi OS", "The Linux-based operating system made for the Raspberry Pi."],
        ["SSH", "Secure Shell: a secure way to control the Pi's command line from another computer."],
        ["40-pin header", "The row of GPIO, power and ground pins along the edge of the Pi."],
        ["BCM numbering", "Pin names by GPIO number, for example GPIO17. gpiozero uses these."],
        ["Physical numbering", "Pin names by position on the header, 1 to 40. GPIO17 is physical pin 11."],
        ["gpiozero", "The Python library recommended by Raspberry Pi for controlling GPIO with simple objects like <code>LED</code> and <code>Button</code>."],
        ["Gateway", "A device that connects local devices to a wider network and often translates or filters their data. Our fog node."],
        ["paho-mqtt", "The Eclipse Python library for MQTT clients."],
        ["systemd service", "A way to make a script start automatically when the Pi boots and restart if it crashes."],
        ["Picamera2", "The Python library for the Raspberry Pi camera modules."],
        ["H.264", "A common video compression format used by cameras and CCTV recorders."]
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "The Raspberry Pi as a hardware system",
      html: `<figure><img src="img/boards.png" alt="Arduino, ESP32 and Raspberry Pi compared" width="800" height="360"></figure>
<table class="t"><tr><th>Part</th><th>What it does</th><th>Watch out for</th></tr>
<tr><td>SoC (processor + graphics)</td><td>Runs Linux and your Python programs</td><td>Gets hot under load; use a heatsink or fan</td></tr>
<tr><td>RAM</td><td>Working memory</td><td>Camera and AI work need more</td></tr>
<tr><td>microSD card</td><td>Stores the OS and your files</td><td>Pulling the power can corrupt it; shut down properly</td></tr>
<tr><td>Power supply (USB-C on Pi 4/5)</td><td>Powers everything</td><td>Use the official supply; weak supplies cause random crashes</td></tr>
<tr><td>Wi-Fi, Bluetooth, Ethernet</td><td>Networking</td><td>Ethernet is more reliable for a gateway</td></tr>
<tr><td>Camera connector (CSI)</td><td>Connects the camera module</td><td>Ribbon cable direction matters</td></tr>
<tr><td>40-pin GPIO header</td><td>Connects sensors and actuators</td><td>See below</td></tr></table>
<h4>The GPIO header: four safety rules</h4>
<ol><li>GPIO pins use <mark>3.3 V logic and are not 5 V tolerant</mark>. A 5 V signal into a GPIO pin can destroy it.</li>
<li>The two 5 V pins are for <em>powering</em> modules, never for feeding into a GPIO input.</li>
<li>Always use a resistor with an LED (220 Ω is safe, see Week 1).</li>
<li>Wire with the power off, and check twice before you switch on.</li></ol>
<table class="t" style="max-width:560px"><tr><th>Physical pin</th><th>Name</th><th>Used for</th></tr>
<tr><td>1</td><td>3.3 V power</td><td>Sensors needing 3.3 V</td></tr>
<tr><td>2</td><td>5 V power</td><td>PIR sensor power</td></tr>
<tr><td>3</td><td>GPIO2</td><td><code>button</code> (gpiozero <code>Button(2)</code>)</td></tr>
<tr><td>6</td><td>GND</td><td>Ground</td></tr>
<tr><td>7</td><td>GPIO4</td><td><code>pir</code> (<code>MotionSensor(4)</code>)</td></tr>
<tr><td>11</td><td>GPIO17</td><td><code>led</code> (<code>LED(17)</code>)</td></tr></table>`
    },
    {
      type: "fill", bloom: "Remember", title: "Fill the blanks: Raspberry Pi facts",
      text: "Raspberry Pi GPIO pins work at {{3.3}} volts and are not {{5}} V tolerant. The library gpiozero uses {{BCM}} numbering, so LED(17) means GPIO17, which is physical pin {{11}}. To control the Pi from a laptop we use {{SSH}}. In our system the Pi acts as the {{fog}} node, also called a {{gateway}}.",
      extra: ["physical", "edge", "12"]
    },
    {
      type: "build", bloom: "Apply", label: "Lab 1", title: "Lab 1: set up the Pi and blink the same LED in Python",
      intro: "<p>Same LED, same 220 Ω resistor, new board. Compare the Python with your Week 1 Arduino sketch.</p>",
      steps: [
        { title: "Prepare the SD card", html: "<p>Use <strong>Raspberry Pi Imager</strong> to write Raspberry Pi OS. In its settings, set a hostname (for example <code>raspberrypi</code>), a username with a strong password, your Wi-Fi, and enable SSH. Boot the Pi and connect from your laptop:</p>", code: `ssh student@raspberrypi.local
sudo apt update && sudo apt full-upgrade -y` },
        { title: "Wire the LED", html: "<p><code>GPIO17 (physical pin 11) → 220 Ω → LED long leg</code>, LED short leg → <code>GND (physical pin 6)</code>.</p>" },
        { title: "Blink in Python", html: "<p>Save as <code>blink.py</code> and run with <code>python3 blink.py</code>. Press Ctrl+C to stop.</p>", code: `from gpiozero import LED
from time import sleep

led = LED(17)          # GPIO17 = physical pin 11

while True:
    led.on()
    sleep(1)
    led.off()
    sleep(1)`, after: `<table class="t"><tr><th>Arduino (C++)</th><th>Raspberry Pi (Python)</th></tr><tr><td><code>pinMode(ledPin, OUTPUT);</code></td><td><code>led = LED(17)</code></td></tr><tr><td><code>digitalWrite(ledPin, HIGH);</code></td><td><code>led.on()</code></td></tr><tr><td><code>delay(1000);</code></td><td><code>sleep(1)</code></td></tr><tr><td><code>void loop()</code></td><td><code>while True:</code></td></tr></table>` },
        { title: "Add a button with events", html: "<p>Button between GPIO2 (pin 3) and GND. gpiozero uses the Pi's internal pull-up, like <code>INPUT_PULLUP</code>. Instead of checking in a loop, you attach actions to <mark>events</mark>.</p>", code: `from gpiozero import LED, Button
from signal import pause

led = LED(17)
button = Button(2)

button.when_pressed = led.on
button.when_released = led.off

pause()                # wait for events forever` }
      ]
    },
    {
      type: "match", bloom: "Understand", title: "Matching: Arduino to Raspberry Pi",
      pairs: [["pinMode(ledPin, OUTPUT);", "led = LED(17)"], ["digitalWrite(ledPin, HIGH);", "led.on()"], ["delay(1000);", "sleep(1)"], ["void loop() { ... }", "while True:"], ["pinMode(buttonPin, INPUT_PULLUP);", "button = Button(2)"], ["Serial.println(value);", "print(value)"]]
    },
    {
      type: "build", bloom: "Apply", label: "Lab 2", title: "Lab 2: the Pi as a fog gateway",
      intro: `<figure><img src="img/edge_fog_cloud.gif" alt="Animation of bins sending data to the Pi which forwards one summary to the cloud" width="800" height="450"></figure>
<p>The secure broker from Week 4 already runs on the Pi. Now add a Python program that <mark>subscribes to every bin, keeps the latest levels, and publishes a summary only when something important changes</mark>. That's fog computing: combine and filter close to the devices.</p>`,
      steps: [
        { title: "Install the MQTT library", html: "", code: `sudo apt install -y python3-paho-mqtt` },
        { title: "Write gateway.py", html: "<p>The gateway connects over the localhost-only listener from Week 4, with its own account.</p>", code: `import json
import paho.mqtt.client as mqtt

FULL_LEVEL = 80          # percent
levels = {}              # latest level for each bin
last_full = None         # last list of full bins we reported

def on_connect(client, userdata, flags, reason_code, properties):
    client.subscribe("school/bins/+/level")

def on_message(client, userdata, msg):
    global last_full
    bin_id = msg.topic.split("/")[2]           # school/bins/bin1/level -> bin1
    levels[bin_id] = int(msg.payload.decode())
    full = sorted(b for b, lvl in levels.items() if lvl >= FULL_LEVEL)
    if full != last_full:                      # only send when it changes
        summary = {"bins_reporting": len(levels), "full_bins": full}
        client.publish("school/summary", json.dumps(summary))
        print("summary sent:", summary)
        last_full = full

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set("gateway", "your-gateway-password")
client.on_connect = on_connect
client.on_message = on_message
client.connect("localhost", 1883)
client.loop_forever()` },
        { title: "Test with real and fake bins", html: "<p>Run <code>python3 gateway.py</code>. Power on your ESP32 bin, and add test bins from another terminal (log in as an account allowed to write those topics):</p>", code: `mosquitto_pub -h localhost -u bin1 -P "your-bin1-password" -t "school/bins/bin1/level" -m "92"` , after: "<p>Count the messages: many level readings arrive, but a summary goes out only when the list of full bins changes. That's the saving the fog layer gives you.</p>" },
        { title: "Run it at boot as a service", html: "<p>A gateway must survive reboots. Create <code>/etc/systemd/system/gateway.service</code>:</p>", code: `[Unit]
Description=IoT fog gateway
After=network-online.target mosquitto.service

[Service]
ExecStart=/usr/bin/python3 /home/student/gateway.py
Restart=always
User=student

[Install]
WantedBy=multi-user.target`, after: "<p>Then run <code>sudo systemctl enable --now gateway</code> and check it with <code>systemctl status gateway</code>.</p>" }
      ]
    },
    {
      type: "build", bloom: "Apply", label: "Lab 3", title: "Lab 3: from fog to cloud",
      intro: "<p>Send the summary to a cloud dashboard so it can be viewed from anywhere. This lab uses ThingSpeak (MathWorks), which has a free tier for small projects; Adafruit IO or a school server work the same way.</p>",
      steps: [
        { title: "Create a channel", html: "<p>Create a ThingSpeak account and a channel with <code>Field 1 = full bins</code> and <code>Field 2 = bins reporting</code>. Copy the channel's <strong>Write API key</strong>. Treat it like a password.</p>" },
        { title: "Add an upload to the gateway", html: "<p>Add this function to <code>gateway.py</code> and call <code>send_to_cloud(summary)</code> right after publishing the summary. HTTPS encrypts the upload.</p>", code: `import requests

WRITE_KEY = "YOUR-WRITE-API-KEY"     # keep secret; never commit to GitHub

def send_to_cloud(summary):
    try:
        requests.post("https://api.thingspeak.com/update", timeout=10, data={
            "api_key": WRITE_KEY,
            "field1": len(summary["full_bins"]),
            "field2": summary["bins_reporting"],
        })
    except requests.RequestException as e:
        print("cloud upload failed, will try next time:", e)` },
        { title: "Pull the internet cable", html: "<p>Unplug the Pi's internet uplink (or switch off the router's internet) for two minutes. Do the bins still report to the Pi? Does the gate still work? Write down what still works <strong>offline</strong>. That's the resilience edge and fog give you (ETSI EN 303 645 provision 9).</p>" }
      ]
    },
    {
      type: "order", bloom: "Apply", plain: true, title: "Puzzle: trace one bin reading through the system",
      items: ["Ultrasonic sensor measures the echo time", "ESP32 works out the fill level (edge)", "ESP32 publishes to school/bins/bin1/level over TLS", "Mosquitto broker on the Pi receives the message", "gateway.py combines all bins and decides whether anything changed (fog)", "Gateway sends a summary over HTTPS", "Cloud dashboard stores it and draws the chart (cloud)"],
      why: "Perception → edge → transport → fog processing → cloud application: the five layers in action."
    },
    {
      type: "build", bloom: "Apply", label: "Lab 4", title: "Lab 4: motion-triggered camera (CCTV prototype)",
      intro: "<p>This is the heart of a home security camera: <mark>PIR wakes the system, the camera records a clip, and an event goes to the app</mark>. It reuses the Week 3 logic, now on the Pi.</p><p><strong>Parts:</strong> Raspberry Pi, Camera Module (any official one), HC-SR501 PIR sensor.</p>",
      steps: [
        { title: "Connect the camera and PIR", html: "<p>Fit the camera ribbon cable to the CSI connector with the power off. PIR: <code>VCC → 5 V (pin 2)</code>, <code>GND → pin 6</code>, <code>OUT → GPIO4 (pin 7)</code>. The HC-SR501's output is 3.3 V, so it is safe for the GPIO pin. Test the camera:</p>", code: `rpicam-hello -t 5000` },
        { title: "Write camera.py", html: "<p>Records an H.264 clip while there is motion, plus 5 seconds after, and publishes an event for the phone app.</p>", code: `from datetime import datetime
from time import sleep
from gpiozero import MotionSensor
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
import paho.mqtt.client as mqtt

pir = MotionSensor(4)                      # GPIO4 = physical pin 7
cam = Picamera2()
cam.configure(cam.create_video_configuration())
encoder = H264Encoder()

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set("camera1", "your-camera1-password")
client.connect("localhost", 1883)
client.loop_start()

while True:
    pir.wait_for_motion()
    clip = datetime.now().strftime("clip_%Y%m%d_%H%M%S.h264")
    client.publish("home/camera1/motion", clip)
    print("motion: recording", clip)
    cam.start_recording(encoder, clip)
    pir.wait_for_no_motion()
    sleep(5)                               # hold time, like Week 3
    cam.stop_recording()
    print("saved", clip)`, after: "<p>Add <code>camera1</code> to the Mosquitto password file and ACL (<code>topic write home/camera1/#</code>) first, as in Week 4.</p>" },
        { title: "Privacy and security check", html: "<p>Before you point it anywhere: does it film only your own space? Are clips stored on an encrypted disk, and deleted after a set number of days? Who can read the <code>home/camera1/#</code> topic? Add your answers to your threat model.</p>" },
        { title: "Stretch: person detection at the edge", html: "<p>Too many alerts for cats and moving branches? Products run small AI models on the device to check for people before alerting. Explore the Raspberry Pi AI Kit or OpenCV examples, and measure how many false alerts you remove.</p>" }
      ]
    },
    {
      type: "bug", bloom: "Analyse", title: "Bug hunt: the Pi LED and button do nothing",
      instr: "The LED is wired to physical pin 11, and the button to GPIO2. Click every line with an error.",
      code: `from gpiozero import LED, Button
from signal import pause

led = LED(11)
button = Button(2)

button.when_pressed = led.on()
button.when_released = led.off

# Wiring note: LED powered from the 5 V pin through the GPIO
pause()`,
      bugs: { 3: "gpiozero uses BCM numbers. Physical pin 11 is GPIO17, so use <code>LED(17)</code>.", 6: "<code>led.on()</code> with brackets runs once now and stores the result (None). Pass the function itself: <code>button.when_pressed = led.on</code>.", 8: "Never feed 5 V into a GPIO pin; GPIO is 3.3 V only. Drive the LED from the GPIO pin through a resistor to GND." }
    },
    {
      type: "concept", bloom: "Analyse", label: "Industry link: home CCTV", title: "Industry link: your prototype vs a commercial camera",
      html: `<table class="t"><tr><th>Feature</th><th>Your Lab 4 prototype</th><th>Commercial product</th></tr>
<tr><td>Trigger</td><td>PIR</td><td>PIR + on-device person detection</td></tr>
<tr><td>Night vision</td><td>None</td><td>IR LEDs switched by a light sensor (Week 3)</td></tr>
<tr><td>Storage</td><td>Clips on the SD card</td><td>Encrypted local storage + optional cloud clips</td></tr>
<tr><td>Live view</td><td>None</td><td>Encrypted stream to the app (RTSP/WebRTC over TLS)</td></tr>
<tr><td>Alerts</td><td>MQTT event</td><td>Push notification to the phone app</td></tr>
<tr><td>Set-up</td><td>SSH and editing files</td><td>Phone app over BLE, unique password per unit</td></tr>
<tr><td>Updates</td><td>Manual apt upgrade</td><td>Signed over-the-air updates for a published support period</td></tr>
<tr><td>Hardware</td><td>Development board</td><td>Custom board, weatherproof case, certified radio</td></tr></table>
<p>Most of the gap is <mark>software, security and trust</mark>, not the camera itself. That's why the skills in Weeks 2 and 4 decide whether a CCTV startup survives. Many cameras on the market also support <strong>ONVIF</strong>, an industry standard that lets cameras and recorders from different makers work together, which customers often ask for.</p>`
    },
    {
      type: "mcq", bloom: "Evaluate", title: "Scenario questions: hardware and system decisions",
      qs: [
        { q: "The gateway script stops whenever the Pi reboots after a power cut. What's the best fix?", opts: ["Ask a teacher to restart it each morning", "Run it as a systemd service with Restart=always", "Use a bigger SD card", "Move it to the ESP32"], a: 1, why: "A service starts at boot and restarts after crashes, which is what an unattended gateway needs." },
        { q: "A 5 V ultrasonic sensor must connect to the Pi. Which option is safe?", opts: ["Echo straight to a GPIO pin", "A voltage divider or level shifter on Echo", "Echo to the 5 V pin", "Echo to GND"], a: 1, why: "GPIO is 3.3 V only. A divider brings the 5 V Echo signal down to a safe level." },
        { q: "A home camera uploads every clip to the cloud. A customer worries about privacy and their upload limit. Which design best balances this?", opts: ["Upload everything at full quality", "Record locally; upload only short, encrypted clips of person events, with a local-only option", "Stop recording entirely", "Upload to a public MQTT broker"], a: 1, why: "Edge/fog processing cuts bandwidth and keeps most footage at home, while key evidence still gets off the device." },
        { q: "Why does the gateway publish a summary only when the list of full bins changes?", opts: ["MQTT limits messages to one per minute", "It cuts network traffic and cloud costs without losing important information", "The cloud cannot read JSON", "Bins only report once"], a: 1, why: "This is the purpose of the fog layer: filter close to the source and send only what matters." }
      ]
    },
    {
      type: "create", bloom: "Create", title: "Design task: complete your project's edge–fog–cloud chain",
      brief: "<p>Connect your group project end to end: device (edge) → Pi (fog) → dashboard (cloud or local).</p>",
      checklist: ["Device publishes over TLS with its own login", "Pi gateway combines or filters data and explains why", "Gateway runs as a service and survives a reboot", "Data reaches a dashboard someone could check remotely", "Offline test done: what still works without the internet is recorded", "All wiring to the Pi is 3.3 V safe", "Threat model updated for the Pi and the cloud link"]
    }
  ],
  sources: [
    ["Raspberry Pi documentation: GPIO and the 40-pin header", "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio"],
    ["Raspberry Pi white paper: GPIO usage and best practices (3.3 V logic)", "https://pip-assets.raspberrypi.com/categories/685-app-notes-guides-whitepapers/documents/RP-006553-WP-2-A%20history%20of%20GPIO%20usage%20on%20Raspberry%20Pi%20devices,%20and%20current%20best%20practices.pdf"],
    ["gpiozero documentation", "https://gpiozero.readthedocs.io/"],
    ["Eclipse Paho MQTT Python client", "https://eclipse.dev/paho/files/paho.mqtt.python/html/index.html"],
    ["Picamera2 manual (Raspberry Pi)", "https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf"],
    ["Raspberry Pi camera software (rpicam-apps)", "https://www.raspberrypi.com/documentation/computers/camera_software.html"],
    ["ThingSpeak: write data with the REST API", "https://www.mathworks.com/help/thingspeak/writedata.html"],
    ["NIST SP 500-325 Fog Computing Conceptual Model", "https://doi.org/10.6028/NIST.SP.500-325"],
    ["ONVIF (open industry forum for IP-based security products)", "https://www.onvif.org/"]
  ]
});
