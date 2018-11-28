var express = require('express')
var app = express()
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM employees ORDER BY emp_no ASC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('employee/list', {
                    title: 'Employee List', 
                    data: ''
                })
            } else {
                // render to views/employee/list.ejs template file
                res.render('employee/list', {
                    title: 'Employee List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD EMPLOYEE FORM
app.get('/add', function(req, res, next){    
    // render to views/employee/add.ejs
    res.render('employee/add', {
        title: 'Add New Employee',
        last_name: '',
        first_name: '',
        birth_date: '',
        gender: '',
        hire_date: ''		
		
    })
})
 
// ADD NEW employee POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('last_name', 'Last Name is required').notEmpty()           //Validate name
    req.assert('first_name', 'First Name is required').notEmpty()             //Validate age
	req.assert('gender', 'Gender is required').notEmpty()           //Validate name
    req.assert('birth_date', 'Date of Birth is required').notEmpty()  //
	req.assert('hire_date', 'Hire Date is required').notEmpty()  
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var employee = {
            last_name: req.sanitize('last_name').escape().trim(),
            first_name: req.sanitize('first_name').escape().trim(),
            gender: req.sanitize('gender').escape().trim(),
			birth_date: req.sanitize('birth_date').escape().trim(),
			hire_date: req.sanitize('hire_date').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO employees SET ?', employee, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/employee/add.ejs
                    res.render('employee/add', {
                        title: 'Add New employee',
                        last_name: employee.last_name,
						first_name: employee.first_name,
						gender: employee.gender,
						birth_date: employee.birth_date,
						hire_date: employee.hire_date                
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/employee/add.ejs
                    res.render('employee/add', {
                        title: 'Add New Employee',
                        last_name: '',
                        first_name: '',
                        gender: '',
						birth_date: '',
						hire_date: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('employee/add', { 
            title: 'Add New Employee',
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            gender: req.body.gender,
			birth_date: req.body.birth_date,
			hire_date: req.body.hire_date
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:emp_no)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM employees WHERE emp_no = ' + req.params.emp_no, function(err, rows, fields) {
            if(err) throw err
            
            // if employee not found
            if (rows.length <= 0) {
                req.flash('error', 'employee not found with emp_no = ' + req.params.emp_no)
                res.redirect('/employees')
            }
            else { // if employee found
                // render to views/employees/edit.ejs template file
                res.render('employee/edit', {
                    title: 'Edit Employee', 
                    //data: rows[0],
                    emp_no: rows[0].emp_no,
                    last_name: rows[0].last_name,
                    first_name: rows[0].first_name,
                    gender: rows[0].gender,
					birth_date: rows[0].birth_date,
					hire_date: rows[0].hire_date
                })
            }            
        })
    })
})
 
// EDIT employee POST ACTION
app.put('/edit/(:emp_no)', function(req, res, next) {
    req.assert('last_name', 'Last name is required').notEmpty()           //Validate name
    req.assert('first_name', 'First name is required').notEmpty()             //Validate age
    req.assert('gender', 'A gender is required').notEmpty()//Validate email
	req.assert('birth_date', 'A birth date is required').notEmpty()//Validate email
	req.assert('hire_date', 'A hire date is required').notEmpty()
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var employee = {
            last_name: req.sanitize('last_name').escape().trim(),
            first_name: req.sanitize('first_name').escape().trim(),
            gender: req.sanitize('gender').escape().trim(),
			birth_date: req.sanitize('birth_date').escape().trim(),
            hire_date: req.sanitize('hire_date').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE employees SET ? WHERE emp_no = ' + req.params.emp_no, employee, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/employee/add.ejs
                    res.render('employee/edit', {
                        title: 'Edit Employee',
                        emp_no: req.params.emp_no, 
						last_name: req.body.last_name,
						first_name: req.body.first_name,
						gender: req.body.gender,
						birth_date: req.body.birth_date,
						hire_date: req.body.hire_date
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/employee/add.ejs
                    res.render('employee/edit', {
                        title: 'Edit Employee',
                        emp_no: req.params.emp_no, 
						last_name: req.body.last_name,
						first_name: req.body.first_name,
						gender: req.body.gender,
						birth_date: req.body.birth_date,
						hire_date: req.body.hire_date
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('employee/edit', { 
            title: 'Edit Employee',            
            emp_no: req.params.emp_no, 
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            gender: req.body.gender,
			birth_date: req.body.birth_date,
			hire_date: req.body.hire_date
        })
    }
})
 
// DELETE EMPLOYEE
app.delete('/delete/(:emp_no)', function(req, res, next) {
    var employee = { emp_no: req.params.emp_no }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM employees WHERE emp_no = ' + req.params.emp_no, employee, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to employees list page
                res.redirect('/employees')
            } else {
                req.flash('success', 'employee deleted successfully! employee no. = ' + req.params.emp_no)
                // redirect to employees list page
                res.redirect('/employees')
            }
        })
    })
})
 
module.exports = app