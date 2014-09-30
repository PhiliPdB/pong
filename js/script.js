// Pong
// By: Philip de Bruin
// Last edit: 09/30/2014

// Variables
var width = window.innerWidth,
    height = window.innerHeight,
    score1 = 0,
    score2 = 0,
    bars = [], // Player bars
    balls = [], // Bal
    running = false,
    interval,
    firstGame = true,
    // keyboard buttons
    wPress = false,
    sPress = false,
    UPPress = false,
    DOWNPress = false;

// Setup board
var canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;

window.onload = function() {
    setupElements();
    document.addEventListener("click",function() {
        if (!running) setup();
        if (firstGame) {
            for (var i = 0; i < 2; i++) document.getElementsByTagName("p")[i].style.opacity = 0;
            firstGame = false;
        }
    });
    document.addEventListener("keydown",function(event) {
        if (event.keyCode == 38) UPPress = true;
        if (event.keyCode == 40) DOWNPress = true;
        if (event.keyCode == 83) sPress = true;
        if (event.keyCode == 87) wPress = true;
    });
    document.addEventListener("keyup",function(event) {
        if (event.keyCode == 38) UPPress = false;
        if (event.keyCode == 40) DOWNPress = false;
        if (event.keyCode == 83) sPress = false;
        if (event.keyCode == 87) wPress = false;
    });

    ctx.fillStyle = "white";
    ctx.font = "bold 100px Roboto";
    ctx.fillText("Pong", width * 0.5 - 121.5, height * 0.5 - 66.5);

    ctx.fillStyle = "white";
    ctx.font = "50px Roboto";
    ctx.fillText("Click to play", width * 0.5 - 144, height * 0.5 + 6);
};

window.onresize = function() {
    width = window.innerWidth;
    height = window.outerHeight;
    canvas.width = width;
    canvas.height = height;
};

// Setup elements
function setupElements() {
    // Player bars
    // Player 1
    bars.push({
        // Position
        x: 10,
        y: height * 0.5 - 100,
        // Width and Height
        w: 8,
        h: 100,
        // Color
        color: "#ffffff"
    });
    // Player 2
    bars.push({
        // Position
        x: width - 20,
        y: height * 0.5 - 100,
        // Width and Height
        w: 8,
        h: 100,
        // Color
        color: "#ffffff"
    });
    // Ball
    balls.push({
        // Position
        x: width * 0.5,
        y: height * 0.5,
        // And velocity
        vx: 0,
        vy: 0,
        // Radius
        radius: 8,
        // And the color
        color: "#99cc00"
    });
};

// Setup Game
function setup() {
    var numbers = [-400,400],
        ball = balls[0];

    ball.vx = numbers[Math.floor(Math.random()*2)];
    ball.vy = numbers[Math.floor(Math.random()*2)];

    running = true;

    interval = setInterval(loop, 1000 / 60);
};

function loop() {
    // Update ball and bars
    update();
    // Update game board
    draw();
};

// Draw board
function draw() {
    ctx.clearRect(0,0,width,height);

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(width * 0.5,0);
    ctx.lineTo(width * 0.5,height);
    ctx.stroke();
      
    ctx.fillStyle = "white";
    ctx.font = "bold 25px Roboto";
    ctx.fillText(score1, width * 0.5 - 45, 40);

    ctx.fillStyle = "white";
    ctx.font = "bold 25px Roboto";
    ctx.fillText(score2, width * 0.5 + 35, 40);

    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.radius,0,2 * Math.PI);
        ctx.fillStyle = ball.color;
        ctx.fill();
    }

    for (var i = 0; i < bars.length; i++) {
        var bar = bars[i];
        ctx.fillStyle = bar.color;
        ctx.fillRect(bar.x,bar.y,bar.w,bar.h);
    }
};

// Update balls and bars
function update() {
    // Balls
    var ball = balls[0];

    ball.x += ball.vx / 60;
    ball.y += ball.vy / 60;

    if ((ball.x - ball.radius) <= 0) {
        ball.vx = 0;
        ball.vy = 0;
        
        gameOver(2);
    }
    if ((ball.x + ball.radius) >= width) {
        ball.vx = 0;
        ball.vy = 0;

        gameOver(1);
    }

    if ((ball.y - ball.radius ) <= 0) {
        ball.y = ball.radius;
        ball.vy = -ball.vy;
    }
    if ((ball.y + ball.radius ) >= height) {
        ball.y = height - ball.radius;
        ball.vy = -ball.vy;
    }

    // Bars
    for (var i = 0; i < bars.length; i++) {
        var bar = bars[i];

        if ((ball.x - ball.radius ) < (bar.w + 10) && (ball.y - ball.radius) < (bar.h + bar.y) && (ball.y + ball.radius) > bar.y) {
            ball.x = 10 + bar.w + ball.radius;
            ball.vx = -ball.vx;
                
            ball.vx *= 1.05;
            ball.vy *= 1.05;
        }
        if ((ball.x + ball.radius) > (width - bar.w - 10) && (ball.y - ball.radius) < (bar.h + bar.y) && (ball.y + ball.radius) > bar.y) {
            ball.x = width - 10 - bar.w - ball.radius;
            ball.vx = -ball.vx;
                
            ball.vx *= 1.05;
            ball.vy *= 1.05;
        }

        // Bar out of screen
        if (bar.y <= 0){
            bar.y = 0;
        }
        if (bar.y + bar.h >= height){
            bar.y = height - bar.h;
        }
    }

    var bar1 = bars[0],
        bar2 = bars[1];

    if (wPress) bar1.y -= 10;
    if (sPress) bar1.y += 10;
    if (UPPress) bar2.y -= 10;
    if (DOWNPress) bar2.y += 10;
};

function gameOver(player) { // Player = Player who wins
    var ball = balls[0];

    running = false;
    clearInterval(interval);

    // Reset ball position
    ball.x = width * 0.5;
    ball.y = height * 0.5;
    // And velocity
    ball.vx = 0;
    ball.vy = 0;

    setTimeout(function() {
        ctx.clearRect(0,0,width,height);
        if (player == 1) {
            score1 += 1;
            ctx.fillStyle = "white";
            ctx.font = "bold 100px Roboto";
            ctx.fillText("Player 1 wins", width * 0.5 - 247.5, height * 0.5 - 66.5);
        } else if (player == 2) {
            score2 += 1;
            ctx.fillStyle = "white";
            ctx.font = "bold 100px Roboto";
            ctx.fillText("Player 2 wins", width * 0.5 - 247.5, height * 0.5 - 66.5);
        }

        ctx.fillStyle = "white";
        ctx.font = "50px Roboto";
        ctx.fillText("Click to play again", width * 0.5 - 214.5, height * 0.5 + 6);
    },50);
};
