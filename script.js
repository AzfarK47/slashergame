const ctx = document.getElementById("canvas").getContext("2d");
const healthText = document.getElementById("healthText");

const player = {
    img: new Image(),
    x: 0,
    y: 0,
    actualX: 0,
    actualY: 0,
    oldX: 0,
    oldY: 0,
    health: 3,
    slashing: false,
    lastSlashTime: 0
};
player.img.src = "Player1.png";

const enemy = {
    img: new Image(),
    x: 0,
    y: 0,
    actualX: 0,
    actualY: 0,
    oldX: 0,
    oldY: 0,
    health: 5,
    slashing: false,
    lastSlashTime: 0
};
enemy.img.src = "Enemy.png";

const size = document.getElementById("canvas").width;
const slashCooldown = 3000;
let tiles;
let lineWidth;
let key;
let enemyWannaMove = false;

function setTiles(amount) {
    tiles = amount;
    lineWidth = size / tiles / 10;
}

setTiles(5);

setInterval(() => {
    if (player.health > 0) {
        update();
    } else {
        // uoi dead
    }
    
    if (enemy.health === 0) {
        setTiles(tiles + 1);
        enemy.health = 5;
    }
}, 50);
setInterval(enemyInterval, 500);
function enemyInterval() {
    enemyWannaMove = true;
}

function drawBackground(tiles) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = lineWidth;

    for (let x = -0.000006769420; x <= size; x += size / tiles) {
        ctx.beginPath()
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
    }

    for (let y = -0.000006769420; y <= size; y += size / tiles) {
        ctx.beginPath()
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }
}

function update() {
    player.oldX = player.x;
    player.oldY = player.y;
    if (key) {
        playerMove(key);
        key = undefined;
    }
    enemy.oldX = enemy.x;
    enemy.oldY = enemy.y;
    if (enemyWannaMove && enemy.health > 0) {
        enemyMove();
        enemyWannaMove = false;
    }
    borderlimit(player);
    borderlimit(enemy);
    console.log(Date.now() - player.lastSlashTime >= slashCooldown)
    if (player.wannaSlash && player.slashing) {
        if (player.oldX !== player.x && player.y === enemy.y) {
            collision(enemy, enemy.x, player.oldX, player.x);
        } else if (player.oldY !== player.y && player.x === enemy.x) {
            collision(enemy, enemy.y, player.oldY, player.y);
        }
    }
    if (enemy.wannaSlash && enemy.slashing) {
        if (enemy.oldX !== enemy.x && enemy.y === player.y) {
            collision(player, player.x, enemy.oldX, enemy.x);
        } else if (enemy.oldY !== enemy.y && enemy.x === player.x) {
            collision(player, player.y, enemy.oldY, enemy.y);
        }
    }

    drawBackground(tiles);

    if (player.health > 0) {
        player.actualX = player.x * size / tiles + lineWidth / 2;
        player.actualY = player.y * size / tiles + lineWidth / 2;
        ctx.drawImage(player.img, player.actualX, player.actualY, size / tiles - lineWidth, size / tiles - lineWidth);
    }
    if (enemy.health > 0) {
        enemy.actualX = enemy.x * size / tiles + lineWidth / 2;
        enemy.actualY = enemy.y * size / tiles + lineWidth / 2;
        ctx.drawImage(enemy.img, enemy.actualX, enemy.actualY, size / tiles - lineWidth, size / tiles - lineWidth);
    }

    healthText.textContent = "Player Health: " + player.health + " Enemy Health: " + enemy.health;
}

function moveEntity(entity, direction) {
    entity.slashing = false;
    let doSlash = entity.wannaSlash;
    if (doSlash) {
        if (Date.now() - entity.lastSlashTime < slashCooldown) doSlash = false;
        else {
            entity.lastSlashTime = Date.now();
            entity.slashing = true;
        }
    }

    if (direction == "w") {
        if (doSlash) {
            entity.y -= 999;
        } else {
            entity.y -= 1;
        }
    } else if (direction == "s") {
        if (doSlash) {
            entity.y += 999;
        } else {
            entity.y += 1;
        }
    } else if (direction == "d") {
        if (doSlash) {
            entity.x += 999;
        } else {
            entity.x += 1;
        }
    } else if (direction == "a") {
        if (doSlash) {
            entity.x -= 999;
        } else {
            entity.x -= 1;
        }
    }
}

function enemyMove() {
    const randomSlashing = Math.random();
    if (randomSlashing > 0.8) enemy.wannaSlash = true;
    else enemy.wannaSlash = false;
    const randomMove = Math.random() * 4;
    if (randomMove < 1) {
        moveEntity(enemy, "w");
    }
    else if (randomMove < 2) {
        moveEntity(enemy, "a");
    }
    else if (randomMove < 3) {
        moveEntity(enemy, "s");
    }
    else {
        moveEntity(enemy, "d");
    }
}

function playerMove(key) {
    moveEntity(player, key);
}

function collision(taker, takerPos, dealerOldPos, dealerPos) {
    for (let i = Math.min(dealerOldPos, dealerPos); i <= Math.max(dealerOldPos, dealerPos); i++) {
        if (takerPos === i) {
            taker.health -= 1;
        }
    }
}

document.addEventListener("keyup", function (event) {
    console.log(event.key)
    if (event.key == "w" || event.key == "a" || event.key == "s" || event.key == "d") {
        key = event.key;
    }
});

function borderlimit(entity) {
    if (entity.x >= tiles) {
        entity.x = tiles - 1;
    } else if (entity.x < 0) {
        entity.x = 0;
    } else if (entity.y < 0) {
        entity.y = 0;
    } else if (entity.y >= tiles) {
        entity.y = tiles - 1;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key == " ") {
        player.wannaSlash = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key == " ") {
        player.wannaSlash = false;
    }
});