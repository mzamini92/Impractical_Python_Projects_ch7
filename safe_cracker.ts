function fitness(combo: any[], attempt: any[]): number {
    /* Compare items in two lists and count number of matches. */
    let grade = 0;
    for (let i = 0; i < combo.length; i++) {
        if (combo[i] == attempt[i]) {
            grade += 1;
        }
    }
    return grade;
}
function main() {
    /Enter lock combination & run hill climbing algorithm to find solution./
    const combination = '6822858902';
    console.log(`Combination = ${combination}`);

    // convert combination to list:
    const combo = combination.split('').map(Number);

    // generate guess at combination & grade fitness:
    let best_attempt = new Array(combo.length).fill(0);
    let best_attempt_grade = fitness(combo, best_attempt);

    let count = 0;

    // evolve guess           
    while (!arraysEqual(best_attempt, combo)) {
        // crossover
        const next_try = best_attempt.slice();
        // mutate
        const lock_wheel = Math.floor(Math.random() * combo.length);
        next_try[lock_wheel] = Math.floor(Math.random() * 10);
        // grade & select
        const next_try_grade = fitness(combo, next_try);
        if (next_try_grade > best_attempt_grade) {
            best_attempt = next_try.slice();
            best_attempt_grade = next_try_grade;
        }
        console.log(next_try, best_attempt);
        count++;
    }

    console.log();
    console.log(`Cracked! ${best_attempt} in ${count} tries!`);
    }

    function arraysEqual(a, b) {
    /Check if two arrays are equal/
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
    }
    return true;
}

const start_time = Date.now();
main();
const end_time = Date.now();
const duration = (end_time - start_time) / 1000;
console.log(`\nRuntime for this program was ${duration.toFixed(5)} seconds.`); 

