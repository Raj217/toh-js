class Disk {
    static height = 20;
    static initWidth = 50;
    static widthDiff = 20;
    constructor({
        index,
        maxDisk,
        currentBarIndex,
    }) {
        this.index=index;
        this.width;
        this.height = Disk.height;
        this.maxDisk = maxDisk;
        this.currentBarIndex = currentBarIndex;
        this.currentPositionInBar;
        this.element;
    }

    makeDisc(usedColors) {
        this.width = Disk.initWidth + this.index * Disk.widthDiff;
        const left = -this.width / 2;
        const top = barHeight - (this.maxDisk-this.index-1)* 20;
        this.currentBarIndex = 0;
        this.currentPositionInBar = this.index;


        var newDisc = document.createElement("div");
        newDisc.classList.add("disc");
        newDisc.style.top = `${top}px`;
        newDisc.style.left = `${left}px`;

        let colorIndex = Math.floor(Math.random()*colors.length);
        while (usedColors.includes(colorIndex)) {
            colorIndex = Math.floor(Math.random() * colors.length);
        }

        newDisc.style.height = `${this.height}px`;
        newDisc.style.width = `${this.width}px`;
        newDisc.style.backgroundColor = colors[colorIndex];
        
        this.element = newDisc;
        return colorIndex;
    }
    moveTo({currentBarIndex, newBarIndex}) {
        let discBelowInNewBarIndex = -1;
        let top = 0;
        let left = 0;
        let nDiscsInCurrentBar = 0;
        discs.forEach((disc)=> {
            if (
              disc.currentBarIndex === newBarIndex &&
              disc.currentPositionInBar === 0
            ) {
              discBelowInNewBarIndex = disc.index;
            }
            if (disc.currentBarIndex === currentBarIndex) {
                nDiscsInCurrentBar ++;
            }
        })
        if (
          discBelowInNewBarIndex === -1 ||
          discs[discBelowInNewBarIndex].width > this.width
        ) {
          top = 0;
          discs.forEach((disc) => {
            if (
              disc.index != this.index &&
              disc.currentBarIndex === currentBarIndex
            ) {
              disc.currentPositionInBar--;
            }
          });

          this.currentBarIndex = newBarIndex;
          this.currentPositionInBar = 0;

          if (discBelowInNewBarIndex === -1) {
            top = barHeight;
          } else {
            discs.forEach((disc) => {
              if (
                disc.index != this.index &&
                disc.currentBarIndex === newBarIndex
              ) {
                disc.currentPositionInBar++;
              }
            });
            top = `${
              parseInt(discs[discBelowInNewBarIndex].element.style.top) -
              this.height
            }px`;
          }
          left = 140 * newBarIndex - this.width / 2;
        } else {
          left = 140 * currentBarIndex - this.width / 2;
          top = barHeight - (nDiscsInCurrentBar - this.currentPositionInBar-1) * 20;
        }
        gsap.to(this.element, {
          left: left,
          top: top,
        });
        
    }
}