var clicks = 0;
var showpast = 1;

function change_form() {
	clicks++;
	if (clicks % 2 == 1)
	{
		document.getElementById("filter").style = "display: none";
		document.getElementById("addit").style = "display: default";
		showTimeTable(0);
	}
	else
	{
		document.getElementById("filter").style = "display: default";
		document.getElementById("addit").style = "display: none";
		showTimeTable(1);
	}
}

timetable = {}
timetable.init = {}
timetable.init.db = openDatabase("Timetable", "1.0", "Timetable that contains all route info", 200000);
if (!timetable.init.db) alert("Failed to create database");

timetable.init.db.transaction (function (tx) {
		tx.executeSql("CREATE TABLE final1 (id INTEGER PRIMARY KEY ASC, from_time INTEGER, travel_time INTEGER, to_time INTEGER, direction TEXT)");
});

timetable.init.add = function (direction, fromTime, travelTime) {
	var database = timetable.init.db;

	database.transaction (function (tx) {
		tx.executeSql("INSERT INTO final1 (from_time, travel_time, to_time, direction) VALUES (?,?,?,?)", 
			[fromTime, travelTime, fromTime + travelTime, direction]);
	});
	showTimeTable(0);
}

last = document.createElement('div');

function direction_fill_main() {
	timetable.init.db.transaction( function(tx) {
		tx.executeSql("SELECT DISTINCT direction FROM final1", [], function(tx, result) {
			for (var i = 0; i < result.rows.length; i++)
			{
				let current = result.rows.item(i)['direction'];
				let opt = document.createElement('option');
				opt.setAttribute("value", current);
				opt.innerHTML = current;
				main_select.append(opt);
			}
		})
	})
}

function direction_fill_temp() {
	timetable.init.db.transaction( function(tx) {
		tx.executeSql("SELECT DISTINCT direction FROM final1", [], function(tx, result) {
			for (var i = 0; i < result.rows.length; i++)
			{
				let current = result.rows.item(i)['direction'];
				let opt = document.createElement('option');
				opt.setAttribute("value", current);
				opt.innerHTML = current;
				template_select.append(opt);
			}
		})
	})
}

function autoAdd()
{
	if (clicks % 2 == 0)
		return;
	timetable.init.add("MOSCOW - ST PETERSBURG", timeToNum("09:31"), timeToNum("06:20"));
	timetable.init.add("MOSCOW - ST PETERSBURG", timeToNum("12:23"), timeToNum("06:12"));
	timetable.init.add("MOSCOW - ST PETERSBURG", timeToNum("15:40"), timeToNum("06:31"));
	timetable.init.add("MOSCOW - ST PETERSBURG", timeToNum("19:03"), timeToNum("06:21"));
	timetable.init.add("MOSCOW - VOLGOGRAD", timeToNum("03:24"), timeToNum("14:36"));
	timetable.init.add("MOSCOW - VOLGOGRAD", timeToNum("04:11"), timeToNum("14:41"));
	timetable.init.add("MOSCOW - VOLGOGRAD", timeToNum("05:29"), timeToNum("14:45"));
	timetable.init.add("MOSCOW - VOLGOGRAD", timeToNum("06:03"), timeToNum("14:42"));
	timetable.init.add("MOSCOW - TULA", timeToNum("10:36"), timeToNum("01:37"));
	timetable.init.add("MOSCOW - TULA", timeToNum("13:12"), timeToNum("01:29"));
	timetable.init.add("MOSCOW - TULA", timeToNum("16:02"), timeToNum("01:41"));
	timetable.init.add("MOSCOW - TULA", timeToNum("18:33"), timeToNum("01:33"));
	timetable.init.add("TULA - VLADIMIR", timeToNum("07:15"), timeToNum("03:25"));
	timetable.init.add("TULA - VLADIMIR", timeToNum("08:41"), timeToNum("03:19"));
	timetable.init.add("TULA - VLADIMIR", timeToNum("11:34"), timeToNum("03:24"));
	timetable.init.add("TULA - VLADIMIR", timeToNum("14:26"), timeToNum("03:31"));
	timetable.init.add("RYAZAN - ZHELEZKA", timeToNum("02:31"), timeToNum("01:43"));
	showTimeTable(0);
}

function makeRequest() {
	var request = "SELECT * FROM final1";

	train_block.setAttribute("style", "display: block");
	filter_bar.setAttribute("style", "display: block");
	big_logo.style = "display: none";
	pdir.setAttribute("style", "opacity: 100%; text-decoration: underline;");
	ptrain.setAttribute("style", "opacity: 100%; color: white;");
	pdirt.innerHTML = "";

	var a = document.createElement('a');
	a.setAttribute("href", "template.html");
	a.innerHTML = "Direction choosen";
	pdirt.append(a);

	var conditions = new Array();
	if (document.getElementById('template_select').value != "ALL")
		conditions.push("direction = \"" + document.getElementById('template_select').value + "\"");
	if (document.getElementById('min_time_from').value)
	{
		var fromTime = timeToNum(document.getElementById('min_time_from').value);
		conditions.push("from_time > " + fromTime);
	}
	if (document.getElementById('max_time_from').value)
	{
		var toTime = timeToNum(document.getElementById('max_time_from').value);
		conditions.push("from_time < " + toTime);
	}
	if (document.getElementById('min_time_to').value)
	{
		var fromTime = timeToNum(document.getElementById('min_time_to').value);
		conditions.push("to_time > " + fromTime);
	}
	if (document.getElementById('max_time_to').value)
	{
		var toTime = timeToNum(document.getElementById('max_time_to').value);
		conditions.push("to_time < " + toTime);
	}
	if (document.getElementById('min_time_travel').value)
	{
		var fromTime = timeToNum(document.getElementById('min_time_travel').value);
		conditions.push("travel_time > " + fromTime);
	}
	if (document.getElementById('max_time_travel').value)
	{
		var toTime = timeToNum(document.getElementById('max_time_travel').value);
		conditions.push("travel_time < " + toTime);
	}
	if (conditions.length == 0)
	{
		showTimeTable(1);
		return;
	}
	request += " WHERE";
	for (var i = 0; i < conditions.length; i++)
	{
		request += " " + conditions[i];
		if (i != conditions.length - 1)
			request += " AND";
	}
	showTimeTable(1, request);
}

out_id = document.createElement('sec');
out_id.setAttribute("id", "train_form_id");
out_direction = document.createElement('fst');
out_time = document.createElement('fst');
out_date = document.createElement('fst');

function closeBuyForm()
{
	document.getElementById('buy_form').style = "display: none;";
	document.getElementById('TableDB').style = "display: block";
	document.getElementById('train_mode').style = "display: block";
	document.getElementById('buy_mode').style = "display: none";
	ppas.style = "opacity: 50%; color: black;";
	ptrain.style = "text-decoration: none; color: white; opacity: 100%;";
	ptraint.innerHTML = "Choose train";
	ptrain.setAttribute("onClick", "");
}


function open_form(id)
{
	document.getElementById('buy_form').style = "display: block;";
	document.getElementById('TableDB').style = "display: none";
	document.getElementById('buy_mode').style = "display: block";
	ppas.style = "opacity: 100%; color: white;";
	ptrain.style = "text-decoration: underline; color: white; opacity: 100%;";
	ptraint.innerHTML = "Train choosen";
	ptrain.setAttribute("onClick", "closeBuyForm(); to_train();");
	
	timetable.init.db.transaction( function (tx) {
		tx.executeSql("SELECT * FROM final1 WHERE id = ?", [id], function(tx, result) {
			if (result.rows.length != 1)
			{
				alert("Error happen");
				return;
			}
			let current = result.rows.item(0);
			let hourfrom = Math.floor(current['from_time'] / 60);
			let minsfrom = current['from_time'] % 60;
			if (minsfrom < 10) minsfrom = "0" + minsfrom;
			out_id.innerHTML = " #" + current['id'];
			out_direction.innerHTML = current['direction'];
			if (document.getElementById('date_pick').value)
				out_date.innerHTML = document.getElementById('date_pick').value;
			else
			{
				let temp_date = new Date();
				out_date.innerHTML = temp_date.toLocaleDateString();
			}
			out_time.innerHTML = hourfrom + ":" + minsfrom;

			TRAIN_id.append(out_id);
			TRAIN_direction.append(out_direction);
			TRAIN_date.append(out_date);
			TRAIN_time.append(out_time);
		});
	});
}

function admin_mode() {
	let result = prompt("Enter password to switch admin mode");
	if (result === "password")
		window.location.href = "../admin/site.html";
}

function newTab() {
	window.location.href = "html/template.html";
	template_select.value = main_select.value;
	alert(main_select.value);
	date_pick.value = main_date.value;
	alert(main_date.value);
	showTimeTable(1);
}

function date_pick_today()
{
	var today = new Date();
	date_pick.setAttribute("value", (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()));
	date_pick.setAttribute("min", (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()));
}

function showTimeTable(mode, request = null)
{
	var showed = 0;
	timetable.init.db.transaction(function (tx) {
		if (last)
			last.remove();
		last = document.createElement('div');
		// document.getElementById('not_found').style = "display: none;";
		shown = new Array();
		TableDB.append(last);
		if (!request) request = "SELECT * FROM final1";
		request += " ORDER BY from_time";
		tx.executeSql(request, [], function(tx, result) {
			for (var i = 0; i < result.rows.length; i++)
			{
				let current = result.rows.item(i);
				let entry = document.createElement('div');
				entry.setAttribute('class', 'block');

				let timefrom = document.createElement('div');
				timefrom.setAttribute('class', 'out_tfrom');
				let hourfrom = Math.floor(current['from_time'] / 60);
				let minsfrom = current['from_time'] % 60;
				if (hourfrom < 10) hourfrom = "0" + hourfrom;
				if (minsfrom < 10) minsfrom = "0" + minsfrom;
				let fst_tf = document.createElement('fst');
				let sec_tf = document.createElement('sec');

				let new_date = new Date();
				let past = 0;
				if ((hourfrom < new_date.getHours() || (hourfrom == new_date.getHours() && minsfrom < new_date.getMinutes()))
					&& ((document.getElementById('date_pick').valueAsNumber + current['from_time']) < new_date.getTime()))
				{
					entry.setAttribute("style", "opacity: 0.5;")
					past = 1;
				}
				fst_tf.innerHTML = hourfrom + " ";
				sec_tf.innerHTML = minsfrom;
				timefrom.append(fst_tf);
				timefrom.append(sec_tf);
				entry.append(timefrom);

				let contrain = document.createElement('div');
				contrain.setAttribute("class", "out_info");
					
					// direction parser
					let direction = document.createElement('div');
					direction.setAttribute('class', 'out_direction');
					let dir_cont = current['direction'];
					let dir_fst = document.createElement('fst');
					dir_fst.innerHTML = dir_cont;
					direction.append(dir_fst);
					contrain.append(direction);

					// travel time parser
					let traveltime = document.createElement('div');
					traveltime.setAttribute('class', 'out_travel');
					let travel_sec = document.createElement('sec');
					travel_sec.innerHTML = Math.floor(current['travel_time'] / 60) + "h " + (current['travel_time'] % 60) + "m";
					traveltime.append(travel_sec);
					contrain.append(traveltime);

				entry.append(contrain);

				//arrival time parser
				let timeto = document.createElement('div');
				timeto.setAttribute('class', 'out_tto');
				let minsto = current['to_time'] % 60;
				let hourto = Math.floor(current['to_time'] / 60);
				if (minsto >= 60)
				{
					minsto %= 60;
					hourto++;
				}
				if (hourto >= 24) hourto %= 24;
				if (hourto < 10) hourto = "0" + hourto;
				if (minsto < 10) minsto = "0" + minsto;
				let fst_tt = document.createElement('fst');
				let sec_tt = document.createElement('sec');
				fst_tt.innerHTML = hourto + " ";
				sec_tt.innerHTML = minsto;
				timeto.append(fst_tt);
				timeto.append(sec_tt);
				entry.append(timeto);

				let butt = document.createElement('input');
				butt.setAttribute("type", "button");
				butt.setAttribute("class", "buybutton");
				butt.setAttribute("id", "showb" + current['id']);
				entry.append(butt);
				
				if (past)
				{ 
					butt.setAttribute("disabled", "disabled");
					butt.setAttribute("value", "Train left");
				}
				else
					butt.setAttribute("value", "Buy ticket");
				butt.setAttribute("onClick", "open_form(" + current['id'] + "); to_buy();");

				shown.push(entry);
				if (past && shown.length > document.getElementById("max_shown").value)
					shown.shift();
			}
			if (shown.length == 0)
				document.getElementById('not_found').style = "display: default;";
			for (var i = 0; i < shown.length; i++)
			{
				last.append(shown[i]);
				console.log(shown[i]);
			}
		})
	})
}

function deleteOne(index) {
	timetable.init.db.transaction(function (tx) {
		tx.executeSql("DELETE FROM final1 WHERE ID = ?", [index]);
	});
	showTimeTable(0);
}

function ctoi(input_char) { return input_char.charCodeAt() - 48;}

function timeToNum(input_time)
{
	var ret = 0;
	var hr1 = input_time[0].charCodeAt() - 48;
	var hr2 = input_time[1].charCodeAt() - 48;
	var mn1 = input_time[3].charCodeAt() - 48;
	var mn2 = input_time[4].charCodeAt() - 48;
	if (hr1 == 2 && hr2 > 3)
		throw 'Wrong time format';
	ret = (hr1 * 10 + hr2) * 60 + (mn1 * 10 + mn2);
	return ret;
}

function getData()
{
	direction = document.getElementById("direction").value;
	 try {
		fromTime = timeToNum(document.getElementById("fromTime").value);
		travelTime = timeToNum(document.getElementById("travelTime").value);
		timetable.init.add(direction, fromTime, travelTime);
		alert("Route added successfully");
	 } catch (e) {
	 	alert("Wrong time format, try again");
	 }
}

