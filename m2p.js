#!/usr/bin/env node
const yargs = require('yargs');

yargs
  .alias('i', 'input')
  .alias('o', 'output')
  .describe('i', 'input file')
  .describe('o', 'output file')
  .help('h')
  .commandDir('./cmd')
  .demandOption(['input', 'output'])
  .help().argv;
