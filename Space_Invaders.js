const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let playerBullet;

let aliens = [];
let alienBullets = [];
let cols = 11;
let rows = 5;
let direction = 1;
let leftMostCol = 0
let rightMostCol = 10;

let time = 0;
let wait = 0;
let timeUntilUFO = 1800;
let alienUpdate = 40;
let aliensKilled = 0;

let ufo;
let reloading = false;

let lives = 3;
let score = 0;

let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

document.addEventListener("keydown", function(key) {
    if (key.keyCode == 37) {
        leftPressed = true;
    } else if (key.keyCode == 39) {
        rightPressed = true;
    } else if (key.keyCode == 32) {
        spacePressed = true;
    }
});

document.addEventListener("keyup", function(key) {
    if (key.keyCode == 37) {
        leftPressed = false;
    } else if (key.keyCode == 39) {
        rightPressed = false;
    } else if (key.keyCode == 32) {
        spacePressed = false;
    }
});

let player = new Player(width/2-25, 500, 50, 53, "Space_Ship.png");

for (let i = 0; i < rows; i++) {
    aliens.push([]);
    for (let j = 0; j < cols; j++) {
        let x = j*45+140;
        let y = i*50+75;

        if (i == 0) {
            aliens[i].push(new Alien(x, y, "squid"));
        } else if (i == 1 || i == 2) {
            aliens[i].push(new Alien(x, y, "crab"));
        } else {
            aliens[i].push(new Alien(x, y, "octopus"))
        }
    }
}

function reset() {
    alienBullets = [];
    player.x = width/2-25;

    wait = 50;
}

function draw() {
    graphics.clearRect(0, 0, width, height);

    if (leftPressed && player.x > 0) {
        player.x -= 5;
    } else if (rightPressed && player.x < width-player.w) {
        player.x += 5;
    }

    if (spacePressed && playerBullet == null) {
        spacePressed = false;
        playerBullet = new Bullet(player.x+player.w/2-2.5, player.y, "player");
    }

    if ((aliens[0][leftMostCol].constrain() || aliens[0][rightMostCol].constrain()) && time%alienUpdate == 0) {
        direction *= -1;

        if (alienUpdate > 0) {
            alienUpdate--;
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                aliens[i][j].moveDown();
            }
        }
    }

    time++;

    if (timeUntilUFO > 0 && ufo == null) {
        timeUntilUFO--;
    }

    if (playerBullet != null) {
        playerBullet.draw();
        playerBullet.update();
    }

    player.draw();

    for (let i = 0; i < alienBullets.length; i++) {
        alienBullets[i].draw();

        if (alienBullets[i].hits(player)) {
            reset();

            lives--;

            break;
        }

        alienBullets[i].update();
    }

    let amountDeadLeft = 0;
    let amountDeadRight = 0;

    for (let i = 0; i < rows; i++) {
        if (!aliens[i][leftMostCol].alive) {
            amountDeadLeft++;
        }

        if (!aliens[i][rightMostCol].alive) {
            amountDeadRight++;
        }

        for (let j = 0; j < cols; j++) {
            if (time%alienUpdate == 0) {
                aliens[i][j].update();
            }

            if (aliens[i][j].alive) {
                let amount = (55-aliensKilled)*100+10;
                if (random(1, amount) == 1) {
                    aliens[i][j].throwBullet();
                }

                aliens[i][j].draw();

                if ((aliens[i][j].hits(player) || aliens[i][j].y > height) && reloading == false) {
                    alert("Game Over");
                    location.reload();
                    reloading = true;
                }

                if (playerBullet != null && playerBullet.hits(aliens[i][j])) {
                    playerBullet = null;
                    console.log(amount);
                    aliens[i][j].alive = false;

                    if (aliens[i][j].type == "octopus") {
                        score += 10;
                    } else if (aliens[i][j].type == "crab") {
                        score += 20;
                    } else if (aliens[i][j].type == "squid") {
                        score += 40;
                    }

                    aliensKilled++;
                }
            }
        }
    }

    if (aliensKilled == rows*cols) {
        score += 1000;
        lives++;
        alienUpdate = 40;
        reset();

        leftMostCol = 0;
        rightMostCol = 10;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                aliens[i][j].x = j*45+140;
                aliens[i][j].alive = true;
            }
        }

        aliensKilled = 0;
    }

    if (lives <= 0 && !reloading) {
        alert("Game Over");
        location.reload();
        reloading = true;
    }

    if (amountDeadLeft == 5 && leftMostCol < 10) {
        leftMostCol++;
    }

    if (amountDeadRight == 5 && rightMostCol > 0) {
        rightMostCol--;
    }

    if (timeUntilUFO == 0) {
        ufo = new Alien(-80, 20, "ufo");
        ufo.w = 80;

        timeUntilUFO = 1800;
    }

    if (ufo != null) {
        ufo.draw();
        ufo.update();

        if (playerBullet != null && playerBullet.hits(ufo)) {
            let rand = random(1, 4);

            if (rand == 1) {
                score += 50;
            } else if (rand == 2) {
                score += 100;
            } else if (rand == 3) {
                score += 150;
            } else {
                score += 200;
            }

            playerBullet = null;
            ufo = null;
        }
    }

    graphics.fillStyle = "white";
    graphics.font = "30px sans-serif";
    graphics.fillText(`Score: ${score}`, 20, 40);
    graphics.fillText(`Lives: ${lives}`, 700, 40)
}

function update() {
    if (wait <= 0) {
        draw();
    } else {
        wait--;
    }

    requestAnimationFrame(update);
}

update();