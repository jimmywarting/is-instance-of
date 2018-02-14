'use strict'

const arrify = require('arrify')
const classChain = require('class-chain')
const caseInsensitive = require('case-insensitive')
const flatten = require('@lamansky/flatten')
const isObject = require('is-obj')
const qfn = require('qfn')
const sbo = require('sbo')

module.exports = sbo(function isInstanceOf (x, classes, {ci = false} = {}) {
  if (!isObject(x)) return false
  ci = qfn(caseInsensitive, ci)
  const actualClassNames = ci(classChain.names(x))
  return flatten(arrify(classes)).some(cls => {
    switch (typeof cls) {
      case 'function':
        if (cls === Array) return Array.isArray(x)
        return ((x instanceof cls) || (cls.name && actualClassNames.includes(cls.name)))
      case 'string':
        if (ci('Array') === cls) return Array.isArray(x)
        return actualClassNames.includes(cls)
      default: throw new TypeError('Class must be a function or a name string')
    }
  })
})
