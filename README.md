📜This is my small human resource management personal project (backend API).

🖥Dev with MongoDB + nodejs ( express, mongodb, bcryppt, jsonwebtoken, dotenv, cors, body-parser, nodemon )

🕹Function:
	
	💿Nodejs:
 	
		🧑🏻‍💼Employees( master data ): CRUD ( create, read, update, delete ) + some functions to get employee information.
		🧑🏻‍💼Positions: CRUD ( create, read, update, delete ) + some functions to get positions of employees.
            🧑🏻‍💼Department: CRUD ( create, read, update, delete ) + some functions to get department of employees.
            🧑🏻‍💼Employee type: CRUD ( create, read, update, delete ) + some functions to get types of employees.
            🧑🏻‍💼Contact: CRUD ( create, read, update, delete ) + some functions to get employee contract.
            🧑🏻‍💼timekeeping: CRUD ( create, read, update, delete ) + some functions to get timekeeping.
            🧑🏻‍💼Payroll: CRUD ( create, read, update, delete ) + some functions to get payroll.
            🧑🏻‍💼Add & deduct amount: CRUD ( create, read, update, delete ) + some functions to get add-deduct amount.
            🧑🏻‍💼Allowance: CRUD ( create, read, update, delete ) + some functions to get allowance.
            🧑🏻‍💼Allowance monthly: CRUD ( create, read, update, delete ) + some functions to get allowance monthly.
            🧑🏻‍💼BasicSalary: CRUD ( create, read, update, delete ) + some functions to get basic salary.
            🧑🏻‍💼system parameters: CRUD ( create, read, update, delete ) + some functions to get system parameters.
	 	🧑🏻‍💼Accounts: CRUD ( create, read, update, delete ) + json web token ( create token, auth token, renew token ) + login + change password + some functions to get account information.
    	
    💿MongoDB:
		🧑🏻‍💼Database + collection ( validation schema ).
    	🧑🏻‍💼Employees:  ( create, read, update, delete ). 
		🧑🏻‍💼Positions:  ( create, read, update, delete ). 
            🧑🏻‍💼Department: ( create, read, update, delete ). 
            🧑🏻‍💼Employee ( create, read, update, delete ). 
            🧑🏻‍💼Contact: ( create, read, update, delete ). 
            🧑🏻‍💼timekeeping: ( create, read, update, delete ). 
            🧑🏻‍💼Payroll: ( create, read, update, delete ). 
            🧑🏻‍💼Add & deduct amount: ( create, read, update, delete ).
            🧑🏻‍💼Allowance: ( create, read, update, delete ).
            🧑🏻‍💼Allowance monthly: ( create, read, update, delete ).
            🧑🏻‍💼BasicSalary: ( create, read, update, delete ).
            🧑🏻‍💼system parameters: ( create, read, update, delete ).
	 	🧑🏻‍💼Accounts:  ( create, read, update, delete ). 
   
📝Description:

		1.folder databaseConnection: Contains database connection configuration information.
  		2.folder databaseOperation: Contains CRUD for each module (employees, positions, accounts).
    	3.folder databaseBackup: Contains "humanproject" database, you can restore that database.
      	4.folder other: Contains support functions.
        	5.router: Contains all API router ( CRUD for each module ).
	 	6.folder databaseOperations/login/toke: Contains CRUD for json web token ( create token, auth token, renew token ).
   		7.file index.js: Contains server configuration information.

♻️How to use:

		⚫️Step 1: make sure git is installed on your computer.
  		⚫️Step 2: use git to download this project to your computer (use fork first).
    	⚫️Step 3: use npm install to download all dependencies in package.json 
      	⚫️Step 4: test server use index.js ( run syntax "nodemon" or "npx nodemon").
		⚫️Step 5: restore database from folder databaseBackup ( use hrm folder inside ), you can restore database with mongorestore CMD
  			  if you can not restore database with mongoretore you can use CRUD API for each module ( like employee, position, department,...) in folder databaseOperations and run those APIs with postman to auto creating collection.
       	⚫️Step 6: done !!! ( you can use postman to test those APIs )
