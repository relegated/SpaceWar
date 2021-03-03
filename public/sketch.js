let Ships = [];
let Torpedos = [];
let TorpedoExplosions = [];
let Phasers = [];
let ShipImg, ThrusterShipImg, PhaserImg;
let YourShip;
let YouAreDead = false;
let Torpedo_Launched = false;
let Phaser_On = false;

let socket = io.connect('http://localhost:8000');
YourShip = 8;

function preload() {
    ShipImg = loadImage('assets/Ship.png');
    ThrusterShipImg = loadImage('assets/thrusterShip.png');
    PhaserImg = loadImage('assets/Phaser.png');
}

function setup() {
    createCanvas(800, 800);
    loop();
    imageMode(CENTER);
    Ships.push(new Ship(Math.random() * width, Math.random() * height));
    YourShip = Ships.length - 1;
    Ships.push(new Ship(Math.random() * width, Math.random() * height));
    Scroll = createVector(Ships[YourShip].Position.x, Ships[YourShip].Position.y);

    socket.on('connection',
        function (socket) {
            sendData({ PhaserOn: Phaser_On, TorpedoLaunched: Torpedo_Launched, MyId: YourShip, x: Ships[YourShip].Position.x, y: Ships[YourShip].Position.y, Velocity: Ships[YourShip].Velocity, Angle: Ships[YourShip].Angle });
        }
    );
    socket.on('UpdateShip', function (data) {
        console.log('Recieved: ' + data);
        if (data.TorpedoLaunched)
            Torpedos.push(new Torpedo(data.x, data.y, data.Angle, data.Velocity.x + Math.cos(data.Angle) * 2, data.Velocity.y + Math.sin(data.Angle) * 2));
        if (data.PhaserOn)
            Phasers.push(new Phaser(data.x, data.y, data.Angle, data.MyId));
    });
}

function draw() {
    if (YouAreDead) {
        YourShip = '';
        //redraw background
        background(0);

        //set draw color
        fill(255);

        //draw each ship
        for (var i = Ships.length - 1; i > -1; i--) {
            if (YourShip == i) {
                noTint();
                Ships[i].Update();
            } else
                tint('#FF0000');
            Ships[i].Draw(ShipImg, ThrusterShipImg);
            if (Ships[i].Shields <= 0) {
                Ships.delete(i);
            }
        }
        for (var i = Torpedos.length - 1; i >= 0; i--) {
            noStroke();
            Torpedos[i].Update();
            Torpedos[i].Draw();

            if (Torpedos[i].Dead) {
                TorpedoExplosions.push(new TorpedoExplosion(Torpedos[i].Position.x, Torpedos[i].Position.y));
                Torpedos.delete(i);
            }
        }
        for (var i = TorpedoExplosions.length - 1; i > -1; i--) {
            TorpedoExplosions[i].Update();
            TorpedoExplosions[i].Draw();
            if (TorpedoExplosions[i].IsDead())
                TorpedoExplosions.delete(i);
        }
        while (Phasers.length > 0) {
            stroke('#3333FF');
            Phasers[0].UpdateAndDraw();
            Phasers.delete(0);
        }
    } else {
        //redraw background
        background(0);

        //set draw color
        fill(255);
        if (keyIsDown(87))
            Ships[YourShip].Thrust = true;
        else
            Ships[YourShip].Thrust = false;

        Torpedo_Launched = false;
        Phaser_On = false;
        //draw each ship
        for (var i = Ships.length - 1; i > -1; i--) {
            if (YourShip == i) {
                noTint();
                Ships[i].Update();
                Torpedo_Launched = Ships[i].Torpedo_Launched
                Phaser_On = Ships[i].Phaser_On;
            } else
                tint('#FF0000');
            Ships[i].Draw(ShipImg, ThrusterShipImg);
            if (Ships[i].Shields <= 0) {
                Ships.delete(i);
                if (YourShip == i)
                    YouAreDead = true;
            }
        }
        for (var i = Torpedos.length - 1; i >= 0; i--) {
            noStroke();
            Torpedos[i].Update();
            Torpedos[i].Draw();

            if (Torpedos[i].Dead) {
                TorpedoExplosions.push(new TorpedoExplosion(Torpedos[i].Position.x, Torpedos[i].Position.y));
                Torpedos.delete(i);
            }
        }
        for (var i = TorpedoExplosions.length - 1; i > -1; i--) {
            TorpedoExplosions[i].Update();
            TorpedoExplosions[i].Draw();
            if (TorpedoExplosions[i].IsDead())
                TorpedoExplosions.delete(i);
        }
        while (Phasers.length > 0) {
            stroke('#3333FF');
            Phasers[0].UpdateAndDraw();
            Phasers.delete(0);
        }
    }
}
/**
 * Delete an item properly.
 * @param {any} index The index of item to delete.
 * @return {Array<any>} The new list.
 */
Array.prototype.delete = function (index) {
    this.splice(index, 1);
    return this;
}