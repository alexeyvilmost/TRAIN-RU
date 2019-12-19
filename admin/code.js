var clicks = 0;
var showpast = 1;

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
			[fromTime, travelTime, fromTime + travelTime, direction], console.log("Insertion success"), console.log("Insertion failed"));
	});
	showTimeTable(0);
}

last = document.createElement('div');

function autoAdd()
{
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

function showTimeTable(mode, request = null)
{
	var showed = 0;
	console.log("I'm here");
	timetable.init.db.transaction(function (tx) {
		if (last)
			last.remove();
		last = document.createElement('div');
		document.getElementById('not_found').style = "display: none;";
		TableDB.append(last);
		if (!request) request = "SELECT * FROM final1";
		request += " ORDER BY from_time";
		tx.executeSql(request, [], function(tx, result) {
			for (var i = 0; i < result.rows.length; i++)
			{
				let current = result.rows.item(i);
				let entry = document.createElement('block');
				last.append(entry);

				let timefrom = document.createElement('blocktimefrom');
				let hourfrom = Math.floor(current['from_time'] / 60);
				let minsfrom = current['from_time'] % 60;
				if (hourfrom < 10) hourfrom = "0" + hourfrom;
				if (minsfrom < 10) minsfrom = "0" + minsfrom;
				let fst_tf = document.createElement('fst');
				let sec_tf = document.createElement('sec');

				let new_date = new Date();
				let past = 0;
				if (mode == 1 && ((hourfrom < new_date.getHours() || (hourfrom == new_date.getHours() && minsfrom < new_date.getMinutes()))
					&& (!document.getElementById('date_pick').value) || document.getElementById('date_pick').valueAsNumber < new_date))
				{
					entry.setAttribute("style", "opacity: 0.5;")
					past = 1;
				}
				if (past && !showpast)
				{
					entry.remove();
					continue;
				}
				fst_tf.innerHTML = hourfrom + " ";
				sec_tf.innerHTML = minsfrom;
				timefrom.append(fst_tf);
				timefrom.append(sec_tf);
				entry.append(timefrom);

				let contrain = document.createElement('div');
				contrain.setAttribute("class", "cont_train");
					
					// direction parser
					let direction = document.createElement('blockdirection');
					let dir_cont = current['direction'];
					let dir_fst = document.createElement('fst');
					dir_fst.innerHTML = dir_cont;
					direction.append(dir_fst);
					contrain.append(direction);

					// travel time parser
					let traveltime = document.createElement('blocktraveltime');
					let travel_sec = document.createElement('sec');
					travel_sec.innerHTML = Math.floor(current['travel_time'] / 60) + "h " + (current['travel_time'] % 60) + "m";
					traveltime.append(travel_sec);
					contrain.append(traveltime);

					let lin = document.createElement('div');
					lin.setAttribute("class", "line");
					contrain.append(lin);

				entry.append(contrain);

				//arrival time parser
				let timeto = document.createElement('blocktimeto');
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
				
				if (past) butt.setAttribute("disabled", "disabled");

				if (mode == 1) 
				{
					butt.setAttribute("value", "BUY TICKET");
					butt.setAttribute("onClick", "open_form(" + current['id'] + ");");
				}
				else 
				{
					butt.setAttribute("value", "DELETE");
					butt.setAttribute("onClick", "deleteOne(" + current['id'] + ");");
				}

				console.log(entry);
				showed++;
			}
			if (showed == 0)
				document.getElementById('not_found').style = "display: default;";
		})
	})
}

function deleteOne(index) {
	timetable.init.db.transaction(function (tx) {
		tx.executeSql("DELETE FROM final1 WHERE ID = ?", [index]);
	});
	showTimeTable(0);
}

function deleteAll() {
	timetable.init.db.transaction(function (tx) {
		tx.executeSql("DELETE FROM final1");
	})
	showTimeTable(0);
}

function ctoi(input_char) { return input_char.charCodeAt() - 48;}

function timeToNum(input_time)
{
	var ret = 0;
	console.log("I'm working, input - " + input_time);
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

