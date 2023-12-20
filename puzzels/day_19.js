const testInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;


const parse = (input) => {
  const emptyLineIndex = input.split("\n").findIndex((x) => x === "");
  const rulesStr = input.split("\n").slice(0, emptyLineIndex);
  const partsStr = input.split("\n").slice(emptyLineIndex + 1);
  const rulesMap = new Map();
  const parts = partsStr.map((part) =>
    part
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        acc[key] = Number(value);
        return acc;
      }, {})
  );

  rulesStr.forEach((rule) => {
    let [key, rules] = rule.split("{").filter(Boolean);
    rules = rules.split(",");

    rules = rules.map((rulePartsStr) => {
      let ruleParts = rulePartsStr.split(":");
      if (ruleParts.length === 1) {
        return { ruleEnd: ruleParts[0].replace("}", "") };
      }
      const partEnd = ruleParts.pop();
      const operator = ruleParts[0].includes("<") ? "<" : ">";
      const [param, value] = ruleParts[0].split(operator);

      return {
        param,
        operator,
        value: Number(value),
        partEnd,
      };
    });

    rulesMap.set(key, rules);
  });

  return [rulesMap, parts];
};

const solve = ([rules, parts]) => {
  const A = [];
  const R = [];

  parts.forEach((part) => {
    let rule = rules.get("in");
    let inside = true;

    const checkForEnd = (end) => {
      if (end === "A") {
        A.push(part);
        inside = false;
      } else if (end === "R") {
        R.push(part);
        inside = false;
      } else {
        rule = rules.get(end);
      }
    };

    while (inside) {
      for (let rulePart of rule) {
        if (rulePart.ruleEnd) {
          checkForEnd(rulePart.ruleEnd);
        } else {
          if (rulePart.operator === "<") {
            if (part[rulePart.param] < rulePart.value) {
              checkForEnd(rulePart.partEnd);
              break;
            }
          } else {
            if (part[rulePart.param] > rulePart.value) {
              checkForEnd(rulePart.partEnd);
              break;
            }
          }
        }
      }
    }
  });

  return A.reduce((acc, cur) => acc + cur.x + cur.m + cur.a + cur.s, 0);
};

const solve2 = ([rules]) => {
  const start = rules.get("in");
  let key = Math.random() % 1000000;
  const parallels = new Map([[++key, [start, []]]]);
  const pathA = [];
  const pathR = [];

  while (parallels.size > 0) {
    [...parallels.entries()].forEach(([key, path]) => {
    //   console.log("🚀 path:", key, path[0]);
      parallels.delete(key);
      const [rule, conditions] = path;

      const checkForEnd = ({ end, condition }) => {
        if (end === "A") {
          pathA.push([...conditions, ...condition]);
        } else if (end === "R") {
          pathR.push([...conditions, ...condition]);
        } else {
          const newRule = rules.get(end);
          key = Math.random() % 1000000;
          console.log(end, key);
          parallels.set(key, [newRule, [...conditions, ...condition]]);
        }
      };

      const reverse = (partRule) => ({
        param: partRule.param,
        operator: partRule.operator === "<" ? ">" : "<",
        value: partRule.operator === '<' ? partRule.value - 1 : partRule.value + 1,
      });

      let reversedRules = [];

      for (let ruleParts of rule) {
        if (ruleParts.ruleEnd) {
          checkForEnd({
            condition: reversedRules,
            end: ruleParts.ruleEnd,
          });
        } else {
          checkForEnd({
            condition: [
              ...reversedRules,
              {
                param: ruleParts.param,
                operator: ruleParts.operator,
                value: ruleParts.value,
              },
            ],
            end: ruleParts.partEnd,
          });
          reversedRules.push(reverse(ruleParts));
        }
      }
    });
  }

  let count = 0;
  console.log("🚀 pathA:", pathA.length);
  for (let path of pathA) {
    const variants = {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    };

    for (let condition of path) {
      if (condition.operator === "<") {
        variants[condition.param].max = Math.min(
          variants[condition.param].max,
          condition.value - 1
        );
      } else {
        variants[condition.param].min = Math.max(
          variants[condition.param].min,
          condition.value + 1
        );
      }
    }

    console.log([...path], variants);
    count +=
      (variants.x.max - variants.x.min + 1) *
      (variants.m.max - variants.m.min + 1) *
      (variants.a.max - variants.a.min + 1) *
      (variants.s.max - variants.s.min + 1);
  }

  return count;
};

console.log(solve2(parse(testInput)));
