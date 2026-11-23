window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 1,
  title: "IoT Foundations",
  subtitle: "What an IoT system is made of, basic electronics, boards, and how devices talk to each other.",
  outcomes: [
    "Define the Internet of Things and name its main parts: sensors, actuators, controllers and networks.",
    "Explain voltage, current and resistance, and use Ohm's law to choose an LED resistor.",
    "Read a resistor's colour code and wire a circuit correctly on a breadboard.",
    "Compare a microcontroller (Arduino, ESP32) with a single-board computer (Raspberry Pi).",
    "Describe IP addresses, ports, client-server and publish-subscribe, and compare wireless options.",
    "Build and run a blinking LED in a simulator."
  ],
  sections: [
    {
      type: "defs", bloom: "Remember", title: "Key terms",
      items: [
        ["Internet of Things (IoT)", "Everyday objects fitted with <mark>sensors, actuators and processors</mark> that communicate with each other to serve a useful purpose (Sethi and Sarangi, 2017)."],
        ["Sensor", "A part that <mark>measures</mark> something in the physical world and turns it into an electrical signal. Examples: temperature, light, motion, distance."],
        ["Actuator", "A part that <mark>does</mark> something physical when it gets a signal. Examples: LED, motor, servo, buzzer, relay."],
        ["Microcontroller", "A small chip with a processor, memory and input/output pins, built to run one program to control hardware. Examples: Arduino Uno, ESP32."],
        ["Single-board computer", "A full computer on one board that runs an operating system. Example: Raspberry Pi."],
        ["GPIO", "General Purpose Input/Output: a pin you can set as an input (read) or an output (write) from your program."],
        ["Digital signal", "Only two values: HIGH (on) or LOW (off)."],
        ["Analog signal", "Any value in a range, for example 0 to 5 V from a light sensor."],
        ["Voltage (V)", "The electrical push that drives current. Measured in volts."],
        ["Current (I)", "The flow of electric charge. Measured in amps (A) or milliamps (mA)."],
        ["Resistance (R)", "How much a part <mark>opposes</mark> the flow of current. Measured in ohms (Ω)."],
        ["Breadboard", "A reusable board for building circuits without soldering. Metal strips under the holes join them in groups."],
        ["Protocol", "An agreed set of rules for how devices exchange messages, for example Wi-Fi, BLE or MQTT."],
        ["IP address", "A number that identifies a device on a network, for example 192.168.1.50."],
        ["Port", "A number that identifies which program on a device a message is for, for example 1883 for MQTT."]
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "What makes a system IoT",
      html: `<p>Every IoT system follows the same loop: <mark>sense → process → communicate → act</mark>.</p>
<table class="t"><tr><th>Stage</th><th>What happens</th><th>Smart gate example</th></tr>
<tr><td>Sense</td><td>A sensor measures the world</td><td>Ultrasonic sensor measures the distance to a car</td></tr>
<tr><td>Process</td><td>A controller runs a program that decides</td><td>Arduino checks: is the distance less than 50 cm?</td></tr>
<tr><td>Communicate</td><td>Data moves across a network</td><td>The gate reports each opening to a dashboard</td></tr>
<tr><td>Act</td><td>An actuator changes the world</td><td>A servo lifts the barrier</td></tr></table>
<p>Inputs come <em>into</em> the controller (sensors, buttons). Outputs go <em>out</em> of it (LEDs, motors, buzzers). Every project in this course is a mix of the two.</p>`
    },
    {
      type: "concept", bloom: "Understand", title: "Voltage, current and resistance",
      html: `<p>Think of water in a pipe. <mark>Voltage</mark> is the water pressure. <mark>Current</mark> is how much water flows. <mark>Resistance</mark> is a narrow part of the pipe that slows the flow.</p>
<p>The three are linked by <strong>Ohm's law</strong>:</p>
<pre class="code"><code>V = I × R        I = V ÷ R        R = V ÷ I</code></pre>
<figure><img src="img/current_flow.gif" alt="Animation of current flowing from Arduino pin 13 through a resistor and LED back to ground" width="800" height="450"><figcaption>Current needs a complete loop. Break the loop anywhere and the LED goes out.</figcaption></figure>
<h4>Why an LED needs a resistor</h4>
<p>An LED has almost no resistance of its own once it lights. Connected straight to 5 V, it draws too much current and burns out, and it can damage the board pin too. A resistor in series limits the current.</p>
<p>Worked example: Arduino pin = 5 V, red LED needs about 2 V, target current 15 mA = 0.015 A.</p>
<pre class="code"><code>R = (5 − 2) ÷ 0.015 = 200 Ω   →   use the next standard value up: 220 Ω</code></pre>
<div class="note">Raspberry Pi and ESP32 pins give 3.3 V, not 5 V. Redo the sum with 3.3 V: (3.3 − 2) ÷ 0.015 ≈ 87 Ω, so 100 Ω works. 220 Ω is still safe; the LED is just dimmer.</div>`
    },
    {
      type: "widget", name: "ledcalc", bloom: "Apply", title: "Try it: LED resistor calculator",
      lead: "<p>Change the board, LED colour and current. Watch how the resistor value changes.</p>"
    },
    {
      type: "concept", bloom: "Understand", title: "How a breadboard works",
      html: `<figure><img src="img/breadboard_strips.gif" alt="Animation showing which breadboard holes are connected by hidden metal strips" width="800" height="450"><figcaption>Each step shows a different group of connected holes.</figcaption></figure>
<ul>
<li><mark>Terminal strips:</mark> in each numbered column, holes a–e are joined by one metal strip, and holes f–j by another.</li>
<li><mark>Centre gap:</mark> it separates the two halves. Chips (DIP packages) sit across it, so each pin gets its own strip.</li>
<li><mark>Power rails:</mark> the long lines along the edges. Use + for power (5 V or 3.3 V) and − for ground (GND). The rails on the two sides are <strong>not</strong> joined, and on some long boards the rail is split in the middle. Add jumper wires if you need power on both sides.</li>
<li>Two legs of the same part must never sit in the same strip, or the part is short-circuited (bypassed).</li>
</ul>
<figure><img src="img/led_breadboard.png" alt="Arduino pin 13 wired through a 220 ohm resistor and red LED on a breadboard to ground" width="800" height="450"><figcaption>The resistor and the LED's long leg (anode) share column 9. The LED's short leg (cathode) goes to GND.</figcaption></figure>`
    },
    {
      type: "concept", bloom: "Understand", title: "Resistor colour code (IEC 60062)",
      html: `<p>Resistors are too small to print numbers on, so coloured bands show the value. The code is set by the international standard <strong>IEC 60062</strong>.</p>
<figure><img src="img/resistor_reading.png" alt="Resistor with red, red, brown and gold bands labelled 2, 2, times 10, plus or minus 5 percent" width="800" height="300"></figure>
<table class="t"><tr><th>Colour</th><th>Digit</th><th>Multiplier</th><th>Tolerance</th></tr>
<tr><td>Black</td><td>0</td><td>× 1</td><td></td></tr><tr><td>Brown</td><td>1</td><td>× 10</td><td>± 1%</td></tr><tr><td>Red</td><td>2</td><td>× 100</td><td>± 2%</td></tr><tr><td>Orange</td><td>3</td><td>× 1 000</td><td></td></tr><tr><td>Yellow</td><td>4</td><td>× 10 000</td><td></td></tr><tr><td>Green</td><td>5</td><td>× 100 000</td><td>± 0.5%</td></tr><tr><td>Blue</td><td>6</td><td>× 1 000 000</td><td>± 0.25%</td></tr><tr><td>Violet</td><td>7</td><td>× 10 000 000</td><td>± 0.1%</td></tr><tr><td>Grey</td><td>8</td><td>× 100 000 000</td><td>± 0.05%</td></tr><tr><td>White</td><td>9</td><td>× 1 000 000 000</td><td></td></tr><tr><td>Gold</td><td></td><td>× 0.1</td><td>± 5%</td></tr><tr><td>Silver</td><td></td><td>× 0.01</td><td>± 10%</td></tr></table>
<h4>How to read one</h4>
<ol><li>Turn the resistor so the <mark>gold or silver band is on the right</mark>. Gold and silver are never digits.</li>
<li><strong>4 bands:</strong> digit, digit, multiplier, tolerance. <strong>5 bands:</strong> digit, digit, digit, multiplier, tolerance.</li>
<li>Write the digits, then multiply.</li></ol>
<p>A common memory aid for the digit order 0–9: <mark>B</mark>ig <mark>B</mark>rown <mark>R</mark>abbits <mark>O</mark>ften <mark>Y</mark>ield <mark>G</mark>reat <mark>B</mark>ig <mark>V</mark>ocal <mark>G</mark>roans <mark>W</mark>hen... (black, brown, red, orange, yellow, green, blue, violet, grey, white).</p>`
    },
    {
      type: "widget", name: "resistor", bloom: "Apply", title: "Try it: resistor colour-code calculator",
      lead: "<p>Pick the colours on a real resistor from your kit and check its value.</p>"
    },
    {
      type: "concept", bloom: "Understand", title: "Arduino, ESP32 or Raspberry Pi?",
      html: `<figure><img src="img/boards.png" alt="Arduino Uno, ESP32 and Raspberry Pi side by side" width="800" height="360"></figure>
<table class="t"><tr><th></th><th>Arduino Uno / ESP32</th><th>Raspberry Pi</th></tr>
<tr><td>Type</td><td>Microcontroller</td><td>Single-board computer with Linux</td></tr>
<tr><td>Starts up</td><td>Instantly</td><td>About half a minute</td></tr>
<tr><td>Power</td><td>Very low, battery friendly</td><td>Higher, needs a steady supply</td></tr>
<tr><td>Timing</td><td>Precise, good for real-time control</td><td>Less precise (the OS shares the processor)</td></tr>
<tr><td>Analog input</td><td>Built in</td><td>None (needs an extra ADC chip)</td></tr>
<tr><td>Pin voltage</td><td>Uno 5 V; ESP32 3.3 V</td><td>3.3 V, <mark>not 5 V tolerant</mark></td></tr>
<tr><td>Wireless</td><td>Uno none; ESP32 Wi-Fi + Bluetooth</td><td>Wi-Fi + Bluetooth (most models)</td></tr>
<tr><td>Best for</td><td>Reading sensors, driving motors</td><td>Camera, database, web server, gateway</td></tr></table>
<p>Rule of thumb: <mark>read a sensor and move something → microcontroller</mark>. <mark>Needs a real computer → Raspberry Pi</mark>. Real systems often use both: many ESP32s at the edge, with one Pi collecting their data.</p>`
    },
    {
      type: "concept", bloom: "Understand", title: "Networking basics for IoT",
      html: `<h4>Addresses and ports</h4>
<p>An <mark>IP address</mark> finds the device; a <mark>port</mark> finds the program on it. Like a block of flats: the street address finds the building, the flat number finds the person. Example: <code>192.168.1.50:1883</code> means the MQTT broker on the Raspberry Pi.</p>
<h4>Two ways devices talk</h4>
<table class="t"><tr><th>Client-server</th><th>Publish-subscribe</th></tr>
<tr><td>The client asks, the server answers (a web browser and a website).</td><td>Devices <strong>publish</strong> messages to a <strong>topic</strong> on a <strong>broker</strong>. Anyone who <strong>subscribed</strong> to that topic gets a copy.</td></tr>
<tr><td>Uses HTTP.</td><td>Uses MQTT, an OASIS standard built for small devices and unreliable networks.</td></tr></table>
<figure><img src="img/mqtt_sniff.gif" alt="Animation of a bin publishing to a broker which forwards to subscribers" width="800" height="450"><figcaption>Watch the first three steps now. The last two (security) return in Week 4.</figcaption></figure>
<h4>Choosing a wireless technology</h4>
<table class="t"><tr><th>Technology</th><th>Range</th><th>Data rate</th><th>Power use</th><th>Good for</th></tr>
<tr><td>Wi-Fi</td><td>Medium (one building)</td><td>High</td><td>High</td><td>Devices with mains power that send lots of data</td></tr>
<tr><td>Bluetooth Low Energy (BLE)</td><td>Short (one room)</td><td>Low</td><td>Very low</td><td>Phone to device, wearables, the smart guitar</td></tr>
<tr><td>Zigbee</td><td>Short, but forms a mesh</td><td>Low</td><td>Very low</td><td>Smart home sensors and lights</td></tr>
<tr><td>LoRaWAN</td><td>Long (kilometres)</td><td>Very low</td><td>Very low</td><td>Bins and meters spread across a city</td></tr></table>
<p>There's always a trade-off: <mark>more range or more data costs more power</mark>.</p>`
    },
    {
      type: "fill", bloom: "Remember", title: "Fill the blanks: electronics basics",
      text: "Voltage is measured in {{volts}}, current in {{amps}} and resistance in {{ohms}}. Ohm's law says V = I × {{R}}. An LED needs a {{resistor}} in series to limit the current. On a breadboard, holes a–e in one column are joined by a metal {{strip}}. The long lines along the edges are the power {{rails}}. On a 4-band resistor, the third band is the {{multiplier}} and the fourth band is the {{tolerance}}.",
      extra: ["capacitor", "watts"]
    },
    {
      type: "match", bloom: "Understand", title: "Matching: sensor or actuator?",
      instr: "Decide whether each part senses the world or acts on it.",
      pairs: [["PIR motion sensor", "Sensor (input)"], ["Servo motor", "Actuator (output)"], ["Ultrasonic distance sensor", "Sensor (input)"], ["Buzzer", "Actuator (output)"], ["LED", "Actuator (output)"], ["Light-dependent resistor (LDR)", "Sensor (input)"], ["Push button", "Sensor (input)"], ["Relay", "Actuator (output)"]]
    },
    {
      type: "build", bloom: "Apply", title: "Build: your first blinking LED (simulator)",
      intro: `<figure><img src="img/blink.gif" alt="Animation of the blink loop turning an LED on and off" width="800" height="450"></figure>`,
      steps: [
        { title: "Open the simulator", html: `<p>Go to <a href="https://wokwi.com/projects/new/arduino-uno" target="_blank" rel="noopener">Wokwi (new Arduino Uno project)</a>. It runs Arduino code in your browser, so no hardware is needed today.</p>` },
        { title: "Add the parts", html: `<p>Click <strong>+</strong> and add an LED and a resistor. Set the resistor to 220 Ω. Wire: <code>pin 13 → resistor → LED anode (long leg, A)</code>, then <code>LED cathode (short leg, C) → GND</code>.</p>` },
        { title: "Type the code", html: `<p>Replace the starter code with this sketch. Read every comment.</p>`, code: `const int ledPin = 13;      // the LED is on pin 13

void setup() {
  pinMode(ledPin, OUTPUT);  // pin 13 is an output
}

void loop() {
  digitalWrite(ledPin, HIGH);  // LED on
  delay(1000);                 // wait 1000 ms
  digitalWrite(ledPin, LOW);   // LED off
  delay(1000);                 // wait 1000 ms
}` },
        { title: "Run and change it", html: `<p>Press the green play button. Then try: make it blink twice as fast; make it stay on for 2 s and off for 0.2 s; remove the resistor wire and see what happens to the loop.</p>`, after: `<div class="note"><code>setup()</code> runs <mark>once</mark> at power-on. <code>loop()</code> runs <mark>again and again forever</mark>.</div>` }
      ]
    },
    {
      type: "match", bloom: "Apply", title: "Matching: read the resistors",
      instr: "Work out the value of each 4-band resistor. Use the colour table or the calculator above.",
      pairs: [["brown, black, red, gold", "1 kΩ ±5%"], ["red, red, brown, gold", "220 Ω ±5%"], ["yellow, violet, orange, gold", "47 kΩ ±5%"], ["brown, black, orange, silver", "10 kΩ ±10%"], ["orange, orange, brown, gold", "330 Ω ±5%"]],
      extra: ["22 Ω ±5%", "470 Ω ±5%"]
    },
    {
      type: "order", bloom: "Apply", title: "Puzzle: rebuild the blink sketch",
      items: ["const int ledPin = 13;", "void setup() {", "  pinMode(ledPin, OUTPUT);", "}", "void loop() {", "  digitalWrite(ledPin, HIGH);", "  delay(1000);", "  digitalWrite(ledPin, LOW);", "  delay(1000);", "}"],
      why: "The constant comes first, setup() sets the pin once, then loop() repeats on, wait, off, wait."
    },
    {
      type: "bug", bloom: "Analyse", title: "Bug hunt: the LED will not blink",
      instr: "A student's sketch compiles badly and the LED never blinks properly. Click every line with an error.",
      code: `const int ledPin = 13

void setup() {
  pinMode(ledPin, INPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
}`,
      bugs: { 0: "Missing semicolon at the end of the line: <code>const int ledPin = 13;</code>", 3: "The LED is an output, so the pin must be <code>OUTPUT</code>, not <code>INPUT</code>.", 9: "There is no delay after turning the LED off. The loop restarts at once, so the LED looks on all the time. Add <code>delay(1000);</code> after this line." },
      fixed: `const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`
    },
    {
      type: "bug", bloom: "Analyse", title: "Error hunt: a breadboard wiring list",
      instr: "Here is a wiring list for the LED circuit. Click every connection that is wrong.",
      code: `Arduino pin 13  → breadboard column 3, row a
Resistor leg 1  → column 3, row c
Resistor leg 2  → column 3, row d
LED long leg    → column 9, row e
LED short leg   → column 11, row e
Column 11, row a → GND rail (−)
Arduino GND     → + rail`,
      bugs: { 2: "Both resistor legs are in column 3, the same strip, so the resistor is bypassed. Leg 2 should go to column 9 to meet the LED's long leg.", 6: "Arduino GND must connect to the − (ground) rail, not the + rail. Otherwise the loop is never completed." }
    },
    {
      type: "concept", bloom: "Analyse", label: "Industry link: home CCTV", title: "Industry link: what is inside a home security camera?",
      html: `<p>A home CCTV camera is an IoT device. Take one apart in your head and you find this week's parts:</p>
<table class="t"><tr><th>Part</th><th>Role</th><th>Course link</th></tr>
<tr><td>Image sensor (CMOS)</td><td>Sensor: turns light into a picture</td><td>Sense</td></tr>
<tr><td>PIR sensor</td><td>Sensor: wakes the camera when warm bodies move, saving power</td><td>Week 3 motion lighting</td></tr>
<tr><td>Infrared LEDs</td><td>Actuator: light the scene at night (invisible to people)</td><td>LEDs + resistors</td></tr>
<tr><td>Speaker, siren, floodlight</td><td>Actuators: warn intruders</td><td>Buzzer, relay</td></tr>
<tr><td>System-on-chip (SoC)</td><td>A microprocessor that compresses video (H.264/H.265) and runs Linux</td><td>Pi-class computer, not an Uno</td></tr>
<tr><td>Wi-Fi or Ethernet (often Power over Ethernet)</td><td>Sends video to a recorder, app or cloud</td><td>Networking</td></tr>
<tr><td>microSD card, network video recorder (NVR) or cloud</td><td>Stores recordings</td><td>Edge, fog, cloud (Week 2)</td></tr></table>
<p>Video needs a lot of data, so most cameras use <mark>Wi-Fi or Ethernet, not BLE or LoRaWAN</mark>. Battery cameras save power by sleeping until the PIR sensor wakes them. In Weeks 2–6 you'll follow this product from architecture, to threats, to a working prototype and a startup plan.</p>`
    },
    {
      type: "mcq", bloom: "Evaluate", title: "Scenario questions: choose and justify",
      qs: [
        { q: "A city wants fill-level sensors in 2 000 bins spread over 15 km, each running for years on a battery. Which wireless option fits best?", opts: ["Wi-Fi", "Bluetooth Low Energy", "LoRaWAN", "Ethernet cable"], a: 2, why: "LoRaWAN reaches kilometres with very low power. A bin only sends a few bytes a few times a day, so its low data rate does not matter." },
        { q: "A smart guitar must send each note to a phone a metre away, with long battery life. Which option fits best?", opts: ["LoRaWAN", "Bluetooth Low Energy", "Wi-Fi to a cloud server", "Zigbee mesh"], a: 1, why: "BLE is built for short-range, low-power links between a phone and a device." },
        { q: "A student connects an LED straight to a 5 V pin with no resistor. What is the most likely result?", opts: ["The LED is brighter and lasts longer", "Too much current flows and the LED (and possibly the pin) is damaged", "Nothing, because LEDs limit their own current", "The Arduino switches to 3.3 V automatically"], a: 1, why: "Without a resistor nothing limits the current, so it rises well above the LED's rating." },
        { q: "A home camera streams video to a phone app all day from a socket on the wall. Which link do you choose?", opts: ["LoRaWAN", "BLE", "Wi-Fi or Ethernet", "Zigbee"], a: 2, why: "Video needs a high data rate, and the camera has mains power, so Wi-Fi or wired Ethernet fits. LoRaWAN and BLE cannot carry continuous video." },
        { q: "A gate must recognise number plates with a camera. Which controller do you choose?", opts: ["Arduino Uno alone", "ESP32 alone", "Raspberry Pi (with a camera)", "A relay"], a: 2, why: "Image recognition needs an operating system, more memory and a camera interface, which is what a Raspberry Pi gives you." }
      ]
    },
    {
      type: "create", bloom: "Create", title: "Design task: sketch your own IoT idea",
      brief: `<p>On paper or a whiteboard, design a small IoT device for your school or home. Draw the <mark>sense → process → communicate → act</mark> loop and label every part.</p>`,
      checklist: ["Names at least one sensor and says what it measures", "Names at least one actuator and says what it does", "Chooses Arduino, ESP32 or Raspberry Pi and gives one reason", "Chooses a wireless technology and justifies it by range, data and power", "Shows the LED or actuator circuit with a correctly sized resistor where needed", "Lists one thing that could go wrong if someone tampered with it (we use this in Week 2)"]
    }
  ],
  sources: [
    ["Sethi, P. and Sarangi, S. R. (2017) Internet of Things: Architectures, Protocols, and Applications", "https://doi.org/10.1155/2017/9324035", "Journal of Electrical and Computer Engineering"],
    ["SparkFun: How to Use a Breadboard", "https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard/all"],
    ["IEC 60062:2016 Marking codes for resistors and capacitors", "https://webstore.iec.ch/en/publication/25395"],
    ["Arduino documentation: Blink example", "https://docs.arduino.cc/built-in-examples/basics/Blink/"],
    ["Raspberry Pi documentation: GPIO (3.3 V logic)", "https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio"],
    ["MQTT.org FAQ (OASIS standard, ports 1883 and 8883)", "https://mqtt.org/faq/"],
    ["Wokwi online simulator", "https://wokwi.com"]
  ]
});
