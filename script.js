const ctx = document.getElementById("background").getContext("2d");
const background = new Image();
background.src = "background.png";
background.onload = function () {
    ctx.drawImage(background, 0, 0, 500, 500);
};
const player = new Image();
player.src = "Player1.png";
player.onload = function () {
    ctx.drawImage(player, 0, 0, 80, 80);
};

let x = 0, y = 0;
let acuallX = 0, acuallY = 0;
let spacebarPressed = false;

function update() {
    borderlimit()
    ctx.clearRect(0, 0, 500, 500);
    ctx.drawImage(background, 0, 0, 500, 500);
    acuallX = x * 105;
    acuallY = y * 105;
    ctx.drawImage(player, acuallX, acuallY, 80, 80);
}

document.addEventListener("keyup", function (event) {
    console.log(event.key)
    if (event.key == "w") {
        if (spacebarPressed) {
            y -= 999;
        } else {
            y -= 1;
        }
        update();
    } else if (event.key == "s") {
        if (spacebarPressed) {
            y += 999;
        } else {
        y += 1;
        }
        update();
    } else if (event.key == "d") {
        if (spacebarPressed) {
            x += 999;
        } else {
        x += 1;
        }
        update();
    } else if (event.key == "a") {
        if (spacebarPressed) {
            x -= 999;
        } else {
        x -= 1;
        }
        update();
    }
});

function borderlimit() {
    if (x > 4) {
        x = 4
    } else if (x < 0) {
        x = 0
    } else if (y < 0) {
        y = 0
    } else if (y > 4) {
        y = 4
    }
};

document.addEventListener("keydown", function (event) {
    if (event.key == " ") {
        spacebarPressed = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key == " ") {
        spacebarPressed = false;
    }
});