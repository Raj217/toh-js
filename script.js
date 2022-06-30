// ----------------------------------------------------- State Variables -----------------------------------------------------
let currentSelectedDisk = 0;
let currentSelectedDiskBarIndex = 0;
let discCount = 5;
const maxDiskCount = 5;
const colors = [
  "#1B9CFC",
  "#F97F51",
  "#55E6C1",
  "#2C3A47",
  "#3B3B98",
];
let usedColor = [];
const barHeight = 153;

let discs = [];
const initialTower = document.getElementById("tower1").getElementsByClassName("head")[0];
const discCountInput = document.getElementById("disc-count");
const speedInput = document.getElementById("speed");
const solveButton = document.getElementById("solve");
let steps = [];
let didUserSolve = true;
let isMessageShown = false;

// ----------------------------------------------------- Functions -----------------------------------------------------
function onDrag({ movementX, movementY }) {
    if (!isSolved()) {
        const style = window.getComputedStyle(
          discs[currentSelectedDisk].element
        );
        const left = parseInt(style.left);
        const top = parseInt(style.top);
        if (-130 <= top && top <= 290 && -130 <= left && left <= 360) {
          discs[currentSelectedDisk].element.style.left = `${
            left + movementX
          }px`;
          discs[currentSelectedDisk].element.style.top = `${top + movementY}px`;
        }
    }
}

function onMouseLift() {
    if (!isSolved()) {
        const diskStyle = window.getComputedStyle(
          discs[currentSelectedDisk].element
        );
        const diskLeft = parseInt(diskStyle.left);

        let newBarIndex = 0;
        
        if (diskLeft <= 35) {
          newBarIndex = 0;
        } else if (diskLeft <= 180) {
          newBarIndex = 1;
        } else {
          newBarIndex = 2;
        }
        discs[currentSelectedDisk].moveTo({
          currentBarIndex: currentSelectedDiskBarIndex,
          newBarIndex,
        });
    }
}

function addDiscs() {
    discs.splice(0, discs.length);
    usedColor.splice(0, usedColor.length);
    var child = initialTower.lastElementChild;
    while (child) {
        initialTower.removeChild(child);
        child = initialTower.lastElementChild;
    }
    for (let i = 0; i < discCount; i++) {
      var newDisk = new Disk({
        index: i,
        maxDisk: discCount,
      });
      const colorIndex = newDisk.makeDisc(usedColor);
      discs.push(newDisk);
      usedColor.push(colorIndex);

      initialTower.appendChild(newDisk.element);
    };
}

function init() {
    addDiscs();
    discs.forEach((disc) => {
      disc.element.addEventListener("mousedown", () => {
        if (!isSolved()) {
          if (disc.currentPositionInBar === 0) {
            const style = window.getComputedStyle(disc.element);
            const left = parseInt(style.left);
            currentSelectedDiskBarIndex = left <= 35 ? 0 : left <= 180 ? 1 : 2;
            currentSelectedDisk = disc.index;
            disc.element.addEventListener("mousemove", onDrag);
          } else {
            currentSelectedDisk = -1;
          }
        }
      });
    });
    document.addEventListener("mouseup", () => {
      if (currentSelectedDisk != -1) {
        onMouseLift();
        discs[currentSelectedDisk].element.removeEventListener(
          "mousemove",
          onDrag
        );
        if (isSolved() && !isMessageShown && didUserSolve) {
          isMessageShown = true;
          alert("Congratulations! You solved the Tower of Hanoi.");
        }
      }
    });
}


discCountInput.oninput = function () {
  discCount = this.value;
  location.reload();
  init();
};

function isSolved() {
    for (let i=0; i<discs.length; i++) {
        if (discs[i].currentBarIndex != 2) {
            return false;
        }
    }
    return true;
}

let a = 0;
let c = 0;
var i = 0;
function solve() {
    setTimeout(function () {
    a = steps[i][0];
    c = steps[i][1];
    discs
        .find((disc) => {
        return (
            disc.currentBarIndex === a && disc.currentPositionInBar === 0
        );
        })
        .moveTo({ currentBarIndex: a, newBarIndex: c });
    i++;
    if (i < steps.length) {
        solve();
    }
    }, 10*(140-speedInput.value));
}

solveButton.onclick = () => {
    didUserSolve = false;
    discCount = discCountInput.value;
    addDiscs();
    TOH(discCount, 0, 1, 2 );
    solve();
}

// ----------------------------------------------------- Algorithm -----------------------------------------------------
function TOH(n, a, b, c) {
    if (n>0) {
        TOH(n-1, a, c, b);
        steps.push([a, c]);
        TOH(n-1, b, a, c);
    }
    return;
}


// ----------------------------------------------------- Flow Begins -----------------------------------------------------

discCount = discCountInput.value;
init();
