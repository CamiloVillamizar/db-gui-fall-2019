var logger = require('../helpers/logger');


async function postNewPerfRev(connection, empId, body); {
    try {
      await connection.query(`INSERT INTO perf_reviews (emp_id, review, score, creation_date) VALUES
      (${empId}, ${body.review}, ${body.score}, ${body.creation_date})`);
    }
    catch (e) {
      logger.error(e);
      return {message: 'fail'};
    }
    
    return {message: 'succeed'};
  }

  
module.exports = {
    //functions that will be used
    postNewPerfRev
  };