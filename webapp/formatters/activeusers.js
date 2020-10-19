jQuery.sap.declare("ns.UserDetails.formatter.activeusers");
ns.UserDetails.formatter.activeusers = {
	dateFormatter: function (value) {
		if (value) {

			// var oLocDate = new Date(Number(value.substr(6, 13)));
			var oLocDate = value;
			var oMonthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var yyyy = oLocDate.getFullYear().toString();
			var mmm = oMonthArr[oLocDate.getMonth()];
			var dd = oLocDate.getDate();
			if (dd < 10) {
				dd = "0" + dd.toString();
			}
			var dateString = mmm + " " + dd + ", " + yyyy;
			//var oTime = oValue.substring(11);
			//var hh = oValue.split(":");
			// var hh = oLocDate.getHours();
			// var mm = oLocDate.getMinutes();
			// var ss = oLocDate.getSeconds();
			// var meridian = "AM";
			// if (hh >= 12) {
			// 	meridian = "PM";
			// 	if (hh > 12) {
			// 		hh = hh - 12;
			// 	}
			// }
			// if (hh < 10) {
			// 	hh = "0" + hh;
			// }
			return dateString;
			// var oTime = dateString;
			// // + " " + hh + ":" + mm + ":" + ss + " "
			// return oTime + " " + meridian;
		}
	},

	activeUsers: function (value) {
		if (value) {
			// var oLocDate = new Date(Number(value.substr(6, 13)));
			var oLocDate = value;

			var dateOffset = (24 * 60 * 60 * 1000) * 90;
			var myDate = new Date();
			myDate.setTime(myDate.getTime() - dateOffset);

			var threemonthsBackdate = new Date(myDate);
			if (threemonthsBackdate < oLocDate) {
				return "active";
			} else {
				return "in active";
			}
		}
	}

};