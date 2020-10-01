jQuery.sap.declare("ns.UserDetails.formatter.activeusers");
ns.UserDetails.formatter.activeusers = {
	dateFormatter: function (value) {
		if (value !== null && !isNaN(value)) {
			var dd = "";
			var mm = "";
			var yy = "";
			var a = new Date(Number(value));
			var hour = new Date(Number(value)).getUTCHours();
			var Minuts = new Date(1563616058514).getUTCMinutes();
			var seconds = new Date(1563616058514).getUTCSeconds();
			var newvlue = a.toLocaleDateString();
			dd = newvlue.split("/")[0];
			mm = newvlue.split("/")[1];
			yy = newvlue.split("/")[2];
			if (dd < 10) {
				dd = "0" + dd;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			return mm + "-" + dd + "-" + yy + "       " + " " + " " + hour + ":" + Minuts + ":" + seconds;
		}
	},
	activeUsers: function (value) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "yyyy-MM-dd"
		});

		if (value !== null && !isNaN(value)) {
			var dd = "";
			var mm = "";
			var yy = "";
			var a = new Date(Number(value));
			var hour = new Date(Number(value)).getUTCHours();
			var Minuts = new Date(1563616058514).getUTCMinutes();
			var seconds = new Date(1563616058514).getUTCSeconds();
			var newvlue = a.toLocaleDateString();
			dd = newvlue.split("/")[0];
			mm = newvlue.split("/")[1];
			yy = newvlue.split("/")[2];
			if (dd < 10) {
				dd = "0" + dd;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}

		}

		var oDate = new Date();
		oDate.setDate(oDate.getDate());
		var sDate = dateFormat.format(oDate);

		// let last30days = new Date(now.setDate(now.getDate() - 30))

		var stringYear = sDate.substr(0, 4);
		var stringMonth = sDate.substr(5, 2);
		var stringDate = sDate.substr(6, 2);
		var currentyear = Number(stringYear);
		var currentmonth = Number(stringMonth);
		// var currentdate = Number(stringDate);
		var preYear = Number(yy);
		if (preYear < currentyear) {
			var diff = currentyear - yy;
			if (diff > 1) {

				return "inactive";
			} else if (diff === 0) {
				var months = currentmonth - mm;
				if (months <= 3) {
					return "active";
				} else return "in active";
			}
		}
		if (preYear === currentyear) {

			var dateOffset = (24 * 60 * 60 * 1000) * 90;
			var myDate = new Date();
			myDate.setTime(myDate.getTime() - dateOffset);

			var date = new Date(myDate);
			if (date < value) {
				return "active";
			} else {
				return "in active";
			}

		}

	}

};