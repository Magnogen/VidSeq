// jshint esversion: 8
VidSeq = (exports = {}) => {
    let map = (n, x, y) => ((n+1) / 2 * (y - x) + x);
    let c = document.createElement("canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);

    exports.canvas = document.querySelector("canvas");
    exports.context = exports.canvas.getContext("2d");
    exports.events = []; elapsed = 0;
    document.addEventListener("keydown", (e) => {
        if(!exports.events.includes(e.code.toLowerCase())) {
            exports.events.push(e.code.toLowerCase());
            console.log(exports.events);
        }
    });
    document.addEventListener("keyup", (e) => {
        if(exports.events.includes(e.code.toLowerCase())) {
            exports.events.splice(exports.events.indexOf(e.code.toLowerCase()), 1);
            console.log(exports.events);
        }
    });

    exports.eventLength = function (event) {
        if (event.endsWith("ms") && !isNaN(event.slice(0, -2)))
            return +event.slice(0, -2);
        if (event.endsWith("s") && !isNaN(event.slice(0, -1)))
            return 1000 * +event.slice(0, -1);
        if (event.endsWith("m") && !isNaN(event.slice(0, -1)))
            return 60000 * +event.slice(0, -1);
        return;
    };

    exports.singleEventMet = function (event) {
        if (exports.events.includes(event.toLowerCase())) return true;
        return false;
    }

    eventMet = -1;
    exports.eventMet = function (event) {
        let e = event.replaceAll(' ', '');
        if (/[^A-Za-z|&!,]/.test(e)) return undefined;
        e = e.split(',').map(e=> {
            let parts = e.split('|').map(e=> {
                let parts = e.split('&').map(e=>{
                    if (e[0]=='!') return !exports.singleEventMet(e.slice(1));
                    return exports.singleEventMet(e);
                });
                return parts.every(v => v === true);
            });
            return parts.includes(true);
        });
        
        if (e[eventMet+1]) eventMet++;
        
        if (eventMet == e.length-1) {
            eventMet = -1;
            return true;
        }
        return false;
    };

    exports.registry = {};
    exports.register = function (name, action) {
        exports.registry[name] = action;
    }

    exports.until = async function (event='', action=()=>{}) {
        let start = performance.now();
        await new Promise(async (resolve) => {
            const anim = async function () {
                elapsed = performance.now() - start;
                for (let func in exports.registry) exports.registry[func](elapsed);
                // let length = exports.eventLength(event);
                // if (length)
                //   action(Math.min(length, elapsed), Math.min(1, elapsed / length));
                // else
                action(elapsed);
                if (exports.eventMet(event)) resolve();
                else requestAnimationFrame(anim);
            };
            anim();
        });
    };

    exports.text = function({
        content='',
        x=0, y=0, fill='#000000ff', stroke='#00000000',
        width=1, align='center', baseline='middle', font='serif',
        italic=false, bold=false, size=1, line_gap=1.2
    } = {}) {
        
        let style = '';
        if (italic) style += 'italic ';
        else style += 'normal ';
        style += 'normal ';
        if (bold) style += '700 ';
        else style += '400 ';
        style += (size * 24) + 'px ';
        style += '/' + line_gap + ' ';
        style += font;

        exports.context.fillStyle = fill;
        exports.context.font = style;
        exports.context.textAlign = align;
        exports.context.textBaseline = baseline;
        exports.context.fillText(content, map(x,0,c.width), map(y,c.height,0));
        exports.context.strokeStyle = stroke;
        exports.context.lineWidth = width;
        exports.context.strokeText(content, map(x,0,c.width), map(y,c.height,0));
    }

    // linear sine quadratic cubic quartic quintic exponential circular back elastic bounce
    // https://easings.net/
    // bounce is oof
    function ob(t) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if      (t < 1 / d1)   return n1 * t * t;
        else if (t < 2 / d1)   return n1 * (t -= 1.5 / d1) * t + 0.75;
        else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        else                   return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
    let funcs = {
        sine: {
            in: t => 1-Math.cos(t*Math.PI/2), out: t => Math.sin(t*Math.PI/2), inout: t => -(Math.cos(t*Math.PI)-1)/2
        }, quadratic: {
            in: t => Math.pow(t,2), out: t => 1-Math.pow(1-t,2), inout: t => t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2
        }, cubic: {
            in: t => Math.pow(t,3), out: t => 1-Math.pow(1-t,3), inout: t => t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
        }, quartic: {
            in: t => Math.pow(t,4), out: t => 1-Math.pow(1-t,4), inout: t => t<0.5 ? 8*t*t*t*t : 1-Math.pow(-2*t+2,4)/2
        }, quintic: {
            in: t => Math.pow(t,5), out: t => 1-Math.pow(1-t,5), inout: t => t<0.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2
        }, exponential: {
            in: t => t==0 ? 0 : Math.pow(2,10*t-10), out: t => t==1 ? 1 : 1-Math.pow(2,-10*t), inout: t => t==0 ? 0 : t==1 ? 1 : t<0.5 ? Math.pow(2,20*t-10)/2 : (2-Math.pow(2,-20*t+10))/2
        }, circular: {
            in: t => 1-Math.sqrt(1-Math.pow(t,2)), out: t => Math.sqrt(1-Math.pow(t-1,2)), inout: t => t<0.5 ? (1-Math.sqrt(1-Math.pow(2*t,2)))/2 : (Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2
        }, back: {
            in: t => 2.70158*t*t*t-1.70158*t*t, out: t => 1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2), inout: t => t<0.5 ? (Math.pow(2*t,2)*((3.59491)*2*t-2.59491))/2 : (Math.pow(2*t-2,2)*((3.59491)*(t*2-2)+2.59491)+2)/2
        }, elastic: {
            in: t => t==0 ? 0 : t==1 ? 1 : -Math.pow(2,10*t-10)*Math.sin((t*10-10.75)*2*Math.PI/3), out: t => t==0 ? 0 : t==1 ? 1 : Math.pow(2,-10*t)*Math.sin((t*10-0.75)*2*Math.PI/3)+1,
            inout: t => t==0 ? 0 : t==1 ? 1 : t<0.5 ? -(Math.pow(2,20*t-10)*Math.sin((20*t-11.125)*2*Math.PI/4.5))/2 : (Math.pow(2,-20*t+10)*Math.sin((20*t-11.125)*2*Math.PI/4.5))/2+1
        }, bounce: { // mega oof
            in: t => 1-ob(1-t), out: ob, inout: t => t<0.5 ? (1-ob(1-2*t))/2 : (1+ob(2*t-1))/2
        }
    }
    exports.tween = function(a, b, t, ease='cubic', type='inout') {
        let T = funcs[ease][type](t);
        return (1-T)*a + T*b;
    }

return exports;
};
  
  
  
  
  
  
  
  
  
  
  