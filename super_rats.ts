import * as ss from "simple-statistics";

// CONSTANTS (weight in grams)
let GOAL = 50000;
let NUM_RATS = 20; // number of adult breeding rats in each generation
let INITIAL_MIN_WT = 200;
let INITIAL_MAX_WT = 600;
let INITIAL_MODE_WT = 300;
let MUTATE_ODDS = 0.01;
let MUTATE_MIN = 0.5;
let MUTATE_MAX = 1.2;
const LITTER_SIZE = 8;
const LITTERS_PER_YEAR = 10;
const GENERATION_LIMIT = 500;

//keep breeding pairs even
if (NUM_RATS %2 != 0) {
NUM_RATS += 1;
}

function populate(NUM_RATS: number, MIN_WT: number, MAX_WT: number, MODE_WT: number): number[] {
    /* Initialize a population with a triangular distribution of weights. */
    const weights: number[] = [];
    const factor = 2 * (MODE_WT - MIN_WT) / (MAX_WT - MIN_WT) - 1;

    for (let i = 0; i < NUM_RATS; i++) {
        const randomValue = Math.random();
        const absFactor = Math.abs(factor);
        const triangularValue = randomValue < absFactor 
            ? Math.sqrt(randomValue * absFactor) 
            : 1 - Math.sqrt((1 - randomValue) * (1 - absFactor));
        const weight = MIN_WT + triangularValue * (MAX_WT - MIN_WT);
        weights.push(Math.floor(weight + 0.5));
    }

    return weights;
}


function fitness(population: number[], GOAL: number): number {
    /* Measure population fitness based on an attribute mean vs target. */
    const ave: number = ss.mean(population);
    return ave / GOAL;
}
function select(population: number[], to_retain: number): [number[], number[]] {
    /* Cull a population to contain only a specified number of members. */

    const sorted_population = population.sort();
    const to_retain_by_sex = Math.floor(to_retain / 2);
    const members_per_sex = Math.floor(population.length / 2);
    const females = sorted_population.slice(0, members_per_sex);
    const males = sorted_population.slice(members_per_sex);
    const selected_females = females.slice(-to_retain_by_sex);
    const selected_males = males.slice(-to_retain_by_sex);

    return [selected_males, selected_females];
}
const _ = require('lodash');

function breed(males: number[], females: number[], litter_size: number): number[] {
    /* Crossover genes among members of a population. */

    males = _.shuffle(males);
    females = _.shuffle(females)

    const children: number[] = [];
    for (let i = 0; i < females.length; i++) {
        const male = males[i % males.length];
        const female = females[i];
        for (let j = 0; j < litter_size; j++) {
            const child = Math.floor(Math.random() * (male - female + 1)) + female;
            children.push(child);
        }
    }

    return children;
}
function mutate(children: number[], MUTATE_ODDS: number, MUTATE_MIN: number, MUTATE_MAX: number): number[] {
    /* Randomly alter rat weights using input odds and fractional changes. */
    
    const randomValue = Math.random();
    const range = MUTATE_MAX - MUTATE_MIN;

    for (let i = 0; i < children.length; i++) {
        const rat = children[i];
        if (MUTATE_ODDS >= randomValue) {
            children[i] = Math.round(rat * randomValue * range + MUTATE_MIN);
        }
    }
    
    return children;
}

function main() {
    /*Initiate population, select, breed, and mutate, display results */
    let generations = 0;

    let parents = populate(NUM_RATS, INITIAL_MIN_WT, INITIAL_MAX_WT, INITIAL_MODE_WT);
    console.log("Initial population weights = ", parents);

    let popl_fitness = fitness(parents, GOAL);
    console.log("Initial population fitness = ", popl_fitness);
    console.log("number to retain = ", NUM_RATS);

    const ave_wt: number[] = [];

    while (popl_fitness < 1 && generations < GENERATION_LIMIT){
        const [selected_males, selected_females] = select(parents, NUM_RATS);
        let children = breed(selected_males, selected_females, LITTER_SIZE);
        children = mutate(children, MUTATE_ODDS, MUTATE_MIN, MUTATE_MAX);
        parents.push(...selected_males, ...selected_females, ...children);
        popl_fitness = fitness(parents, GOAL);
        console.log("Generation ", generations,  "fitness = ", popl_fitness.toFixed(4));

        const mean_weight = ss.mean(parents);
        ave_wt.push(mean_weight);
        generations++;
    }
    console.log("\naverage weight per generation = ", ave_wt);
    console.log("\nnumber of generations = ", generations);
    console.log("number of years = ", generations / LITTERS_PER_YEAR);

}

if (require.main === module) {
    const start_time = Date.now();

    main();
    const end_time = Date.now();
    const duration = (end_time - start_time)/1000;
    console.log(`\nRuntime for this program was ${duration} seconds.`);
}

