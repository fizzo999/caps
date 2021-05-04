'use strict';

const handleEvent = require('../hub.js');
const events = require('../lib/events');
require('../apps/vendor.js');
const handleDriverPickup = require('../apps/driver.js');

// Tested middleware needs to either be exported from the server or a separate module
describe('hub test', () => {

  let consoleSpy;
  // let req = {};
  // let res = {};
  // let next = jest.fn(); // spy on next method

  beforeEach(() => {
    // Attach to the console (take it over)
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Put the console back
    consoleSpy.mockRestore();
  });

  it('properly logs some output', () => {
    // handleDriverPickup('someText');
    events.emit('pickup');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('properly logs some output', () => {
    // handleEvent('someText');
    events.emit('in-transit');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('properly logs some output', () => {
    // handleEvent('someText');
    events.emit('delivery');
    expect(consoleSpy).toHaveBeenCalled();
  });

});