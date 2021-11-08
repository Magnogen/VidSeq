// jshint esversion: 8

let code = `

import 'GitHub:Magnogen/VidSeq:options/dark_blue_theme.vdsq'

bg = background :: fill: #0d144d
easetype cubic

title = text :: content: 'My Programming Language', fill: #fffe, y: 1.1
over 0.2 seconds
  title \\> :: y: 0.16667
wait for 0.2 seconds
wait for space

`; // oof i thought i could do all this

code = `

potato = ::
  test: 'value'

`; // should jsut append an object to a list of variables, resulting in something like [{ id: "potato", content: { "test": "value" } }]

(async _=>{
  
  // https://easings.net/
  // 'bounce' is oof
  function ob(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if      (t < 1 / d1)   return n1 * t * t;
    else if (t < 2 / d1)   return n1 * (t -= 1.5 / d1) * t + 0.75;
    else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    else                   return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
  // linear sine quadratic cubic quartic quintic exponential circular back elastic bounce
  let ease = {
    linear: {
      in: t => t, out: t => t, inout: t => t
    }, sine: {
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
  
  code = await (async _=>{
    let code = _, tokens = [], patterns = [ // these are all the token types, so far it works out well
      { type: 'lparen',  match: /^\(/ },
      { type: 'rparen',  match: /^\)/ },
      { type: 'newline', match: /^\n/ },
      { type: 'space',   match: /^\s+/ },
      { type: 'vardec',  match: /^=/ },
      { type: 'objdec',  match: /^::/ },
      { type: 'valdec',  match: /^:/ },
      { type: 'comma',   match: /^,/ },
      { type: 'trans',   match: /^(->|~>|\/>|\\>)/ },
      { type: 'colour',  match: /^#[0-9a-f]{3}[0-9a-f]?([0-9a-f]{2})?([0-9a-f]{2})?/i },
      { type: 'number',  match: /^([0-9]+\.?[0-9]*|[0-9]*\.?[0-9]+)/ },
      { type: 'string',  match: /^('|"|`).*\1/ },
      { type: 'boolean', match: /^(true|false)/i },
      // http://rigaux.org/language-study/syntax-across-languages.html
      // like Eiffel, Matlab & Vimscript
      { type: 'keyword', match: /^[a-z][_a-z0-9]*/i },
      { type: 'error',   match: /^./ }
    ];
    do {
      let matched;
      for (let pattern of patterns) {
        matched = code.match(pattern.match);
        if (!matched) continue;
        tokens.push({ type: pattern.type, source: matched[0] });
        code = code.substring(matched[0].length);
        break;
      }
      // break;
    } while (code != '');
    // console.log(tokens.map(e=>typeof e=='string'?e:`${e.type}: "${e.source}"`).join('\n')); // testing, uncomment for all the tokens is a readable way in the console
    return tokens.filter(e=>e!='space');
  })(code.trim())
  // console.log(code);
  
  let vars = [];
  
  // converts
  //   GitHub:{username}/{repo}:{path}
  // to
  //   https://raw.githubusercontent.com/{username}/{repo}/{repo's default branch}/{path}
  let parseURL = async url => {
    if (!url.toLowerCase().startsWith('github:')) return url;
    url = url.split(':')
    let user = url[1].split('/')[0], 
        repo = url[1].split('/')[1];
    let branch = await fetch(`https://api.github.com/repos/${user}/${repo}`).then(async res=>(await res.json()).default_branch)
    let path = url[2];
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`
  }
  
  // everything beyond this is likely garbage
  for (let token of code) {
    let res = perform(token);
    if (res.error) {
      console.error(res.response)
      break;
    }
    // break;
  }
  console.log(vars);
  
  async function perform(token) {
    
    let template = await fetch('')
    
    // console.log(token)
    if (token == 'vardec') {
      if (!['keyword', 'objdec'].includes(token.type))
        return { error: true, response: `cannot define ${token.type} as variable` }
      
      vars.push({ id: token.source });
    } else if (token.type == 'keyword') {
      
    }
    return { error: false, response: 'executed successfully' }
  }

})();



// okay actually i dont remember putting this here
// !"#%&'()*,./:;?@[\]^_`{|}~ 	¡¦§¨©ª«¬­®¯²³´µ¶·¸¹º»¿‐‑‒–—―‖‗‘’‚‛“”„‟†‡•‣․‥…‧‰‱′″‴‵‶‷‸‹›※‼‽‾‿⁀⁁⁂⁃⁄⁅⁆⁇⁈⁉⁊⁋⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞™


