

var express = require('express');
var model = require('./employee.model');
var logger = require('../helpers/logger');
var conn = require('../helpers/connections')

var router = express.Router();

function notLoggedIn(req, res) {
  if (!req.session.active) {
    res.json({message: 'not logged in'});
    return true;
  }
  return false;
}

// Returns a list of all employees
router.get('/employees', async (req, res) => {
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getEmployees(connection);

  res.json(response);
});
  
router.get('/employees/:empId', async (req, res) => {
  if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getEmployee(connection, req.params.empId);
  res.json(response);
});
  
//Returns contact info of a given employee- does not need perms to get this
router.get('/employees/:empId/profile', async (req, res) => {
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getContactInfo(connection, req.params.empId);
  res.json(response);
});
  
//Allows updating contact info of a given employee- must be logged in to do this
router.put('/employees/:empId/profile', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.updateContactInfo(connection, req.params.empId, req.body);
  res.json(response);
});

// Remove employee from database
router.delete('/employees/:empId', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.removeEmployee(connection, req.params.empId);
  res.json(response);
});

// Updates the manager of an employee
router.put('/employees/:empId/profile/manager', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.setManager(connection, req.params.empId, req.body.managerId);
  res.json(response);
});

router.get('/employees/:empId/profile/report-history', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;
  
  let response = await model.reportHistory(connection, req.params.empId);
  res.json(response);
});

//Adds strikes to employee
router.post('/employees/:empId', async (req, res) => {
  //if (notLoggedIn(req, res)) return; //Not sure if this will actually be necessary for a post request.

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.addStrike(connection, req.params.empId);
  res.json(response);
});

//Create a new report for an employee, by a manager
router.put('/employees/:empId/profile/report-history', async (req, res) => {
  //if (notLoggedIn(req, res)) return;
  let by_Employee = req.params.empId;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.createReport(connection, req.body, by_Employee);
  res.json(response);
});

router.get('/results', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.searchEmployees(connection, req.query.search_query);
  res.json(response);
});

module.exports = router;