import jsonschema from 'jsonschema';
import struct from 'struct.js';

export const dependencies = {
  'jsonschema': jsonschema,
  'struct': struct
};

export const boolean = () => Math.floor(Math.random() * Math.floor(2)) === 0;
// Dates are just 'formatted' strings - so this works well for us..
export const date = () => new Date().toISOString();
export const integer = () => Math.floor(Math.random() * Math.floor(10));
export const string = () => Math.random().toString(36).substring(7);

// We do this here, so we can populate an array with types not including arrays (maybe recursive..)
const typesMinusArray = () => [boolean(), date(), integer(), string()];
const randomTypeMinusArray = () => typesMinusArray()[Math.floor(Math.random() * Math.floor(typesMinusArray().length))];

export function array () {
  let newArray = [randomTypeMinusArray()];
  const top = integer();
  for (let i = 1; i < top; i++) {
    newArray.push(randomTypeMinusArray());
  }

  return newArray;
}

const types = () => [array, boolean, date, integer, string];
const randomTypeSelector = Math.floor(Math.random() * Math.floor(types.length));
export const randomType = () => types[randomTypeSelector];

const express = require('express');
const router = express.Router();

const basicSchema = {
  'id': '/TestSchema',
  'type': 'object',
  'additionalProperties': true,
  'properties': {
    'array': { 'default': array(), 'type': 'array' },
    'boolean': { 'default': boolean(), 'type': 'boolean' },
    'date': { 'default': date(), 'type': 'string', 'format': 'date-time' },
    'integer': { 'default': integer(), 'type': 'integer' },
    'string': { 'default': string(), 'type': 'string' }
  },
  'required': ['array', 'boolean', 'date', 'integer', 'string']
};

const basStruct = struct(Object.assign({}, dependencies, { 'schema': basicSchema }));

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/:id', function (req, res) {
  const basicStruct = basStruct({});
  basicStruct.scaffold();
  res.json(basicStruct.get());
});

module.exports = router;
