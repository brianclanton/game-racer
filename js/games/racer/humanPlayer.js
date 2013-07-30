// A basic AI implementation for the racing game
define(['games/racer/util','games/racer/common','games/racer/racer.core','games/racer/playerModule'], function (Util,Common,Core,PlayerModule) {

    var humanPlayer = (function() {
        var player = function() {
            this.constructor.super.call(this);
            this.isYou = true;
        };
        Util.inherit(player, PlayerModule);

        player.prototype.steer = function(dt) {
            var speedPercent  = this.car.speed/Common.maxSpeed;
            var ax            = speedPercent/2;           // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
            var dx            = 2*speedPercent*dt;
            if (this.input.left) {
                this.car.dx = Math.max(Util.accelerate(this.car.dx, -ax, dt),-dx);
            }
            else if (this.input.right) {
                this.car.dx = Math.min(Util.accelerate(this.car.dx, ax, dt),dx);
            }
            else {
                if(this.car.x != 0) this.car.dx -= this.car.dx/2;
            }
            this.car.x += this.car.dx;
        };
        player.prototype.accelerate = function(dt) {
            this.car._z = this.car.z;
            this.car.z  = Util.increase(this.car.z, dt * this.car.speed, Common.trackLength); //TODO: switch maxSpeed back to speed

            if (this.input.faster && !this.input.drift)
                this.car.speed = Util.accelerate(this.car.speed, this.car.accel, dt);
            else if (this.input.slower)
                this.car.speed = Util.accelerate(this.car.speed, Common.breaking, dt);
            else
                this.car.speed = Util.accelerate(this.car.speed, Common.decel, dt);
        };

        return player;
    })();

    return humanPlayer;
});