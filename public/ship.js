class Ship {
    constructor(id, x, y) {
        this.Id = id;
        this.Position = createVector(x, y);
        this.Velocity = createVector(0, 0);
        this.Shields = 100;
        this.Energy = 100;
        this.ThrustEnergy = 100;
        this.Thrust = false;
        this.Angle = Math.PI * 1.5;
        this.e_pressed = true;
        this.PhaserOn = false;
        this.Torpedo_Launched = false;
        this.Cloaked = false;
    }

    Update() {
        if (this.Thrust && this.ThrustEnergy > 0) {
            this.Velocity.add(Math.cos(this.Angle) / 10, Math.sin(this.Angle) / 10);
            if (dist(this.Velocity.x + this.Position.x, this.Velocity.y + this.Position.y, this.Position.x, this.Position.y) > 8) {
                for (var i = 0; dist(this.Velocity.x + this.Position.x, this.Velocity.y + this.Position.y, this.Position.x, this.Position.y) > 8; i = 0) {
                    this.Velocity.sub(Math.cos(this.Angle) / 10, Math.sin(this.Angle) / 10);
                }
            }
            this.ThrustEnergy -= 1.5;
        }
        if (this.ThrustEnergy < 100 && !this.Thrust)
            this.ThrustEnergy++;

        if (keyIsDown(69) && !this.e_pressed && this.Energy > 2) {
            Torpedos.push(new Torpedo(this.Position.x, this.Position.y, this.Angle, this.Velocity.x + Math.cos(this.Angle) * 2, this.Velocity.y + Math.sin(this.Angle) * 2));
            this.e_pressed = true;
            Torpedo_Launched = true;
            this.Energy -= 3;
            this.Torpedo_Launched = true;
        } else if (this.e_pressed && !keyIsDown(69)) this.e_pressed = false;
        if (keyIsDown(81) && this.Energy > 0) {
            Phasers.push(new Phaser(this.Position.x, this.Position.y, this.Angle, YourShip));
            this.Energy -= 3;
            if (this.Energy < 0)
                this.Energy = 0;
            this.Phaser_On = true;
        } else this.PhaserOn = false;
        if ((!(keyIsDown(69) && !this.e_pressed)) && !keyIsDown(81) && frameCount % 30 == 0 && this.Energy < 100)
            this.Energy++;
        if (keyIsDown(90) && this.Shields > 1 && this.Energy < 100) {
            this.Energy++;
            this.Shields--;
        }
        if (keyIsDown(67) && this.Energy > 0 && this.Shields < 100) {
            this.Shields++;
            this.Energy--;
        }

        if (keyIsDown(65))
            this.Angle -= Math.PI / 50;
        if (keyIsDown(68))
            this.Angle += Math.PI / 50;
        this.Position.add(this.Velocity);
        if (this.Position.x < - 50) this.Position.add(width + 150, 0);
        if (this.Position.x > width + 50) this.Position.add(-width - 150, 0);
        if (this.Position.y < - 50) this.Position.add(0, height + 150);
        if (this.Position.y > height + 50) this.Position.add(0, -height - 150);
    }

    Draw(img1, img2) {
        if (!this.Cloaked) {
            stroke('#6666FF');
            line(this.Position.x - 50, this.Position.y + 57, (this.Position.x - 50) + this.Shields, this.Position.y + 57);
            stroke('#FFFF00');
            line(this.Position.x - 50, this.Position.y + 60, (this.Position.x - 50) + this.Energy, this.Position.y + 60);
            stroke('#FFFFFF');
            line(this.Position.x - 50, this.Position.y + 63, (this.Position.x - 50) + this.ThrustEnergy, this.Position.y + 63);
            noStroke();
            push();
            translate(this.Position.x, this.Position.y);
            rotate(this.Angle + Math.PI / 2);
            if (this.Thrust)
                image(img2, 0, 0)
            else
                image(img1, 0, 0);
            pop();
        }
    }
}