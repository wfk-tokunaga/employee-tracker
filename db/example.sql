SELECT e.first_name, e.last_name, r.title AS role, d.name AS department, manager.last_name AS manager  
FROM employees AS e 
LEFT JOIN roles AS r ON e.role_id = r.id
LEFT JOIN employees AS manager ON e.manager_id = manager.id
LEFT JOIN departments AS d ON r.department_id = d.id;