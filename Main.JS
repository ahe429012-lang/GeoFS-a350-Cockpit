


class Knob {
  constructor(field, knobId, displayId, min, max, step, initial) {
    this.zone = document.getElementById(field);
    this.zone.addEventListener("wheel", this.handleScroll.bind(this));
    this.knob = document.getElementById(knobId);
    this.display = document.getElementById(displayId);

    this.min = min;
    this.max = max;
    this.step = step;

    this.value = initial;
    this.rotation = 0;
    this.field = field;

    
  }

  handleScroll(e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      this.value += this.step;
      this.rotation += 5;
    } else {
      this.value -= this.step;
      this.rotation -= 5;
    }

    if (this.value > this.max) this.value = this.min;
    if (this.value < this.min) this.value = this.max;

    this.knob.style.transform = `rotate(${this.rotation}deg)`;
    this.display.textContent = this.value;
    autopilot[this.field] = this.value;
    
    if (this.field === "heading") geofs.autopilot.setCourse(this.value);
    if (this.field === "altitude") geofs.autopilot.setAltitude(this.value);
    if (this.field === "speed") geofs.autopilot.setSpeed(this.value);
    if (this.field === "verticalSpeed") geofs.autopilot.setVerticalSpeed(this.value);
  }
}
var apButton = document.getElementById("apButton")

class toggleButton {
    constructor(field, buttonId, initial){
        this.button = document.getElementById(buttonId)
        this.button.addEventListener("click", this.handleClick.bind(this));
        this.state = initial;
        this.field = field;

    }

handleClick(e){
    if(this.state === 0){
        this.state = 1;
        this.engaged = true;
    }
    else{
        this.state = 0;
        this.engaged = false;
    }
    autopilot.engaged = this.engaged;
    this.button.classList.toggle("active", this.engaged);
    if(this.field === "autopilot" && this.engaged === false) geofs.autopilot.turnOff();
    if(this.field === "autopilot" && this.engaged === true) geofs.autopilot.turnOn();
    if(this.field === "hdg" && this.engaged === true ) geofs.autopilot.setMode("HDG");
    if(this.field === "hdg" && this.engaged === false || this.field ==="nav" && this.engaged === true){
      geofs.autopilot.setMode("NAV")
    }
}
}

const headingKnob = new Knob("heading","headingKnob", "headingDisplay", 0, 359, 1, 180);
const altitudeKnob = new Knob("altitude", "altitudeKnob", "altitudeDisplay", 0, 40000, 100, 10000);
const speedKnob = new Knob("speed", "speedKnob", "speedDisplay", 100, 500,5, 150);
const verticalSpeedKnob = new Knob("verticalSpeed", "verticalSpeedKnob", "verticalSpeedDisplay", -6000, 6000, 50, 0);
const autopilotState = new toggleButton("autopilot", "apButton", 0); 
const hdg = new toggleButton("HDG", "hdgButton", 1);
const nav = new toggleButton("NAV", "navButton", 0)
const autopilot = {
  heading: 180,
  altitude: 10000,
  verticalSpeed: 0,
  speed: 250,
  engaged: false,
  hdg:1,  
  nav:0
};
function syncGeoFs(){
    headingKnob.display.textContent = geofs.autopilot.course;
    altitudeKnob.display.textContent = geofs.autopilot.altitude;
    speedKnob.display.textContent = geofs.autopilot.speed;
    verticalSpeedKnob.display.textContent = geofs.autopilot.verticalSpeed;

}
function updateDisplays() {
  document.getElementById("headingDisplay").textContent = autopilot.heading;
  document.getElementById("altitudeDisplay").textContent = autopilot.altitude;
  document.getElementById("speedDisplay").textContent = autopilot.speed;
  document.getElementById("verticalSpeedDisplay").textContent = autopilot.verticalSpeed;
}

setInterval(syncGeoFs, 1);

function updateFMA() {
    let speedMode = "";
    let lateralMode = "";
    let verticalMode = "";

    if (geofs.autopilot.on) {
        speedMode = "SPD";

        if (geofs.autopilot.mode === "NAV") {
            lateralMode = "LNAV";
            verticalMode = geofs.autopilot.VNAV ? "V/S" : "ALT";
        } else {
            lateralMode = "HDG SEL";
            verticalMode = "ALT";
        }
    }

    document.getElementById("speedMode").textContent = speedMode;
    document.getElementById("lateralMode").textContent = lateralMode;
    document.getElementById("verticalMode").textContent = verticalMode;
}

setInterval(updateFMA, 1);

