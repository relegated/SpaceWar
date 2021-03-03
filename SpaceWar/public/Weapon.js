class Torpedo {
    constructor(x, y, angle, xVelocity, yVelocity) {
        this.Position = createVector(x, y);
        this.Angle = angle;
        this.Speed = createVector(xVelocity, yVelocity);
        this.Speed.mult(1.5);
        this.Dead = false;
        this.IFrames = 50;
    }
    Update() {
        this.Position.add(this.Speed);
        if (this.Position.x < - 50) this.Position.add(width + 150, 0);
        if (this.Position.x > width + 50) this.Position.add(-width - 150, 0);
        if (this.Position.y < - 50) this.Position.add(0, height + 150);
        if (this.Position.y > height + 50) this.Position.add(0, -height - 150);

        if (this.IFrames <= 0) {
            for (var i = 0; i < Ships.length; i++) {
                if (dist(this.Position.x, this.Position.y, Ships[i].Position.x, Ships[i].Position.y) < 35) {
                    Ships[i].Shields -= 3;
                    this.Dead = true;
                    return;
                }
            }
            for (var i = 0; i < Phasers.length; i++) {
                if (collideLineCircle(Phasers[i].Position.x, Phasers[i].Position.y, Phasers[i].Target.x, Phasers[i].Target.y, this.Position.x, this.Position.y, 17)) {
                    this.Dead = true;
                    return;
                }
            }
        } else {
            this.IFrames--;
        }


    }
    Draw() {
        push();
        translate(this.Position.x, this.Position.y);
        rotate(this.Angle + Math.PI / 2);
        quad(6, 25, 0, 0, -6, 25, 0, 20);
        pop();
    }
}
class TorpedoExplosion {
    constructor(x, y) {
        this.Position = createVector(x, y);
        this.Radius = 0;
    }
    Update() {
        this.Radius++;
    }
    Draw() {
        push();
        noFill();
        for (var i = 0; i < this.Radius; i++) {
            stroke(255, ((i + 1) / this.Radius) * 255, 0);
            ellipse(this.Position.x, this.Position.y, i);
        }
    }
    IsDead() {
        return this.Radius > 23;
    }
}
class Phaser {
    constructor(x, y, angle, owner) {
        this.Position = createVector(x, y);
        this.Target = createVector(x + Math.cos(angle) * 150, y + Math.sin(angle) * 150);
        this._Target_ = createVector((this.Target.x + this.Position.x) / 2, (this.Target.y + this.Position.y) / 2);
        this.Angle = angle;
        this.Owner = owner;
    }
    UpdateAndDraw() {
        push();
        translate(this._Target_);
        rotate(this.Angle + Math.PI / 2);
        tint('#0000FF');
        image(PhaserImg, 0, 0);
        pop();
        push();
        for (var i = 0; i < Math.random() * 5 + 10; i++) {
            let _target = createVector(this.Target.x + Math.random() * 20 - 10, this.Target.y + Math.random() * 20 - 10);
            stroke(0, Math.random() * 5, Math.random() * 55 + 200);
            fill(0, Math.random() * 5, Math.random() * 55 + 200);
            if (collidePointCircle(_target.x, _target.y, this.Target.x, this.Target.y, 20))
                ellipse(_target.x, _target.y, 3);
            else 
                i--;
        }
        pop();
        for (var i = 0; i < Ships.length; i++) {
            if (i == this.Owner)
                continue;
            if (collideLineCircle(this.Position.x, this.Position.y, this.Target.x, this.Target.y, Ships[i].Position.x, Ships[i].Position.y, 35))
                Ships[i].Shields--;
        }
    }
}