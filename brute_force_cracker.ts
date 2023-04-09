function product<T>(values: T[], repeat: number): T[][] {
  if (repeat === 0) {
    return [[]];
  }
  const result: T[][] = [];
  for (const rest of product(values, repeat - 1)) {
    for (const value of values) {
      result.push([...rest, value]);
    }
  }
  return result;
}
const combo = [9, 9, 7, 6, 5];

const start_time = Date.now();

for (const perm of product([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], combo.length)) {
  if (perm.join() === combo.join()) {
    console.log(`Cracked! ${combo} ${perm}`);
    break;
  }
}

const end_time = Date.now();
const duration = (end_time - start_time) / 1000;
console.log(`\nRuntime for this program was ${duration} seconds.`);

