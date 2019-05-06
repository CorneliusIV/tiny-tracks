var expect = require('chai').expect
var { getTitle } = require('../data')

describe('getTitle()', function() {
  testDataColon = {
    snippet: { title: 'Tank and The Bangas : NPR Tiny Desk Contest 2017' }
  }
  testDataDash = {
    snippet: { title: 'Tank and The Bangas - NPR Tiny Desk Contest 2017' }
  }
  testDataParentheses = {
    snippet: { title: 'Tank and The Bangas (NPR Tiny Desk Contest 2017)' }
  }

  testDataNPR = {
    snippet: { title: 'Tank and The Bangas NPR Tiny Desk Contest 2017' }
  }

  context('Test with ":"', function() {
    it('should return tank and the bangas', function() {
      expect(getTitle(testDataColon)).to.equal('tank and the bangas')
    })
  })

  context('Test with "-"', function() {
    it('should return tank and the bangas', function() {
      expect(getTitle(testDataDash)).to.equal('tank and the bangas')
    })
  })

  context('Test with "("', function() {
    it('should return tank and the bangas', function() {
      expect(getTitle(testDataParentheses)).to.equal('tank and the bangas')
    })
  })

  context('Test with " NPR"', function() {
    it('should return tank and the bangas', function() {
      expect(getTitle(testDataNPR)).to.equal('tank and the bangas')
    })
  })
})
