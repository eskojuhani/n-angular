import { Component, Input, ElementRef, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})

export class CanvasComponent implements OnInit, AfterViewInit {
  // a reference to the canvas element from our template
  //@ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  @Input() public game;
  @Input() public home;
  @Input() public away;
  @Input() public gameDate;
  private width = 800;
  private height = 600;

  private cx: CanvasRenderingContext2D | null;
  private rect;
  private canvasInitialized = false;

  private homeGames: any = [];
  private awayGames: any = [];
  private homeLocations: any = [];
  private awayLocations: any = [];
  private homeDayStats: any = [];
  private awayDayStats: any = [];

  clickedGameInfo = "n/a";
  @Input() separatedHA: Number;

  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit() { 
    this.init(); 
    this.initImage(); 
  }
/*
  sun = new Image();
  moon = new Image();
  earth = new Image();
*/
  init() {
    /*
    this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    //window.requestAnimationFrame(()=>{this.draw()});
    */
  }
  private CanvasXSize = 800;
  private CanvasYSize = 600;
  private speed = 30; // lower is faster
  private scale = 1.05;
  private y = -4.5; // vertical offset

  // Main program

  private dx = 0.75;
  private imgW;
  private imgH;
  private x = 0;
  private clearX;
  private clearY;
  private img = new Image();

  initImage() {
   /*this.img.src = 'https://mdn.mozillademos.org/files/4553/Capitan_Meadows,_Yosemite_National_Park.jpg';
    this.img.onload = () => {
      //console.log("initImage img.onload called");
      this.imgW = this.img.width * this.scale;
      this.imgH = this.img.height * this.scale;

      if (this.imgW > this.CanvasXSize) {
        // image larger than canvas
        this.x = this.CanvasXSize - this.imgW;
      }
      if (this.imgW > this.CanvasXSize) {
        // image width larger than canvas
        this.clearX = this.imgW;
      } else {
        this.clearX = this.CanvasXSize;
      }
      if (this.imgH > this.CanvasYSize) {
        // image height larger than canvas
        this.clearY = this.imgH;
      } else {
        this.clearY = this.CanvasYSize;
      }

      // get canvas context
      //this.ctx = document.getElementById('canvas').getContext('2d');

      // set refresh rate
      //return setInterval(this.drawImage, this.speed);
      //window.requestAnimationFrame(()=>{this.drawImage()});
    }
    */
  }
  onSeparatedHA() {
    if (this.game) {
      this.drawHeader(this.game);
    }
    if (this.home) {
      this.homeGames = [];
      this.drawGraphs(this.home, '#ff0000', 1);
    }
    if (this.away) {
      this.awayGames = [];
      this.drawGraphs(this.away, '#0000ff', 0);
    }
  }
  onResize(event) {
    console.log("onResize:", event.target.innerWidth);
    this.initCanvas(event.target.innerWidth * 0.9, event.target.innerHeight * 0.7);

    if (this.game) {
      this.drawHeader(this.game);
    }
    if (this.home) {
      this.homeGames = [];
      this.drawGraphs(this.home, '#ff0000', 1);
    }
    if (this.away) {
      this.awayGames = [];
      this.drawGraphs(this.away, '#0000ff', 0);
    }
    //this.draw();

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges called..", this.gameDate);
    //this.draw();
    const dateChange: SimpleChange = changes.gameDate;
    if (dateChange) {
      this.gameDate = dateChange.currentValue;
      this.game = null;
      this.home = null;
      this.away = null;
    }
    const gameChange: SimpleChange = changes.game;
    if (gameChange) {
      this.game = gameChange.currentValue;
      this.home = null;
      this.away = null;
      window.dispatchEvent(new Event('resize'));
    }

    const homeChange: SimpleChange = changes.home;
    if (homeChange) {
      this.homeGames = [];
      this.homeLocations = [];
      this.homeDayStats = [];
      this.home = homeChange.currentValue;
      if (!this.canvasInitialized) {
        window.dispatchEvent(new Event('resize'));
      }
      else {
        this.drawGraphs(this.home, '#ff0000', 1);
      }
    }
    const awayChange: SimpleChange = changes.away;
    if (awayChange) {
      this.awayGames = [];
      this.awayLocations = [];
      this.awayDayStats = [];
      this.away = awayChange.currentValue;
      if (!this.canvasInitialized) {
        window.dispatchEvent(new Event('resize'));
      }
      else {
        this.drawGraphs(this.away, '#0000ff', 0);
      }
    }
    //this.ngAfterViewInit();

    //window.dispatchEvent(new Event('resize'));
  }

  public ngAfterViewInit() {
    //this.initCanvas(this.width, this.height);
    //window.dispatchEvent(new Event('resize'));
  }

  public initCanvas(width, height) {
    if (!this.canvas) {
      console.log("no canvas to init..");
      return;
    }
    this.canvasInitialized = true;
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    /*canvasEl.onmouseclick = (event: MouseEvent) => {
      console.log(this.homeLocations);
      console.log(this.awayLocations);
    };*/

    canvasEl.onmousemove = (event: MouseEvent) => {
      var rect = canvasEl.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      //console.log("x: " + x + " y: " + y, rect);
      //console.log(this.home);
      this.clickedGameInfo = "-";
      if (!this.matchAtPoint(x, y, this.homeGames, this.home)) {
        if (!this.matchAtPoint(x, y, this.awayGames, this.away)) {
          if (!this.matchAtLocation(x, y, this.homeLocations, this.home, this.homeDayStats)) {
            this.matchAtLocation(x, y, this.awayLocations, this.away, this.awayDayStats);
          }
        }
      }
    }

    this.cx = canvasEl.getContext('2d');
    if (!this.cx) { return; }

    canvasEl.width = width;
    canvasEl.height = height;

    const rect = canvasEl.getBoundingClientRect();
    this.rect = rect;

    this.cx.lineWidth = 1;
    this.cx.lineCap = 'butt';
    this.cx.strokeStyle = '#000';
  }

  matchAtPoint(x, y, positions, games) {
    for (var i = 0; i < positions.length; i++) {
      let dist = this.distance(x, y, positions[i])
      if (dist < 10) {
        //console.log(games[i]);
        this.clickedGameInfo = games[i].gameDate + " " + games[i].team + " vs " + games[i].oppo + " " + games[i].finalScore + (games[i].overtime ? " OT" : "") + " (" + games[i].teamCumulativePoints + " vs " + games[i].oppoCumulativePoints + ") " + games[i].performance + " 3: " + games[i].gameMovingAvg3 + " 10: " + games[i].gameMovingAvg10;
        return true;
      }
    }
    return false;
  }
  matchAtLocation(x, y, positions, games, stats) {
    for (var i = 0; i < positions.length; i++) {
      let dist = this.distance(x, y, positions[i])
      if (dist < 10) {
        //console.log(games[i]);
        var stat = stats.map(function(item) {
          return item['key'] + ":" + item['count'] + "  ";
        }).join(" ");
        this.clickedGameInfo = games[0].team + ": " + stat;
        return true;
      }
    }
    return false;
  }

  distance(x, y, pt) {
    var a = x - pt.x;
    var b = y - pt.y;

    return Math.sqrt(a * a + b * b);
  }

  drawHeader(game) {
    //console.log("drawHeader called..");
    if (this.cx) {
      this.cx.clearRect(0, 0, this.rect.width, this.rect.height);

      // Create gradient
      var grd = this.cx.createLinearGradient(0, 0, this.rect.width, 0);
      grd.addColorStop(0, "#007700");
      grd.addColorStop(1, "#ffffff");

      // Fill with gradient
      //this.cx.fillStyle = grd;
      //this.cx.fillRect(0, this.rect.height/2, this.rect.width, this.rect.height);

      this.cx.beginPath();
      this.cx.strokeStyle = '#767676';
      this.cx.moveTo(0, this.rect.height / 2);
      this.cx.lineTo(this.rect.width, this.rect.height / 2);
      this.cx.stroke();

      this.cx.beginPath();
      this.cx.strokeStyle = '#ff7676';
      this.cx.moveTo(0, this.rect.height / 10 * 3);
      this.cx.lineTo(this.rect.width, this.rect.height / 10 * 3);
      this.cx.stroke();

      this.cx.beginPath();
      this.cx.strokeStyle = '#7676ff';
      this.cx.moveTo(0, this.rect.height / 10 * 7);
      this.cx.lineTo(this.rect.width, this.rect.height / 10 * 7);
      this.cx.stroke();

      this.cx.font = '30px serif';
      this.cx.fillStyle = '#ff0000';
      this.cx.fillText(game.homeTeamName, 10, 40);
      var textLen = this.cx.measureText(game.homeTeamName);
      this.cx.fillStyle = '#0000ff';
      this.cx.fillText(game.awayTeamName, textLen.width + 20, 40);
      this.cx.stroke();
      this.cx.font = '10px serif';
      this.cx.fillStyle = '#323232';
      this.cx.fillText("dotted: Avg  3d", 10, 56);
      this.cx.fillText("solid:  Avg 10d", 10, 70);
      this.cx.stroke();
    }
  }

  drawGraphs(inData, color, isHome) {
    if (!(inData && inData.length)) {
      console.log("drawGraphs NO data");
      return;
    }

    let data = inData.filter((element) => { return this.separatedHA ? element.location == (isHome == 1 ? "H" : "A") : true});
    let min_row_num = data[data.length - 1].row_num - 1;
    let row_fix = inData.length - data.length;
    
    if (this.cx && this.rect && data) {
      var height = this.rect.height / 2;
      var width = this.rect.width;
      var v_len = height / 100;
      var h_len = this.rect.width / (data.length + 1);

      this.drawCumulativePoints(data, "teamCumulativePoints", color, isHome, row_fix, min_row_num);

      this.drawMovingAvg(data, "gameMovingAvg3", color, true, isHome, row_fix, min_row_num);
      this.drawMovingAvg(data, "gameMovingAvg10", color, false, isHome, row_fix, min_row_num);

      this.drawLocations(data, isHome, row_fix, min_row_num);

      var countDays = this.daysBetween(data[data.length - 1].gameDate, this.game.gameDate);
      h_len = this.rect.width / (countDays + 2);

      this.cx.lineWidth = 1;
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        if (i > 0) {
          let cd = this.daysBetween(item.gameDate, data[i - 1].gameDate);
          countDays += cd;
        }
        else {
          countDays = this.daysBetween(data[0].gameDate, this.game.gameDate);;
        }
        var centerX = width - h_len * (countDays);
        var centerY = height - (item.performance * v_len * (isHome ? 0.8 : -0.8));

        if (item.overtime === 1) {
          this.cx.beginPath();
          this.cx.strokeStyle = color;
          this.cx.fillStyle = color;
          this.cx.fillRect(centerX - 7, centerY - 7, 14, 14);
          this.cx.fill();
          this.cx.stroke();
        }
        this.cx.beginPath();
        this.cx.strokeStyle = color;
        this.cx.fillStyle = color;
        this.cx.ellipse(centerX, centerY, 5, 5, 0, 0, Math.PI * 2, false);
        this.cx.fill();
        this.cx.stroke();
        if (item.outcome === "L") {
          this.cx.beginPath();
          this.cx.strokeStyle = '#fff';
          this.cx.fillStyle = '#fff';
          this.cx.fillRect(centerX - 3, centerY - 3, 6, 6);
          this.cx.fill();
          this.cx.stroke();
        }
        if (isHome) {
          this.homeGames.push({ x: centerX, y: centerY });
        }
        else {
          this.awayGames.push({ x: centerX, y: centerY });
        }
      }
    }
  }

  drawMovingAvg(data, column, color, isDash, isHome, row_fix, min_row_num) {
    var height = this.rect.height / 2;
    var width = this.rect.width;
    var v_len = height / 100;
    var h_len = this.rect.width / (data.length + 2);

    if (!this.cx)
      return;

    this.cx.save();
    if (isDash)
      this.cx.setLineDash([1, 2]);
    else
      this.cx.setLineDash([]);

    var maxValue = 0;
    var minValue = 9999;
    var i = 0;
    for (i = 0; i < data.length; i++) {
      if (data[i][column] > maxValue)
        maxValue = data[i][column];
      if (data[i][column] < minValue)
        minValue = data[i][column];
    }

    var countDays = this.daysBetween(data[data.length - 1].gameDate, this.game.gameDate);

    h_len = this.rect.width / (countDays);
    var currentX = h_len;
    for (i = 1; i < data.length; i++) {
      var start = data[i - 1];
      var end = data[i];
      if (i > 1) {
        countDays = this.daysBetween(start.gameDate, end.gameDate);
      }
      else {
        countDays = this.daysBetween(data[0].gameDate, this.game.gameDate);;
      }
      this.cx.beginPath();
      this.cx.strokeStyle = color;

      if (start.location === 'H')
        this.cx.lineWidth = 2;
      else
        this.cx.lineWidth = 1;

      //this.cx.moveTo(width - h_len * countDays, height - (start[column] * v_len));
      //this.cx.lineTo(width - h_len * countDays, height - (end[column] * v_len));
      //console.log("drawMovingAvg:", height - (start[column] * v_len * (isHome ? 0.8 : -0.8)))
      this.cx.moveTo(width - currentX, height - (start[column] * v_len * (isHome ? 0.8 : -0.8)));
      this.cx.lineTo(width - (currentX + h_len * countDays), height - (end[column] * v_len * (isHome ? 0.8 : -0.8)));
      currentX += h_len * countDays;

      this.cx.stroke();
    }
    this.cx.restore();
  }

  drawCumulativePoints(data, column, color, isDash, row_fix, min_row_num) {
    var height = this.rect.height;
    var width = this.rect.width;
    var lineY = height / 2;
    var v_len = height / 100;
    var h_len = this.rect.width / (data.length + 1);
    
    if (!this.cx)
      return;
      
    this.cx.save();
    /*if (isDash)
      this.cx.setLineDash([1,3]);
    else*/
    this.cx.setLineDash([]);

    var maxValue = 800;
    var minValue = 9999;
    var i = 0;
    /*for (i = 0; i < data.length; i++) {
      if (data[i][column] > maxValue)
        maxValue = data[i][column];
      if (data[i][column] < minValue)
        minValue = data[i][column];
    }*/
    var countDays = this.daysBetween(data[data.length - 1].gameDate, this.game.gameDate);
    
    h_len = this.rect.width / (countDays + 2);
    v_len = (lineY * 0.8) / maxValue;
    
    for (i = 0; i < data.length; i++) {
      var pos = data[i];
      if (i > 0) {
        let cd = this.daysBetween(data[i].gameDate, data[i - 1].gameDate);
        countDays += cd;
      }
      else {
        countDays = this.daysBetween(data[0].gameDate, this.game.gameDate);
      }
      this.cx.beginPath();
      this.cx.strokeStyle = color;

      if (pos.location === 'H')
        this.cx.lineWidth = 2;
      else
        this.cx.lineWidth = 1;

      this.cx.moveTo(width - h_len * countDays, lineY);
      if (isDash)
        this.cx.lineTo(width - h_len * countDays, lineY - (pos[column] * v_len));
      else
        this.cx.lineTo(width - h_len * countDays, lineY + (pos[column] * v_len));

      this.cx.stroke();
    }
    this.cx.restore();
  }

  daysBetween(date1, date2) {
    var from = new Date(date1);
    var to = new Date(date2);
    var timeDiff = Math.abs(from.getTime() - to.getTime());

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  drawLocations(data, isHome, row_fix, min_row_num) {
    if (!(data && data.length)) {
      return;
    }
    if (!this.cx)
      return;
      
    var width = this.rect.width;
    var y = this.rect.height - ((isHome === 1) ? 20 : 10);
    var h_len = this.rect.width / (data.length + 1);

    this.cx.save();
    this.cx.font = '10px serif';
    if (isHome) {
      this.cx.fillStyle = '#ff0000';
      this.cx.fillText("H", 2, y + 4);
    }
    else {
      this.cx.fillStyle = '#0000ff';
      this.cx.fillText("A", 2, y + 4);
    }
    this.cx.setLineDash([]);
    this.cx.lineWidth = 3;

    var i = 0;
    for (i = 0; i < data.length; i++) {
      var item = data[i];
      var daysBefore = 0;
      if (i < data.length - 1) {
        var prev = data[i + 1];
        daysBefore = this.daysBetween(item.gameDate, prev.gameDate);
      }
      this.cx.beginPath();

      if (item.location === 'H')
        this.cx.strokeStyle = '#ff1111';
      else
        this.cx.strokeStyle = '#1111ff'

      var centerX = width - 2 - (h_len * i + h_len / 2);
      this.cx.moveTo(width - 2 - h_len * i - h_len * 0.2, y);
      this.cx.lineTo(width - 2 - h_len * i - h_len, y);
      if (isHome) {
        this.homeLocations.push({ x: centerX, y: y });
      }
      else {
        this.awayLocations.push({ x: centerX, y: y });
      }
      var lineLen = h_len / 4;
      this.cx.stroke();
      if (item.outcome === "W") {
        this.cx.save();
        this.cx.beginPath();
        this.cx.strokeStyle = '#000';
        this.cx.fillStyle = '#000';
        this.cx.fillRect(centerX + h_len * 0.2, y - 3, 6, 6);
        this.cx.fill();
        this.cx.stroke();
        this.cx.restore();
      }
      if (daysBefore > 1) {
        var lineCaps = (daysBefore > 3 ? 3 : daysBefore - 1);
        var lineCap = (h_len - (h_len / 3)) / 4;
        this.cx.beginPath();
        this.cx.strokeStyle = '#000';
        this.cx.fillStyle = '#000';

        for (var k = 0; k < lineCaps; k++) {
          this.cx.fillRect(centerX - (h_len * 0.4) + (lineCap * k), y - 4, 2, 8);
          this.cx.fill();
        }
        this.cx.stroke();
      }
      if (daysBefore > 0) {
        var outcome = item.outcome;
        if (item.overtime == 1) {
          outcome = "D";
        }
        var key = item.location + (daysBefore > 2 ? 3 : daysBefore - 1) + outcome;
        var obj = { key: key, count: 1 };
        if (isHome && !this.isKeyInObject(this.homeDayStats, key)) {
          this.homeDayStats.push(obj);
        }
        else if (!isHome && !this.isKeyInObject(this.awayDayStats, key)) {
          this.awayDayStats.push(obj);
        }
      }
    }
    if (isHome) {
      this.homeDayStats.sort(this.compare);
    }
    else {
      this.awayDayStats.sort(this.compare);
    }
    this.cx.restore();
  }

  isKeyInObject(objects, key) {
    let found = objects.find(item => item.key === key);
    if (found) {
      found.count += 1;
    }
    return found;
  }
  compare(a, b) {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  }
  /*
  draw() {
    console.log("draw called");
    var ctx;

    if (this.canvas) {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      ctx = canvasEl.getContext('2d');
    }
    else {
      return;
      //ctx = document.getElementById('canvas').getContext('2d');
    }

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, this.rect.width / 4, this.rect.height / 2); // clear canvas

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.save();
    ctx.translate(150, 150);

    // Earth
    var time = new Date();
    ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 40, 24); // Shadow
    ctx.drawImage(this.earth, -12, -12);

    // Moon
    ctx.save();
    ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
    ctx.translate(0, 28.5);
    ctx.drawImage(this.moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(this.sun, 0, 0, 300, 300);

    window.requestAnimationFrame(() => { this.draw() });
  }

  drawImage = () => {
    var canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    var ctx = canvasEl.getContext('2d');

    ctx.clearRect(0, 0, this.clearX, this.clearY); // clear the canvas

    // if image is <= Canvas Size
    if (this.imgW <= this.CanvasXSize) {
      // reset, start from beginning
      if (this.x > this.CanvasXSize) {
        this.x = -this.imgW + this.x;
      }
      // draw additional image1
      if (this.x > 0) {
        ctx.drawImage(this.img, -this.imgW + this.x, this.y, this.imgW, this.imgH);
      }
      // draw additional image2
      if (this.x - this.imgW > 0) {
        ctx.drawImage(this.img, -this.imgW * 2 + this.x, this.y, this.imgW, this.imgH);
      }
    }

    // image is > Canvas Size
    else {
      // reset, start from beginning
      if (this.x > (this.CanvasXSize)) {
        this.x = this.CanvasXSize - this.imgW;
      }
      // draw additional image
      if (this.x > (this.CanvasXSize - this.imgW)) {
        ctx.drawImage(this.img, this.x - this.imgW + 1, this.y, this.imgW, this.imgH);
      }
    }
    // draw image
    ctx.drawImage(this.img, this.x, this.y, this.imgW, this.imgH);
    // amount to move
    this.x += this.dx;
  }
  */
}
