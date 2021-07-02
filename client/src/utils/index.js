const unique = (arr) => {
  const mapping = {};
  arr.map((e, i) => {
    if (!mapping[e]) {
      mapping[e] = 1;
    }
  });
  return Object.keys(mapping);
};

const sum = (bets) =>
  bets.reduce((prev, next) => prev + parseInt(next.amount), 0);




export {sum, unique}
