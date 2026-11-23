window.WEEKS = window.WEEKS || [];
window.WEEKS.push({
  num: 3,
  title: "Arduino Programming and the Tutorial Ladder",
  subtitle: "From a blinking LED to a Wi-Fi sensor: eight small builds, each adding one new skill that your project needs.",
  outcomes: [
    "Explain the structure of an Arduino sketch and use variables, if-statements, loops and functions.",
    "Read digital and analog inputs and drive LEDs, buzzers and servos.",
    "Measure distance with an ultrasonic sensor and react to motion with a PIR sensor.",
    "Use millis() for timing that does not block the program.",
    "Connect an ESP32 to Wi-Fi and publish sensor data with MQTT, and control it over BLE.",
    "Debug sketches and wiring by reading them line by line."
  ],
  sections: [
    {
      type: "defs", bloom: "Remember", title: "Key terms",
      items: [
        ["Sketch", "An Arduino program."],
        ["setup()", "Runs once when the board powers on or resets. Used to set pin modes and start serial."],
        ["loop()", "Runs again and again forever after setup()."],
        ["pinMode(pin, mode)", "Sets a pin as <code>OUTPUT</code>, <code>INPUT</code> or <code>INPUT_PULLUP</code>."],
        ["digitalWrite(pin, value)", "Sets an output pin <code>HIGH</code> (on) or <code>LOW</code> (off)."],
        ["digitalRead(pin)", "Reads an input pin: returns <code>HIGH</code> or <code>LOW</code>."],
        ["analogRead(pin)", "Reads an analog pin (A0–A5 on the Uno) and returns 0–1023."],
        ["analogWrite(pin, value)", "Sends PWM (0–255) to dim an LED or set motor speed, on PWM pins marked ~."],
        ["delay(ms)", "Pauses the whole program. Simple, but nothing else can happen while it waits."],
        ["millis()", "The number of milliseconds since the board started. Used for timing <mark>without blocking</mark>."],
        ["Constant", "A named value that never changes, for example <code>const int ledPin = 13;</code>"],
        ["Function", "A named block of code you can call again and again, for example <code>readDistance()</code>."],
        ["Serial Monitor", "A window in the Arduino IDE that shows messages sent with <code>Serial.println()</code>. Your main debugging tool."],
        ["INPUT_PULLUP", "Turns on a resistor inside the chip that holds the pin HIGH. A button to GND then reads LOW when pressed."],
        ["Library", "Ready-made code you include, for example <code>#include &lt;Servo.h&gt;</code>."],
        ["pulseIn(pin, HIGH)", "Measures how long a pin stays HIGH, in microseconds. Used with the ultrasonic sensor."]
      ]
    },
    {
      type: "concept", bloom: "Understand", title: "How a sketch is built",
      html: `<pre class="code"><code>// 1. Constants and variables: names for pins and values
const int ledPin = 13;
int count = 0;

// 2. setup(): runs once
void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);          // open the Serial Monitor at 9600 baud
}

// 3. loop(): runs forever
void loop() {
  count = count + 1;
  if (count % 2 == 0) {        // even number?
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  Serial.println(count);       // print to the Serial Monitor
  delay(500);
}</code></pre>
<h4>Three rules that catch most beginners</h4>
<ul><li>Every statement ends with a <mark>semicolon</mark>.</li>
<li><code>=</code> <mark>stores</mark> a value; <code>==</code> <mark>compares</mark> two values. <code>if (x = 5)</code> is a bug.</li>
<li>Names are case-sensitive: <code>ledPin</code> and <code>LedPin</code> are different.</li></ul>
<h4>Pin names used in this course</h4>
<p>Every tutorial and every exercise uses the same names, so you never have to relearn them.</p>
<table class="t"><tr><th>Name</th><th>Pin</th><th>Part</th></tr>
<tr><td><code>ledPin</code></td><td>13 (Uno), 2 (ESP32)</td><td>LED or lamp</td></tr>
<tr><td><code>redPin</code>, <code>amberPin</code>, <code>greenPin</code></td><td>12, 11, 10</td><td>Traffic light LEDs</td></tr>
<tr><td><code>buttonPin</code></td><td>2</td><td>Push button (to GND)</td></tr>
<tr><td><code>buzzerPin</code></td><td>8</td><td>Piezo buzzer</td></tr>
<tr><td><code>pirPin</code></td><td>7</td><td>PIR motion sensor</td></tr>
<tr><td><code>ldrPin</code></td><td>A0</td><td>Light-dependent resistor</td></tr>
<tr><td><code>trigPin</code>, <code>echoPin</code></td><td>5, 6 (Uno); 5, 18 (ESP32)</td><td>HC-SR04 ultrasonic sensor</td></tr>
<tr><td><code>servoPin</code></td><td>3</td><td>Servo signal wire</td></tr></table>`
    },
    {
      type: "fill", bloom: "Remember", title: "Fill the blanks: Arduino functions",
      text: "Code that runs once at power-on goes in {{setup}}. Code that repeats forever goes in {{loop}}. To make pin 13 an output we write pinMode(13, {{OUTPUT}}). To turn it on we use {{digitalWrite}}(13, HIGH). A light sensor on A0 is read with {{analogRead}}, which returns a number from 0 to {{1023}}. To compare two values we use {{==}}. To time things without stopping the program we use {{millis}}.",
      extra: ["INPUT", "delay", "255"]
    },
    {
      type: "match", bloom: "Understand", title: "Matching: which function does the job?",
      pairs: [["Wait 2 seconds and do nothing else", "delay(2000)"], ["Check if a button is pressed", "digitalRead(buttonPin)"], ["Measure light level from 0 to 1023", "analogRead(ldrPin)"], ["Dim an LED to half brightness", "analogWrite(ledPin, 128)"], ["Measure the echo time of the ultrasonic sensor", "pulseIn(echoPin, HIGH)"], ["Print a value so you can debug", "Serial.println(value)"], ["Find how long the board has been running", "millis()"]]
    },
    {
      type: "build", bloom: "Apply", label: "Tutorial 1–2", title: "Tutorials 1–2: traffic lights",
      intro: `<figure><img src="img/traffic_lights.gif" alt="Animation of a traffic light moving through red, red and amber, green, amber" width="800" height="450"><figcaption>A traffic light is a <mark>sequence of states</mark>. The gate in Tutorial 7 is too: detect, open, wait, close.</figcaption></figure>
<p><strong>Parts:</strong> Arduino Uno, breadboard, red, amber and green LEDs, 3 × 220 Ω resistors, push button, piezo buzzer, jumper wires.</p>`,
      steps: [
        { title: "Wire three LEDs", html: "<p>Wire each LED exactly like Week 1's LED: <code>pin → 220 Ω → LED long leg</code>, short leg to the GND rail. Use pins 12 (red), 11 (amber), 10 (green). Connect Arduino GND to the − rail.</p>" },
        { title: "Tutorial 1: the basic sequence", html: "<p>A function <code>setLights()</code> sets all three LEDs in one line, so the loop reads like the GIF.</p>", code: `const int redPin = 12;
const int amberPin = 11;
const int greenPin = 10;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(amberPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
}

void setLights(int r, int a, int g) {
  digitalWrite(redPin, r);
  digitalWrite(amberPin, a);
  digitalWrite(greenPin, g);
}

void loop() {
  setLights(HIGH, LOW, LOW);   // red: stop
  delay(3000);
  setLights(HIGH, HIGH, LOW);  // red + amber: get ready
  delay(1500);
  setLights(LOW, LOW, HIGH);   // green: go
  delay(3000);
  setLights(LOW, HIGH, LOW);   // amber: stop if safe
  delay(1500);
}` },
        { title: "Tutorial 2: add a pedestrian button and buzzer", html: "<p>Button: one leg to pin 2, the other to GND (no resistor needed, because <code>INPUT_PULLUP</code> uses the chip's own). Buzzer: + to pin 8, − to GND. Lights stay green for cars until someone presses the button.</p>", code: `const int redPin = 12;
const int amberPin = 11;
const int greenPin = 10;
const int buttonPin = 2;
const int buzzerPin = 8;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(amberPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);  // reads LOW when pressed
  pinMode(buzzerPin, OUTPUT);
}

void setLights(int r, int a, int g) {
  digitalWrite(redPin, r);
  digitalWrite(amberPin, a);
  digitalWrite(greenPin, g);
}

void loop() {
  setLights(LOW, LOW, HIGH);               // green for cars
  while (digitalRead(buttonPin) == HIGH) {
    // wait here until the button is pressed
  }
  setLights(LOW, HIGH, LOW);               // amber
  delay(1500);
  setLights(HIGH, LOW, LOW);               // red: people cross
  tone(buzzerPin, 1000);                   // beep while crossing
  delay(5000);
  noTone(buzzerPin);
  setLights(HIGH, HIGH, LOW);              // red + amber
  delay(1500);
}` },
        { title: "Test and stretch", html: "<p>Press the button while the light is green. Stretch tasks: make the buzzer beep on and off instead of a long tone; add a second button for the other side of the road.</p>" }
      ]
    },
    {
      type: "order", bloom: "Apply", title: "Puzzle: order the traffic light loop",
      items: ["void loop() {", "  setLights(HIGH, LOW, LOW);", "  delay(3000);", "  setLights(HIGH, HIGH, LOW);", "  delay(1500);", "  setLights(LOW, LOW, HIGH);", "  delay(3000);", "  setLights(LOW, HIGH, LOW);", "  delay(1500);", "}"],
      why: "Red → red and amber → green → amber, each followed by its own delay."
    },
    {
      type: "build", bloom: "Apply", label: "Tutorial 3–4", title: "Tutorials 3–4: motion lighting and a night light",
      intro: `<figure><img src="img/pir_light.gif" alt="Animation of a lamp turning on when a PIR sensor detects a person and off 5 seconds after they leave" width="800" height="450"></figure>`,
      steps: [
        { title: "Wire the PIR sensor", html: "<p>HC-SR501 PIR: <code>VCC → 5V</code>, <code>OUT → pin 7</code>, <code>GND → GND</code>. Keep the LED on pin 13 from Week 1. Give the PIR about a minute to settle after power-on.</p>" },
        { title: "Tutorial 3: motion lighting with millis()", html: "<p>Using <code>delay(5000)</code> would freeze the board for 5 seconds. Instead, remember <mark>when</mark> motion was last seen and compare with <code>millis()</code>. The board stays free to do other jobs.</p>", code: `const int pirPin = 7;
const int ledPin = 13;
const unsigned long holdTime = 5000;   // stay on 5 s after the last motion
unsigned long lastMotion = 0;

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    lastMotion = millis();            // remember when we saw movement
    Serial.println("Motion detected");
  }

  if (millis() - lastMotion < holdTime) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}` },
        { title: "Tutorial 4: night light with an LDR (analog input)", html: "<p>Make a voltage divider: <code>5V → LDR → A0</code> and <code>A0 → 10 kΩ → GND</code>. Darker means a higher LDR resistance, so the reading at A0 drops. Open the Serial Monitor, cover the LDR, and note your dark number.</p>", code: `const int ldrPin = A0;
const int ledPin = 13;
const int darkLevel = 300;     // change this to suit your room

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(ldrPin);   // 0 (dark) to 1023 (bright)
  Serial.println(light);
  if (light < darkLevel) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  delay(200);
}` },
        { title: "Stretch: combine them", html: "<p>Turn the lamp on only when it is dark <strong>and</strong> there is motion: <code>if (light &lt; darkLevel &amp;&amp; digitalRead(pirPin) == HIGH)</code>. Security lights and CCTV infrared LEDs work this way.</p>" }
      ]
    },
    {
      type: "bug", bloom: "Analyse", title: "Bug hunt: the motion light never works",
      code: `const int pirPin = 7;
const int ledPin = 13;

void setup() {
  pinMode(pirPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (digitalRead(pirPin) = HIGH) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW)
  }
}`,
      bugs: { 4: "The PIR is a sensor, so its pin must be an <code>INPUT</code>.", 9: "<code>=</code> stores a value. To compare, use <code>==</code>: <code>if (digitalRead(pirPin) == HIGH)</code>.", 12: "Missing semicolon after <code>digitalWrite(ledPin, LOW)</code>." }
    },
    {
      type: "build", bloom: "Apply", label: "Tutorial 5–6", title: "Tutorials 5–6: ultrasonic distance and the servo gate",
      intro: `<figure><img src="img/ultrasonic_bin.gif" alt="Animation of an ultrasonic sensor pulse bouncing off rubbish in a bin, then the bin filling up" width="800" height="450"></figure>
<p><strong>Parts:</strong> HC-SR04 ultrasonic sensor, SG90 servo, Arduino Uno, jumper wires.</p>`,
      steps: [
        { title: "Wire the sensor", html: "<p>HC-SR04: <code>VCC → 5V</code>, <code>Trig → pin 5</code>, <code>Echo → pin 6</code>, <code>GND → GND</code>.</p>" },
        { title: "Tutorial 5: measure distance", html: "<p>The sensor sends a burst of sound when Trig gets a 10 µs pulse. Echo stays HIGH for as long as the sound takes to go there and back. Sound travels about 0.0343 cm per microsecond, and we divide by 2 because the trip is there and back.</p>", code: `const int trigPin = 5;
const int echoPin = 6;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

long readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);              // 10 µs trigger pulse
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);   // echo time in µs
  return duration * 0.0343 / 2;             // distance in cm
}

void loop() {
  Serial.print("Distance: ");
  Serial.print(readDistance());
  Serial.println(" cm");
  delay(300);
}` },
        { title: "Tutorial 6: the smart gate (sensor + servo)", html: `<figure><img src="img/gate.gif" alt="Animation of a car approaching, the barrier lifting, the car passing and the barrier closing" width="800" height="450"></figure><p>Servo: brown → GND, red → 5V, orange → pin 3. For more than one servo, power them from a separate 5 V supply with a shared GND, because servos can draw more current than the Uno's 5 V pin should give.</p>`, code: `#include <Servo.h>

const int trigPin = 5;
const int echoPin = 6;
const int servoPin = 3;
const int openDistance = 50;   // cm
Servo gateServo;

long readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.0343 / 2;
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  gateServo.attach(servoPin);
  gateServo.write(0);            // gate closed
  Serial.begin(9600);
}

void loop() {
  long distance = readDistance();
  Serial.println(distance);
  if (distance > 0 && distance < openDistance) {   // 0 means no echo
    gateServo.write(90);         // open
    delay(5000);                 // let the car pass
    gateServo.write(0);          // close
  }
  delay(200);
}`, after: `<div class="warn">Safety: this simple version closes after 5 seconds even if a car is still under the barrier. Stretch task: check the distance again before closing, and only close when the way is clear.</div>` }
      ]
    },
    {
      type: "widget", name: "distance", bloom: "Apply", title: "Try it: from echo time to bin level",
      lead: "<p>Slide the echo time. This is the same sum your code does for the smart bin.</p>"
    },
    {
      type: "bug", bloom: "Analyse", title: "Bug hunt: the gate opens by itself",
      instr: "The gate sometimes opens with no car there, and the distances look twice too big. Click every line with an error.",
      code: `void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, OUTPUT);
  gateServo.attach(servoPin);
}

long readDistance() {
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.0343;
}

void loop() {
  long distance = readDistance();
  if (distance < openDistance) {
    gateServo.write(90);
    delay(5000);
    gateServo.write(0);
  }
}`,
      bugs: { 2: "Echo is a signal coming <em>into</em> the Arduino, so it must be <code>INPUT</code>.", 11: "The sound goes there and back, so divide by 2: <code>duration * 0.0343 / 2</code>.", 16: "If no echo returns, <code>pulseIn</code> gives 0, and 0 is less than 50, so the gate opens. Use <code>distance &gt; 0 &amp;&amp; distance &lt; openDistance</code>." }
    },
    {
      type: "build", bloom: "Apply", label: "Tutorial 7", title: "Tutorial 7: ESP32 bin sensor on Wi-Fi with MQTT",
      intro: `<p>Now the device joins the network. The ESP32 measures the bin and <mark>publishes</mark> the fill level to an MQTT broker. In Week 5 the broker runs on your Raspberry Pi. For now, use the Wokwi ESP32 simulator or a lab broker.</p>
<figure><img src="img/mqtt_sniff.gif" alt="Animation of an ESP32 publishing a bin level to a broker which forwards it to subscribers" width="800" height="450"></figure>`,
      steps: [
        { title: "Set up the Arduino IDE for ESP32", html: "<p>In the Arduino IDE: <strong>Boards Manager</strong> → install <em>esp32 by Espressif Systems</em>. <strong>Library Manager</strong> → install <em>PubSubClient by Nick O'Leary</em>. Select your ESP32 board and port.</p>" },
        { title: "Wire it safely", html: "<p><code>Trig → GPIO 5</code>, <code>Echo → GPIO 18</code>.</p>", after: `<div class="warn">The ESP32 runs at <strong>3.3 V</strong> and its pins are not 5 V tolerant. A 5 V HC-SR04 sends 5 V on Echo. Either use the 3.3 V version (HC-SR04P) or put a voltage divider on Echo (1 kΩ from Echo to GPIO 18, 2 kΩ from GPIO 18 to GND).</div>` },
        { title: "Code: publish the fill level", html: "<p>Change the Wi-Fi name, password and broker address. In Wokwi use Wi-Fi <code>Wokwi-GUEST</code> with an empty password and a public test broker such as <code>test.mosquitto.org</code>. Never send real data to a public broker: anyone can read it (Week 4).</p>", code: `#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "LabWiFi";
const char* wifiPassword = "change-me";
const char* broker = "192.168.1.50";        // your Raspberry Pi
const char* topic = "school/bins/bin1/level";

const int trigPin = 5;
const int echoPin = 18;
const int binDepth = 50;                     // cm from sensor to bin floor

WiFiClient net;
PubSubClient client(net);

long readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);   // give up after 30 ms
  return duration * 0.0343 / 2;
}

void connectWiFi() {
  WiFi.begin(ssid, wifiPassword);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void connectMQTT() {
  while (!client.connected()) {
    client.connect("bin1");                  // client ID
    delay(1000);
  }
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(115200);
  connectWiFi();
  client.setServer(broker, 1883);
}

void loop() {
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  long distance = readDistance();
  int level = 100 * (binDepth - distance) / binDepth;   // % full
  level = constrain(level, 0, 100);
  client.publish(topic, String(level).c_str());
  Serial.println(level);
  delay(10000);                              // every 10 s
}` },
        { title: "Watch the messages arrive", html: "<p>On a laptop or the Pi with Mosquitto clients installed, subscribe to every bin:</p>", code: `mosquitto_sub -h 192.168.1.50 -t "school/bins/#" -v` , after: "<p>Notice: this connection has <strong>no password and no encryption</strong>. That's deliberate. You'll attack it in Week 4, then secure it.</p>" }
      ]
    },
    {
      type: "build", bloom: "Apply", label: "Tutorial 8", title: "Tutorial 8: ESP32 Bluetooth Low Energy LED (for the smart guitar)",
      intro: "<p>BLE is how the guitar will talk to a phone. The ESP32 becomes a BLE <mark>server</mark> with one <mark>characteristic</mark> (a value the phone can write). Writing 1 turns the LED on; writing 0 turns it off.</p>",
      steps: [
        { title: "Code", html: "<p>Uses the BLE library that comes with the ESP32 board package. The UUIDs are the ones from the official ArduinoBLE LED example.</p>", code: `#include <BLEDevice.h>
#include <BLEServer.h>

const int ledPin = 2;   // built-in LED on many ESP32 boards
#define SERVICE_UUID  "19b10000-e8f2-537e-4f6c-d104768a1214"
#define LED_CHAR_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"

class LedCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *c) {
    String value = String(c->getValue().c_str());
    if (value == "1") digitalWrite(ledPin, HIGH);
    if (value == "0") digitalWrite(ledPin, LOW);
  }
};

void setup() {
  pinMode(ledPin, OUTPUT);
  BLEDevice::init("IoT-Lab-LED");
  BLEServer *server = BLEDevice::createServer();
  BLEService *service = server->createService(SERVICE_UUID);
  BLECharacteristic *ledChar = service->createCharacteristic(
      LED_CHAR_UUID, BLECharacteristic::PROPERTY_WRITE);
  ledChar->setCallbacks(new LedCallback());
  service->start();
  BLEDevice::getAdvertising()->addServiceUUID(SERVICE_UUID);
  BLEDevice::startAdvertising();
}

void loop() {
}` },
        { title: "Control it from a phone", html: "<p>Install a BLE scanner app such as <em>nRF Connect</em> (Nordic Semiconductor). Connect to <code>IoT-Lab-LED</code>, open the service, and write the text <code>1</code> or <code>0</code> to the characteristic.</p>" },
        { title: "Think about security", html: "<p>Anyone nearby with the same app can do this too. There's no pairing and no password. Write this into your threat model as a <strong>Spoofing</strong> threat; Week 4 covers BLE pairing and bonding.</p>" }
      ]
    },
    {
      type: "bug", bloom: "Analyse", title: "Error hunt: the ESP32 bin sensor",
      instr: "A student's ESP32 bin has wiring and code problems. Click every line with an error.",
      code: `HC-SR04 Echo  → ESP32 GPIO 18 (direct wire, 5 V sensor)
HC-SR04 Trig  → ESP32 GPIO 5
WiFiClient net;
PubSubClient client(net);
client.setServer(broker, 8883);
long distance = readDistance();
client.publish(topic, distance);`,
      bugs: { 0: "A 5 V Echo signal can damage the 3.3 V ESP32 pin. Use an HC-SR04P or a 1 kΩ / 2 kΩ voltage divider.", 4: "Port 8883 is MQTT over TLS, but <code>WiFiClient</code> has no TLS. Use port 1883 for this lab, or <code>WiFiClientSecure</code> with 8883 (Week 4).", 6: "<code>publish()</code> needs text, not a number: <code>client.publish(topic, String(distance).c_str());</code>" }
    },
    {
      type: "concept", bloom: "Analyse", label: "Industry link: home CCTV", title: "Industry link: the camera's trigger logic",
      html: `<p>A battery CCTV camera uses <mark>exactly the logic from Tutorials 3 and 4</mark>:</p>
<pre class="code"><code>if (PIR sees motion) {
  wake the processor and start recording;
  if (light level is low) turn on the infrared LEDs;   // night vision
  publish "motion" event over MQTT / HTTPS;            // phone alert
  keep recording until no motion for holdTime;         // millis() pattern
}</code></pre>
<p>Why not record all the time? Video uses a lot of power and storage. A PIR sensor uses almost none, so it acts as the gatekeeper. Real products then run <mark>person detection at the edge</mark> to avoid alerts for cats and swaying trees. You'll build that on a Raspberry Pi in Week 5.</p>
<table class="t"><tr><th>This week's skill</th><th>CCTV feature</th></tr>
<tr><td>PIR + millis()</td><td>Motion-triggered recording with a hold time</td></tr>
<tr><td>LDR analog read</td><td>Automatic day/night (infrared) mode</td></tr>
<tr><td>Buzzer / tone()</td><td>Siren</td></tr>
<tr><td>Servo</td><td>Pan-tilt camera mount</td></tr>
<tr><td>ESP32 + MQTT</td><td>Motion events to the app</td></tr>
<tr><td>BLE</td><td>First-time setup from the phone (sending the Wi-Fi password)</td></tr></table>`
    },
    {
      type: "mcq", bloom: "Evaluate", title: "Scenario questions: choose the better code",
      qs: [
        { q: "A motion light must also respond instantly to a manual on/off button. Which timing approach is better?", opts: ["delay(5000) after motion", "Store millis() when motion is seen and compare later", "Use a longer delay", "Remove the button"], a: 1, why: "delay() freezes the board, so button presses during those 5 seconds are missed. The millis() pattern keeps the loop running." },
        { q: "A button is wired from pin 2 to GND with no resistor. Which pin mode is right?", opts: ["INPUT", "OUTPUT", "INPUT_PULLUP", "ANALOG"], a: 2, why: "Without a pull-up, the pin floats and reads random values. INPUT_PULLUP holds it HIGH until the button pulls it LOW." },
        { q: "The smart bin publishes every 100 ms on battery power. A reviewer says this is a bad choice. Why?", opts: ["MQTT cannot send that fast", "Fill level changes slowly; frequent Wi-Fi sends drain the battery for no benefit", "The broker will crash", "Ultrasonic sensors only work once a minute"], a: 1, why: "Match how often you send to how fast the value really changes. Every few minutes, or only on change, is enough for a bin." },
        { q: "Two designs for a camera's night mode: (A) IR LEDs on all the time; (B) IR LEDs on only when the LDR says it is dark. Which is better and why?", opts: ["A, because it is simpler", "B, because it saves power and avoids washing out daytime images", "A, because LDRs are unreliable", "They are the same"], a: 1, why: "Sensing before acting is the core IoT pattern: it saves energy and improves results." }
      ]
    },
    {
      type: "create", bloom: "Create", title: "Design task: first working prototype of your project",
      brief: "<p>Combine at least two tutorials into the first prototype of your group project. Examples: guitar = touch or piezo inputs + buzzer notes + BLE; gate = ultrasonic + servo + traffic light status LEDs; bins = ultrasonic + full LED + ESP32 MQTT.</p>",
      checklist: ["Uses at least one sensor and one actuator", "Uses the course pin names (ledPin, trigPin, echoPin and so on)", "Uses millis() somewhere instead of a long delay()", "Prints useful debug messages to the Serial Monitor", "Wiring diagram drawn and resistor values checked", "Any 5 V signal into an ESP32 or Raspberry Pi is level-shifted", "Week 2 threat model updated with anything new you found while building"]
    }
  ],
  sources: [
    ["Arduino Language Reference (pinMode, digitalWrite, analogRead, millis, pulseIn)", "https://docs.arduino.cc/language-reference/"],
    ["Arduino: Blink Without Delay example", "https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/"],
    ["Arduino Servo library", "https://docs.arduino.cc/libraries/servo/"],
    ["NYU ITP Physical Computing: Ultrasonic Distance Sensor lab", "https://itp.nyu.edu/physcomp/labs/lab-ultrasonic-distance-sensor/"],
    ["Espressif: Arduino core for the ESP32", "https://docs.espressif.com/projects/arduino-esp32/en/latest/"],
    ["PubSubClient MQTT library (Nick O'Leary)", "https://pubsubclient.knolleary.net/"],
    ["ArduinoBLE LED example (UUIDs used in Tutorial 8)", "https://docs.arduino.cc/libraries/arduinoble/"],
    ["Wokwi ESP32 Wi-Fi simulation guide", "https://docs.wokwi.com/guides/esp32-wifi"]
  ]
});
