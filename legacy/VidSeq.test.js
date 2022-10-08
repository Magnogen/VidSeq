let v = VidSeq();
let [c, ctx] = [v.canvas, v.context];
  
(async () => {
    class particle {
        constructor(x, y, theta, xVel, yVel, thetaVel) {
            this.x = x; this.y = y;
            this.a = theta || Math.random() * Math.PI * 2;
            let a = Math.random() * Math.PI * 2;
            this.xVel = xVel || Math.cos(a);
            this.yVel = yVel || Math.sin(a);
            this.aVel = thetaVel || Math.random()/(20*Math.PI);
        }
        physics(dt=1) {
            this.x += window.devicePixelRatio*this.xVel*dt; this.y += window.devicePixelRatio*this.yVel*dt;
            this.a += this.aVel;
            if (this.x < 0) this.x += c.width;
            if (c.width < this.x) this.x -= c.width;
            if (this.y < 0) this.y += c.height;
            if (c.height < this.y) this.y -= c.height;
        }
        draw(col) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.a);
            ctx.beginPath();
            let pr = window.devicePixelRatio;
            ctx.fillStyle = col;
            ctx.fillRect(-2*pr, -2*pr, 4*pr, 4*pr);
            ctx.restore();
        }
        drawLines(arr, thresh) {
            for (let p of this.ns(arr, thresh)) {
                let d = Math.min(this.dToCir(p), thresh);
                let pwr = 0.5;
                let a = Math.floor(10-10*Math.pow(d/thresh, pwr))/10;
                ctx.lineWidth = window.devicePixelRatio * 2 * a;
                ctx.strokeStyle = `rgb(255,255,255,${a/3})`;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p.x, p.y);
                if (a > 0) ctx.stroke();
            }
        }
        dToDia(p) {return Math.abs(this.x-p.x)+Math.abs(this.y-p.y)}
        dToCir(p) {return Math.sqrt(Math.pow(this.x-p.x,2)+Math.pow(this.y-p.y,2))}
        ghost(x, y) {return new particle(this.x+x,this.y+y,this.a,this.xVel,this.yVel,this.thetaVel)}
        move(x, y) {this.x+=x;this.y+=y}
        ns(arr, thresh) {
            let res = [], d;
  
            for (let p of arr) {
                res.push(p);
                res.push(p.ghost(c.width, 0));
                res.push(p.ghost(-c.width, 0));
                res.push(p.ghost(0, c.height));
                res.push(p.ghost(0, -c.height));
                res.push(p.ghost(c.width, c.height));
                res.push(p.ghost(-c.width, c.height));
                res.push(p.ghost(c.width, -c.height));
                res.push(p.ghost(-c.width, -c.height));
            }
            return res.filter(p => this.dToCir(p)<thresh );
        }
    }
  
    let Ps = [];
    for (let i = 0; i < 20; i++) {
        let x = Math.random() * c.width;
        let y = Math.random() * c.height;
        Ps.push(new particle(x, y));
    }
    
    // initialise particles
    v.register('bg', () => {
        ctx.fillStyle = "#015"
        ctx.fillRect(0, 0, c.width, c.height)
        
        // particle logic
        for (let i in Ps) {
            Ps[i].physics(1/8)
            Ps[i].draw("#8088AA")
            Ps[i].drawLines(Ps.slice(i), 200)
        }
    })
    
    await v.until('KeyN, !KeyN')
    
    let title = new v.text({ y: 1.15, fill: '#2ff', font: 'sans-serif' })
    await v.until('1s', (elapsed, progress) => {
      v.text({y: v.tween(1.15, 1/6, progress), fill: '#2ff', font: 'sans-serif'})
    })
    console.log('doe')
  //   await v.until()
})();