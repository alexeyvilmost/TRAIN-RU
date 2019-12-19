tickets = openDatabase("tick1", "0.1", "Ya ne debil", 200000);
if (!tickets)
	alert("Cannot open database");

tickets.transaction( function(tx) {
	tx.executeSql("CREATE TABLE tick4 (id INTEGER PRIMARY KEY ASC, train_id TEXT, name TEXT, email TEXT, date TEXT, phone TEXT, id_num TEXT, ticket TEXT, pass_num INTEGER)");
})

function check_pay() {
	let result = prompt("Transaction to payment gate: FILL 'yes', if success");
	if (result === "yes")
	{
		fillDB();
		alert("Ticket bought successfully");
	}
	else
		alert("Pay error, try again");
}

function fillDB() {
	var train_id = document.getElementById('train_form_id').innerHTML;
	var name = document.getElementById('db_name').value;
	var email = document.getElementById('db_email').value;
	var date = document.getElementById('date_pick').value;
	var phone = document.getElementById('db_phone').value;
	var id_num = document.getElementById('db_id_num').value;
	var ticket = document.getElementById('db_ticket').value;
	var pass_num = document.getElementById('db_pass_num').value;

	console.log(train_id + " " + name + " " + email + " " + date + " " + phone);
	tickets.transaction( function(tx) {
		tx.executeSql("INSERT INTO tick4 (train_id, name, email, date, phone, id_num, ticket, pass_num) VALUES(?,?,?,?,?,?,?,?)", 
			[train_id, name, email, date, phone, id_num, ticket, pass_num]);
	})
}

function delete_id(id) {
	tickets.transaction( function(tx) {
		tx.executeSql("DELETE FROM tick4 WHERE ID = ?", [id]);
	});
	showDB();
}

function delete_all() {
	tickets.transaction( function(tx) {
		tx.executeSql("DELETE FROM tick4", []);
	});
	showDB();
}

table = document.createElement('table');

function closeDB() {
	for_table.style = 'display: none;';
}

function showDB() {
	for_table.style = "display: block;";

	tickets.transaction( function(tx) {
		tx.executeSql("SELECT * FROM tick4", [], function(tx, result) {
			
			table.remove();
			table = document.createElement('table');
			table.setAttribute("border", 1);

			let first_row = document.createElement('tr');

			let first_id = document.createElement('td');
			first_id.innerHTML = "Order id";
			first_row.append(first_id);

			let first_train_id = document.createElement('td');
			first_train_id.innerHTML = "Train id";
			first_row.append(first_train_id);

			let first_name = document.createElement('td');
			first_name.innerHTML = "Passanger name";
			first_row.append(first_name);

			let first_email = document.createElement('td');
			first_email.innerHTML = "Passenger email";
			first_row.append(first_email);

			let first_date = document.createElement('td');
			first_date.innerHTML = "Departure date";
			first_row.append(first_date);

			let first_phone = document.createElement('td');
			first_phone.innerHTML = "Passenger phone";
			first_row.append(first_phone);

			let first_id_num = document.createElement('td');
			first_id_num.innerHTML = "Identificator number";
			first_row.append(first_id_num);

			let first_ticket = document.createElement('td');
			first_ticket.innerHTML = "Ticket type";
			first_row.append(first_ticket);

			let first_pass_num = document.createElement('td');
			first_pass_num.innerHTML = "Number of passengers";
			first_row.append(first_pass_num);

			let first_button_td = document.createElement('td');
			let first_button = document.createElement('input');
				first_button.setAttribute("type", "button");
				first_button.setAttribute("value", "DELETE ALL");
				first_button.setAttribute("onclick", "delete_all();");
				first_button_td.append(first_button);
			first_row.append(first_button_td);

			table.append(first_row);

			for (var i = 0; i < result.rows.length; i++)
			{
				let current = result.rows.item(i);

				let row = document.createElement('tr');

				let id = document.createElement('td');
				id.innerHTML = current['id'];
				row.append(id);

				let train_id = document.createElement('td');
				train_id.innerHTML = current['train_id'];
				row.append(train_id);

				let name = document.createElement('td');
				name.innerHTML = current['name'];
				row.append(name);

				let email = document.createElement('td');
				email.innerHTML = current['email'];
				row.append(email);

				let date = document.createElement('td');
				date.innerHTML = current['date'];
				row.append(date);

				let phone = document.createElement('td');
				phone.innerHTML = current['phone'];
				row.append(phone);

				let id_num = document.createElement('td');
				id_num.innerHTML = current['id_num'];
				row.append(id_num);

				let ticket = document.createElement('td');
				ticket.innerHTML = current['ticket'];
				row.append(ticket);

				let pass_num = document.createElement('td');
				pass_num.innerHTML = current['pass_num'];
				row.append(pass_num);

				let button_td = document.createElement('td');
				button_td.setAttribute("border", 0);
				let elem_button = document.createElement('input');
				elem_button.setAttribute("type", "button");
				elem_button.setAttribute("value", "DELETE");
				elem_button.setAttribute("onclick", "delete_id(" + current['id'] + ");");
				button_td.append(elem_button);

				row.append(button_td);

				table.append(row);
			}

			for_table.append(table);
		})
	})
}