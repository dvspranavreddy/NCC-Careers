// this file now simply re-exports the new service implementation.
// the old implementation lived here; the logic has been moved to
// /services/emailService.js in order to get the transporter.verify call
// and keep the routes tidy.  existing `require('../email')` imports
// will continue to work for now.

module.exports = require('./services/emailService');

