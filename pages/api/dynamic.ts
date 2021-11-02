import algebra from "algebra.js";

const randomFromInterval = (min, max) => {
  return Math.random() * (max - min) + min;
};

const sortAsc = (a, b) => a - b;

export default function handler(req, res) {
  if (req.method === "POST") {
    if (!req.body.eq) {
      res.status(400).json({ code: "Missing equation" });
      return;
    }
    const [infDomain, supDomain] = req.body.domain;
    var exp = new algebra.parse(req.body.eq.replace("y", "0"));
    var roots =
      exp
        .solveFor("x")
        ?.filter((root) => root >= infDomain && root <= supDomain)
        ?.map((root) => parseFloat(root.toString()))
        ?.sort(sortAsc) || [];
    const response = roots.reduce((prev, currentRoot) => {
      const infRange = prev.length ? prev[prev.length - 1].x : infDomain;
      const randomNumberBetweenRanges = randomFromInterval(
        infRange,
        currentRoot
      );
      const eq = new algebra.parse(
        req.body.eq.replace("x", `(${randomNumberBetweenRanges})`)
      );
      const yValueInRandomX = eq.solveFor("y").toString();
      const movement = parseInt(yValueInRandomX) > 0 ? "RIGHT" : "LEFT";
      return [
        ...prev,
        {
          type: "RANGE",
          range: [infRange, currentRoot],
          movement,
        },
        {
          type: "EQ_POINT",
          x: currentRoot,
        },
      ];
    }, []);
    if (roots.length > 0) {
      response.push({
        type: "RANGE",
        range: [response[response.length - 1].x, supDomain],
        movement:
          supDomain - response[response.length - 1].x > 0 ? "RIGHT" : "LEFT",
      });
    }
    const responseWithSubType = response.map((c, index) => {
      if (c.type === "RANGE") return c;
      return {
        ...c,
        subType:
          response[index - 1]?.movement === "RIGHT" &&
          response[index + 1]?.movement === "LEFT"
            ? "attractor"
            : "repeler",
      };
    });
    res.status(200).json({ eq: exp.toString(), result: responseWithSubType });
  }
}
