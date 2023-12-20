const testInput = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const testInput2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const parse = (input) => {
  const rules = input.split("\n").map((l) => l.split(" -> "));
  const parsed = {};

  for (let rule of rules) {
    if (rule[0] === "broadcaster") {
      parsed[rule[0]] = {
        linked: rule[1].split(", "),
        type: "broadcaster",
      };

      continue;
    }

    const type = rule[0][0];
    const ruleName = rule[0].slice(1);

    parsed[ruleName] = {
      linked: rule[1].split(", "),
      type,
    };
  }

  Object.keys(parsed).forEach((key) => {
    const rule = parsed[key];
    if (rule.type === "%") {
      rule.state = "d";
    }

    if (rule.type === "&") {
      const allLinks = {};

      Object.entries(parsed).forEach(([rule, params]) => {
        if (params.linked.includes(key)) {
          allLinks[rule] = "d";
        }
      });

      rule.state = allLinks;
    }
  });

  return parsed;
};

const solve = (inputs) => {
  let lowCount = 0;
  let highCount = 0;
  let stop = false;
  const cache = new Map();
  let cacheHit = 0;
  let cacheMiss = 0;

  for (let i = 0; i < 1000000000000000 && !stop; i++) {
    if (i % 1000000 === 0) {
      console.log(`${i}/${10000000000}, ${cacheHit}, ${cacheMiss}`);
    }
    let fireMap = [["broadcaster", "d", "but"]];

    while (fireMap.length > 0) {
      const newFireMap = [];

      for (let fire of fireMap) {
        let [rule, current, sender] = fire;

        const ruleObj = inputs[rule];
        if (rule === "rx" && current === "d") {
          console.log("rx", i);
          stop = true;
          break;
        }

        // 'xm' depends on the input
        // it is the enter to 'rx'
        if (rule === 'xm' && current === 'u') {
          console.log('xm:', sender, i, current)
        }

        if (!ruleObj) {
          continue;
        }

        if (ruleObj.type === "broadcaster") {
          newFireMap.push(...ruleObj.linked.map((r) => [r, current, rule]));
        } else if (ruleObj.type === "%") {
          if (current === "u") {
            continue;
          }
          ruleObj.state = ruleObj.state === "d" ? "u" : "d";

          const key = `${rule}-${ruleObj.state}`;

          if (cache.has(key)) {
            newFireMap.push(...cache.get(key));
            cacheHit++;
            continue;
          }
          cacheMiss++;

          let newCurrent = ruleObj.state === "d" ? "d" : "u";
          const newFire = ruleObj.linked.map((r) => [r, newCurrent, rule]);
          newFireMap.push(...newFire);
          cache.set(key, newFire);
        }

        if (ruleObj.type === "&") {
          ruleObj.state[sender] = current;
          const allHigh = Object.values(ruleObj.state).every((v) => v === "u");
          const key = `${rule}--${allHigh}`;

          if (cache.has(key)) {
            newFireMap.push(...cache.get(key));
            cacheHit++;
            continue;
          }
          cacheMiss++;

          const newCurrent = allHigh ? "d" : "u";
          const linked = newCurrent === 'd' ? ruleObj.linked : ruleObj.linked.filter(r => !inputs[r] || inputs[r].type !== '%')
          const newFire = linked.map((r) => [r, newCurrent, rule]);
          newFireMap.push(...newFire);
          cache.set(key, newFire);
        }
      }
      fireMap = newFireMap;
    }
  }

  return [lowCount, highCount, lowCount * highCount];
};



const LCD = (...a) => {
  const max = Math.max(...a);
  let realRes = max;

  while (
    a.some((num) => {
      return realRes % num !== 0;
    })
  ) {
    realRes += max;
  }

  return realRes;
}

console.log(solve(parse(LCD(3803, 3917, 3889, 3877))));
// find when 'xm' receives the 'u'/'high' signal
// calc the period for each of them 
// ng 3803
// jz 3917
// sv 3889
// ft 3877
// answer = ng * jz * sv * ft
// LCD is taking too long