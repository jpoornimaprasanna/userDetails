sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ns/UserDetails/formatters/activeusers",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/format/DateFormat"

], function (Controller, formatter, Filter, FilterOperator, JSONModel, DateFormat) {
	"use strict";

	return Controller.extend("ns.UserDetails.controller.Dashboard", {
		formatter: formatter,

		onInit: function () {
			this.getCount();

			this.getView().getModel("userModel").setProperty("/active", []);
			this.getView().getModel("userModel").setProperty("/inactive", []);
			this.getView().getModel("userModel").setProperty("/totalUserValues", []);
			this.getView().getModel("userModel").setProperty("/CopyUser", false);
			// this.getView().getModel("userModel").setProperty("/totalusers", "");
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "graph");
			this.getView().getModel("graph").setProperty("/daily", true);
			this.getView().getModel("graph").setProperty("/weekly", false);
			this.getView().getModel("graph").setProperty("/user", false);
			this.getView().getModel("graph").setProperty("/userweek", false);
			this.getView().getModel("graph").setProperty("/dailydate", "10/13/2020");
			this.getView().getModel("graph").setProperty("/MainCombo", "Daily");
			this.getView().getModel("graph").setProperty("/weekuser", "HANAUSER2");
			this.getView().getModel("graph").setProperty("/weekuserdate", "10/13/2020");
			this.getView().getModel("graph").setProperty("/weeklyuser", "HANAUSER2");
			this.getView().getModel("graph").setProperty("/weeklyuserdate", "10/2020");

			var oModel = new JSONModel();
			this.getView().setModel(oModel, "donut");
			// this.getView().getModel("myModel").setProperty("/monthly", []);
			this.SearchGraph();
		},
		onRadioButtonSelect: function (oEvent) {

			var selectedButton = oEvent.getSource().getSelectedButton().getText();
			if (selectedButton === "Copy User") {
				this.getView().getModel("userModel").setProperty("/CopyUser", true);
			} else {
				this.getView().getModel("userModel").setProperty("/CopyUser", false);
			}
		},

		onComboSelectionChange: function () {

		},

		onCancel: function (oEvent) {
			var myModel = this.getView().getModel("userModel");
			myModel.setProperty("/lastname", "");
			myModel.setProperty("/passCode", "");
			myModel.setProperty("/cityNo", "");
			myModel.setProperty("/city", "");
			myModel.setProperty("/address", "");
			myModel.setProperty("/password", "");
			myModel.setProperty("/user", "");
		},

		onSubmit: function (oEvent) {
			var myModel = this.getView().getModel("userModel");
			var lastName = myModel.getProperty("/lastname");
			var PassCodes = myModel.getProperty("/passCode");
			var PassCode = Number(PassCodes);
			var CityNo = myModel.getProperty("/cityNo");
			var City = myModel.getProperty("/city");
			var Address = myModel.getProperty("/address");
			var password = myModel.getProperty("/password");
			var user = myModel.getProperty("/user");
			var values = this.getView().getModel("userModel").getProperty("/totalUserValues");

			for (var i = 0; i < values.length; i++) {
				if (values[i].Bname === user.toUpperCase()) {
					sap.m.MessageToast.show(" User Already exists. Please Try with different User!!! ");
					return false;
				}
			}

			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);

			var payload = {
				"LASTNAME": lastName,
				"PASScode": PassCode,
				"CITY_NO": CityNo,
				"CITY": City,
				"ADDR_NO": Address,
				"password": password,
				"User": user
			};
			oModel.create("/createUserSet", payload, {
				success: function (oResult) {
					console.log(oResult);
					sap.m.MessageToast.show("Created Successfully");
					this.onCancel();
					payload = {};
					this.getView().getModel("userModel").setProperty("/totalUserValues", []);
					this.getView().getModel("userModel").setProperty("/active", []);
					this.getCount();
					// this.oModel.refresh();
					// this.table.refresh();

				}.bind(this),
				error: function (oError) {
					sap.m.MessageToast.show("Please try again with correct Credentials");
					this.onCancel();
				}.bind(this)
			});
		},

		getCount: function () {
			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);

			oModel.read("/totalUsersSet", {
				success: function (oResult) {
					this.user(oResult);
					var totalUsersArray = this.getView().getModel("userModel").getProperty("/totalUserValues");
					var active = this.getView().getModel("userModel").getProperty("/active");
					var inactive = this.getView().getModel("userModel").getProperty("/inactive");
					// check if the result is a number
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-dd"
					});
					var totalUsers = oResult.results.length;
					var users = oResult.results;
					this.getView().getModel("userModel").setProperty("/totalusers", totalUsers);

					for (var i = 0; i < totalUsers; i++) {
						var str = users[i].Trdat;
						totalUsersArray.push(users[i]);
						if (str !== null) {
							// var date = new Date(Number(str.substr(6, 13)));
							var date = str;
							var dateOffset = (24 * 60 * 60 * 1000) * 90;
							var myDate = new Date();
							myDate.setTime(myDate.getTime() - dateOffset);

							var Activedate = new Date(myDate);
							if (Activedate < date) {
								active.push(users[i]);
								// return "active";
							} else {
								inactive.push(users[i]);
								// return "in active";
							}
						} else {
							inactive.push(users[i]);
						}

					}
					// var model = this.getView().getModel("userModel")

					this.getView().getModel("userModel").setProperty("/totalUserValues", totalUsersArray);
					this.getView().getModel("userModel").setProperty("/inactive", inactive);
					this.getView().getModel("userModel").setProperty("/active", active);
					// this.getView().getModel("userModel").setData(totalUsersArray);
					// if (isNaN(oResult)) {
					// 	var oIntResult = parseInt(oResult);
					// }
				}.bind(this)
			});
		},
		user: function (oResult) {
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "donut1");

			this.getView().getModel("donut1").setSizeLimit(oResult.results.length);
			this.getView().getModel("donut1").setProperty("/users", oResult.results);
		},
		onSearch: function (oEvent) {

			var olist = this.getView().byId("idProductsTable"),
				// this.getView().getModel("userModel").getProperty("username");
				arr = [],
				binding,
				filters;
			filters = new Filter({
				filters: [new Filter("Bname", FilterOperator.Contains, oEvent.getSource().getValue())

				],
				and: false
			});
			binding = olist.getBinding("items");
			arr.push(filters);
			binding.filter(arr);
		},
		onSearchActive: function (oEvent) {
			var olist = this.getView().byId("idActiveTable"),
				// this.getView().getModel("userModel").getProperty("username");
				arr = [],
				binding,
				filters;
			filters = new Filter({
				filters: [new Filter("Bname", FilterOperator.Contains, oEvent.getSource().getValue())

				],
				and: false
			});
			binding = olist.getBinding("items");
			arr.push(filters);
			binding.filter(arr);
		},

		onSearchInActive: function (oEvent) {
			var olist = this.getView().byId("idinActiveTable"),
				// this.getView().getModel("userModel").getProperty("username");
				arr = [],
				binding,
				filters;
			filters = new Filter({
				filters: [new Filter("Bname", FilterOperator.Contains, oEvent.getSource().getValue())

				],
				and: false
			});
			binding = olist.getBinding("items");
			arr.push(filters);
			binding.filter(arr);
		},

		onDelete: function (oEvent) {
			var table = this.getView().byId("idProductsTable");
			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);
			var DeleteUserName = oEvent.getSource().getBindingContext('userModel').getObject().Bname;

			oModel.remove("/createUserSet('" + DeleteUserName + "')", {
				method: "DELETE",
				success: function (data) {
					this.getView().getModel("userModel").setProperty("/totalUserValues", []);
					this.getCount();
					// this.oModel.refresh();

					sap.m.MessageToast.show("User got deleted");
					// this.getView().getModel().setData();
					// this.table.refresh();
				}.bind(this),
				error: function (e) {
					sap.m.MessageToast.show("Not able to delete the User ");
				}.bind(this)
			});

			// oModel.remove("/createUserSet", DeleteUserName, "DELETE" {
			// 	success: function (oResult) {
			// 		console.log("User got Deleted");
			// 	}.bind(this),
			// 	error: function (oError) {

			// 	}.bind(this)

			// });
		},
		SearchGCombo: function (oEvent) {
			if (oEvent.getParameters().value === "Daily") {
				this.getView().getModel("graph").setProperty("/daily", true);
				this.getView().getModel("graph").setProperty("/weekly", false);
				this.getView().getModel("graph").setProperty("/user", false);
				this.getView().getModel("graph").setProperty("/userweek", false);
			} else if (oEvent.getParameters().value === "Weekly") {
				this.getView().getModel("graph").setProperty("/daily", false);
				this.getView().getModel("graph").setProperty("/weekly", true);
				this.getView().getModel("graph").setProperty("/user", false);
				this.getView().getModel("graph").setProperty("/userweek", false);
				this.Searchweek("hi");
			} else if (oEvent.getParameters().value === "Userwise(daily)") {
				this.getView().getModel("graph").setProperty("/daily", false);
				this.getView().getModel("graph").setProperty("/weekly", false);
				this.getView().getModel("graph").setProperty("/user", true);
				this.getView().getModel("graph").setProperty("/userweek", false);
				this.Searchweek("hi");
			} else if (oEvent.getParameters().value === "Monthly") {
				this.getView().getModel("graph").setProperty("/daily", false);
				this.getView().getModel("graph").setProperty("/weekly", false);
				this.getView().getModel("graph").setProperty("/user", false);
				this.getView().getModel("graph").setProperty("/userweek", true);
				this.Searchweek1("hi");
			}

		},
		SearchGraph: function () {
			// var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			// var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			// this.getView().setModel(oModel);

			// oModel.read("/GraphSet", {
			// 	success: function (oResult) {

			// 	}.bind(this) "datetime'2020-10-08T00:00:00'"  
			// });Audituser eq 'HANAUSER2' and Auditdate eq datetime'2020-10-08T00%3A00%3A00'
			// if (oEvent.getParameter("value").split("/").length > 1) {
			// 	var user = this.DefUser,
			// 		date = oEvent.getParameter("value").split("/");
			// } else {
			// 	var user = oEvent.getParameter("value").split("/"),
			// 		date = ;
			// }
			var a = new Filter({
				path: "Auditdate",
				operator: FilterOperator.EQ,
				value1: '%' + new Date(this.getView().byId("DP1").getValue()).getFullYear() + "-" + Number(new Date(this.getView().byId("DP1").getValue())
					.getMonth() + 1) + "-" + Number(new Date(this.getView().byId("DP1").getValue()).getDate() + 1) + '%'
			});
			var b = new Filter({
				path: "Audituser",
				operator: FilterOperator.EQ,
				value1: this.getView().byId("combo").getValue()
			});

			var f = new Array();
			f.push(a);
			f.push(b);
			var mParameters = {
				filters: f, // your Filter Array
				success: function (oData, oResponse) {
					// this.getView().getModel("myModel").getProperty("/daily")
					this.getDate(oData);
				}.bind(this),
				error: function (oError) {

					// console.log("error");
				}
			};
			var oModel10 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZUSERDATA_SRV");
			oModel10.read("/GraphSet", mParameters);
		},
		getDate: function (oData) {
			var LoginTime = null,
				a = [],
				LogutTime = null;
			for (var i = 0; i < oData.results.length; i++) {
				if (oData.results[i].Auditmessage.split(" ")[0] === "Logon" && LoginTime === null) {
					LoginTime = oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7));
				} else if (oData.results[i].Auditmessage.split(" ")[1] === "Logoff" && LoginTime !== null) {
					LogutTime = LoginTime.concat(oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7)));
					a.push(LogutTime);
					LoginTime = null;

					LogutTime = null;
				}
			}
			var totalHour = 0,
				totalMin = 0;
			for (i = 0; i < a.length; i++) {
				var sHour = Number(a[i].slice(0, 2)),
					sMin = Number(a[i].slice(2, 4)),
					eHour = Number(a[i].slice(4, 6)),
					eMin = Number(a[i].slice(6, 8));
				if (sHour === eHour) {
					var hour = 0;
					var min = eMin - sMin;
					totalHour = totalHour + hour;
					totalMin = totalMin + min;
				} else {
					var hour = eHour - 1 - sHour;
					var min = 60 - sMin + eMin;
					totalHour = totalHour + hour;
					totalMin = totalMin + min;
				}
			}
			var addhour = 0;
			for (var i = 0; i < 1000; i++) {
				if (totalMin >= 60) {
					addhour = addhour + 1;
					totalMin = totalMin - 60;
				} else {
					break;
				}
			}
			totalHour = totalHour + addhour;
			totalMin = totalMin;
			var noH = 23 - totalHour,
				noM = 60 - totalMin;
			// var graphTotal = totalHour.concat(totalMin);
			var workhour = (Number(totalHour.toString() + "." + totalMin.toString()) * 100) / 24;
			var nonWork = 100 - workhour;
			this.getView().getModel("donut").setProperty("/a", workhour);
			this.getView().getModel("donut").setProperty("/b", nonWork);
			this.getView().getModel("donut").setProperty("/c", totalHour.toString() + ":" + totalMin.toString());
			this.getView().getModel("donut").setProperty("/d", noH.toString() + ":" + noM.toString());

			// this.getView().getModel("graph").setData(a);
			// var daily = [{
			// 	"time": "0-4",
			// 	"count": "0"
			// }, {
			// 	"time": "4-8",
			// 	"count": "0"
			// }, {
			// 	"time": "8-12",
			// 	"count": "0"
			// }, {
			// 	"time": "12-16",
			// 	"count": "0"
			// }, {
			// 	"time": "16-20",
			// 	"count": "0"
			// }, {
			// 	"time": "20-24",
			// 	"count": "0"
			// }];
			// for (i = 0; i < a.length; i++) {
			// 	var a1 = Number(a[0].slice(0, 2)),
			// 		a2 = Number(a[0].slice(2, 4)),
			// 		b1 = Number(a[0].slice(4, 6)),
			// 		b2 = Number(a[0].slice(6, 8));
			// 	if (4 > a1 > 0 && b1 < 4) {
			// 		var hour = (b1 - 1).toString(),
			// 			minrem = 60 - a2,
			// 			min = (minrem + b2).toString();
			// 		daily[0].count = hour.concat(min);
			// 	} else if (4 > a1 > 0 && b1 > 4) {
			// 		nexthour = b1 - 4;
			// 		for (var i = 1; i < 6; i++) {
			// 			if (nexthour > 4) {

			// 			}
			// 		}
			// 	}
			// }

		},
		Searchweek: function (oEvent) {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZUSERDATA_SRV");

			this.week = [];
			// var date = new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() + 1)
			// 	.getMonth() + 1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 1);
			oModel.setUseBatch(true);
			debugger
			if (this.getView().getModel("graph").getProperty("/MainCombo") === "Weekly") {

				var k = 7,
					year = new Date(this.getView().getModel("graph").getProperty("/weekuserdate")).getFullYear(),
					month = new Date(this.getView().getModel("graph").getProperty("/weekuserdate")).getMonth() + 1,
					date = new Date(this.getView().getModel("graph").getProperty("/weekuserdate")).getDate() + 1,
					endDate = this.getDaysInMonth(month, year);

				for (var i = 0; i < k;) {
					if (date > 31 && month == 12) {
						year++;
						month = 1;
						date = 1;
					} else {
						if (date <= endDate) {
							this.GetData(year + "-" + month + "-" + Number(date), this.getView().byId("combo1").getValue());
							i++;
							date++;
						} else {
							month = month + 1;
							date = 1;
						}
					}
				}
				// } else if (oEvent.getParameter("from").getMonth() === oEvent.getParameter("to").getMonth()) {

				// }
			} else if (this.getView().getModel("graph").getProperty("/MainCombo") === "Userwise(daily)") {
				for (var i = 0; i < this.getView().byId("multicombo").getSelectedItems().length; i++) {
					this.GetData(new Date(this.getView().byId("DP3").getValue()).getFullYear() + "-" + Number(new Date(this.getView().byId("DP3").getValue())
						.getMonth() + 1) + "-" + Number(new Date(this.getView().byId("DP3").getValue()).getDate() + 1), this.getView().byId(
						"multicombo").getSelectedItems()[
						i].getProperty("text"));
				}
			} else if (this.getView().getModel("graph").getProperty("/MainCombo") === "Monthly") {

			}

			var that = this;
			oModel.submitChanges({
				success: function (oData, oResponse) {

				},
				error: function (error, oResponse) {
					MessageBox.alert("batch call failed");
				}
			});
			setTimeout(function () {
				that.getView().getModel("myModel").setProperty("/weekly", that.week);
			}, 3000);

		},
		GetData: function (oEvent, user) {
			var a = new Filter({
				path: "Auditdate",
				operator: FilterOperator.EQ,
				value1: '%' + oEvent + '%'
			});
			var b = new Filter({
				path: "Audituser",
				operator: FilterOperator.EQ,
				value1: user
			});

			var f = new Array();
			f.push(a);
			f.push(b);
			var mParameters = {
				filters: f, // your Filter Array
				success: function (oData, oResponse) {
					this.getDate1(oData, oEvent, user);
				}.bind(this),
				error: function (oError) {

				}
			};
			var oModel10 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZUSERDATA_SRV");
			oModel10.read("/GraphSet", mParameters);
		},
		getDate1: function (oData, oEvent, user) {
			oData.results.sort((a, b) => (a.Audittime > b.Audittime) ? 1 : ((b.Audittime > a.Audittime) ? -1 : 0));
			var LoginTime = oData.results[0].Audittime.slice(2, 4).concat(oData.results[0].Audittime.slice(5, 7)),
				a = [],
				LogutTime = null;

			for (var i = 0; i < oData.results.length; i++) {
				if (oData.results[i].Auditmessage.split(" ")[0] === "Logon" && LoginTime === null) {
					LoginTime = oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7));
				} else if (oData.results[i].Auditmessage.split(" ")[1] === "Logoff" && LoginTime !== null) {
					LogutTime = LoginTime.concat(oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7)));
					a.push(LogutTime);
					LoginTime = null;

					LogutTime = null;
				}
			}
			var totalHour = 0,
				totalMin = 0;
			for (i = 0; i < a.length; i++) {
				var sHour = Number(a[i].slice(0, 2)),
					sMin = Number(a[i].slice(2, 4)),
					eHour = Number(a[i].slice(4, 6)),
					eMin = Number(a[i].slice(6, 8));
				if (sHour === eHour) {
					var hour = 0;
					var min = eMin - sMin;
					totalHour = totalHour + hour;
					totalMin = totalMin + min;
				} else {
					var hour = eHour - 1 - sHour;
					var min = 60 - sMin + eMin;
					totalHour = totalHour + hour;
					totalMin = totalMin + min;
				}
			}
			var addhour = 0;
			for (var i = 0; i < 1000; i++) {
				if (totalMin >= 60) {
					addhour = addhour + 1;
					totalMin = totalMin - 60;
				} else {
					break;
				}
			}
			totalHour = totalHour + addhour;
			totalMin = totalMin;
			if (this.getView().byId("comboUser").getValue() === "Weekly") {
				var oGraph = {
					"date": new Date(oEvent).getFullYear() + "-" + Number(new Date(oEvent).getMonth() + 1) + "-" + Number(new Date(oEvent).getDate() -
						1),
					"count": totalHour + "." + totalMin
				}
			} else if (this.getView().byId("comboUser").getValue() === "Userwise(daily)") {
				var oGraph = {
					"date": user,
					"count": totalHour + "." + totalMin
				}
			}

			this.week.push(oGraph);

		},

		Searchweek1: function () {
			// var a = new Filter({
			// 	path: "Auditdate",
			// 	operator: FilterOperator.EQ,
			// 	value1: '%' + "10/13/2020" + '%'
			// });
			// this.getView().getModel("myModel").setProperty("/monthly", []);
			var b = new Filter({
				path: "Audituser",
				operator: FilterOperator.EQ,
				value1: this.getView().getModel("graph").getProperty("/weeklyuser")
			});

			var f = new Array();
			// f.push(a);
			f.push(b);
			var k = 21,
				date1 = "10/13/2020",

				year = Number(this.getView().getModel("graph").getProperty("/weeklyuserdate").slice(3, 7)),
				month = Number(this.getView().getModel("graph").getProperty("/weeklyuserdate").slice(0, 2)),
				date = 1,
				endDate = this.getDaysInMonth(month, year);

			for (var i = 0; i < endDate; i++) {
				// if (date > 31 && month == 12) {
				// 	year++;
				// 	month = 1;
				// 	date = 1;
				// } else {
				// 	if (date <= endDate) {
				var a = new Filter({
					path: "Auditdate",
					operator: FilterOperator.EQ,
					value1: '%' + year + "-" + month + "-" + Number(date + i) + '%'
				});
				f.push(a);
				// this.GetData(year + "-" + month + "-" + Number(date), this.getView().byId("combo1").getValue());
				// i++;
				// date++;
				// } else {
				// 	month = month + 1;
				// 	date = 1;
				// }
				// }
			}
			var mParameters = {
				filters: f, // your Filter Array
				success: function (oData, oResponse) {
					if (oData.results.length !== 0) {
						oData.results.sort((a, b) => (a.Auditdate > b.Auditdate) ? 1 : ((b.Auditdate > a.Auditdate) ? -1 : 0));
						this.calculater(oData.results, month, year);
						// this.getDate1(oData, oEvent, user);
					} else {
						this.getView().getModel("myModel").setProperty("/monthlytable", []);
						this.getView().getModel("myModel").setProperty("/monthly", []);
					}
				}.bind(this),
				error: function (oError) {

				}
			};

			var oModel10 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZUSERDATA_SRV");
			oModel10.read("/GraphSet", mParameters);
		},
		calculater: function (oData, month, year) {
			var startDate = new Date(oData[0].Auditdate).getDate(),
				endDate = this.getDaysInMonth(month, year),
				TableUser = oData[0].Audituser;
			var model = [];
			// var model = this.getView().getModel("myModel").getProperty("/monthly");
			var finalHour = 0,
				finalmin = 0,
				finalweek = 7,
				displayweek = "0-7";
			var tablehour = 0,
				tableMin = 0;
			while (oData[0].Auditdate <= oData[oData.length - 1].Auditdate) {
				var adatewiseData = oData.filter(obj => {
					return obj.Auditdate === oData[0].Auditdate;
				});
				adatewiseData.sort((a, b) => (a.Audittime > b.Audittime) ? 1 : ((b.Audittime > a.Audittime) ? -1 : 0));
				var LoginTime = adatewiseData[0].Audittime.slice(2, 4).concat(adatewiseData[0].Audittime.slice(5, 7)),
					a = [],
					LogutTime = null;

				for (var i = 0; i < adatewiseData.length; i++) {
					if (adatewiseData[i].Auditmessage.split(" ")[0] === "Logon" && LoginTime === null) {
						LoginTime = adatewiseData[i].Audittime.slice(2, 4).concat(adatewiseData[i].Audittime.slice(5, 7));
					} else if (adatewiseData[i].Auditmessage.split(" ")[1] === "Logoff" && LoginTime !== null) {
						LogutTime = LoginTime.concat(adatewiseData[i].Audittime.slice(2, 4).concat(adatewiseData[i].Audittime.slice(5, 7)));
						a.push(LogutTime);
						LoginTime = null;

						LogutTime = null;
					}
				}
				var totalHour = 0,
					totalMin = 0;
				for (i = 0; i < a.length; i++) {
					var sHour = Number(a[i].slice(0, 2)),
						sMin = Number(a[i].slice(2, 4)),
						eHour = Number(a[i].slice(4, 6)),
						eMin = Number(a[i].slice(6, 8));
					if (sHour === eHour) {
						var hour = 0;
						var min = eMin - sMin;
						totalHour = totalHour + hour;
						totalMin = totalMin + min;
					} else {
						var hour = eHour - 1 - sHour;
						var min = 60 - sMin + eMin;
						totalHour = totalHour + hour;
						totalMin = totalMin + min;
					}
				}
				var addhour = 0;
				for (var i = 0; i < 1000; i++) {
					if (totalMin >= 60) {
						addhour = addhour + 1;
						totalMin = totalMin - 60;
					} else {
						break;
					}
				}
				totalHour = totalHour + addhour;
				totalMin = totalMin;
				var addhour1 = 0;
				tablehour = tablehour + totalHour;
				tableMin = tableMin + totalMin;
				finalmin = finalmin + totalMin;
				finalHour = finalHour + totalHour;
				for (var i = 0; i < 1000; i++) {
					if (finalmin >= 60) {
						addhour1 = addhour1 + 1;
						finalmin = finalmin - 60;
					} else {
						break;
					}
				}
				finalHour = finalHour + addhour1;
				if (new Date(adatewiseData[0].Auditdate).getDate() === finalweek) {
					var obj = {
						date: displayweek,
						count: finalHour + "." + finalmin
					}
					model.push(obj);
					displayweek = finalweek + "-" + Number(finalweek + 7);
					finalweek = finalweek + 7;
					finalmin = 0;
					finalHour = 0;
				}
				oData.splice(0, adatewiseData.length);
				if (oData.length === 0) {
					break;
				}
			}
			// var tablehour=0,tableMin=0;
			var addhour2 = 0;
			this.getView().getModel("myModel").setProperty("/monthly", model);
			for (var i = 0; i < 1000; i++) {
				if (tableMin >= 60) {
					addhour2 = addhour2 + 1;
					tableMin = tableMin - 60;
				} else {
					break;
				}
			}
			tablehour = tablehour + addhour2;
			var object = [{
				"user": TableUser,
				"work": tablehour + "." + tableMin,
				"total": 56.00,
				"month": month + "/" + year
			}]
			this.getView().getModel("myModel").setProperty("/monthlytable", object);
		},
		getDaysInMonth: function (month, year) {
			// Here January is 1 based
			//Day 0 is the last day in the previous month
			return new Date(year, month, 0).getDate();
			// Here January is 0 based
			// return new Date(year, month+1, 0).getDate();
		},

	});
});