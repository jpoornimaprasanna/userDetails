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
			this.getView().getModel("userModel").setProperty("/createUserVisible", true);
			this.getView().getModel("userModel").setProperty("/copyUserVisible", false);
			// this.getView().getModel("userModel").setProperty("/totalusers", "");
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "graph");
			this.getView().getModel("graph").setProperty("/daily", true);
			this.getView().getModel("graph").setProperty("/weekly", false);
			this.getView().getModel("graph").setProperty("/user", false);
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "donut");
			this.SearchGraph();
		},
		onRadioButtonSelect: function (oEvent) {
			var oModel = this.getView().getModel("userModel");
			var selectedButton = oEvent.getSource().getSelectedButton().getText();
			if (selectedButton === "Copy User") {
				oModel.setProperty("/CopyUser", true);
				oModel.setProperty("/createUserVisible", false);
				oModel.setProperty("/copyUserVisible", true);
			} else {
				this.getView().byId("IdComoBox").setValue("");
				oModel.setProperty("/CopyUser", false);
				oModel.setProperty("/createUserVisible", true);
				oModel.setProperty("/copyUserVisible", false);

				oModel.setProperty("/updateUsers/User", "");
				oModel.setProperty("/updateUsers/LASTNAME", "");
				oModel.setProperty("/updateUsers/password", "");
				oModel.setProperty("/updateUsers/PASScode", "");
				oModel.setProperty("/updateUsers/ADDR_NO", "");

			}
		},

		onComboSelectionChange: function (oEvent) {
			
			var comboBoxVal = oEvent.getSource().getValue();
			this.getView().getModel("userModel").setProperty("selectedComboValue", comboBoxVal);
			var oModel = this.getOwnerComponent().getModel();
			// oModel2.read("/EmployeeInfoSet('" + oArg + "')", {
			oModel.read("/createUserSet('" + comboBoxVal + "')", {
				success: function (oResult) {
					this.getView().getModel("userModel").setProperty("/updateUsers", oResult);

				}.bind(this),

			});

			// var sPath = oEvent.getSource().getSelectedItem().oBindingContexts.userModel.sPath;

			// var form = this.getView().byId("SimpleFormDisplay354");
			// var users = this.getView().getModel("userModel").getProperty(sPath);

			// form.bindElement("userModel>" + sPath);

		},

		onCancel: function (oEvent) {
			var myModel = this.getView().getModel("userModel");
			myModel.setProperty("/lastname", "");
			myModel.setProperty("/passCode", "");
			// myModel.setProperty("/cityNo", "");
			// myModel.setProperty("/city", "");
			myModel.setProperty("/address", "");
			myModel.setProperty("/password", "");

			myModel.setProperty("/updateUsers/User", "");
			myModel.setProperty("/updateUsers/LASTNAME", "");
			myModel.setProperty("/updateUsers/PASScode", "");
			myModel.setProperty("/updateUsers/ADDR_NO", "");
			myModel.setProperty("/updateUsers/password", "");

		},

		onSubmit: function (oEvent) {
			

			var myModel = this.getView().getModel("userModel");
			var lastName = myModel.getProperty("/lastname");
			var PassCodes = myModel.getProperty("/passCode");
			var PassCode = Number(PassCodes);
			var Address = myModel.getProperty("/address");
			var password = myModel.getProperty("/password");

			var copyUser = myModel.getProperty("/CopyUser");

			var cLastName = myModel.getProperty("/updateUsers/LASTNAME");
			var cPassCodes = myModel.getProperty("/updateUsers/PASScode");
			var cPassCode = Number(cPassCodes);
			var cAddress = myModel.getProperty("/updateUsers/ADDR_NO");
			var cPassword = myModel.getProperty("/updateUsers/password");
			// var selComboVal = this.getView().getModel("userModel").getProperty("selectedComboValue");
			if (copyUser !== true && copyUser !== undefined) {
				var user = myModel.getProperty("/Bname").toUpperCase();
			} else if (copyUser !== undefined) {
				var user = this.getView().byId("IdComoBox").getValue().toUpperCase();
			}

			if (copyUser === true) {
				var payload = {
					"LASTNAME": cLastName,
					"PASScode": cPassCode,
					"ADDR_NO": cAddress,
					"password": cPassword,
					"User": user
				};
			} else {
				var payload = {
					"LASTNAME": lastName,
					"PASScode": PassCode,
					"ADDR_NO": Address,
					"password": password,
					"User": user
				};
			}

			var values = this.getView().getModel("userModel").getProperty("/totalUserValues");
			if (copyUser !== true) {
				for (var i = 0; i < values.length; i++) {
					if (values[i].Bname === user) {
						console.log(values[i].Bname);
						sap.m.MessageToast.show(" User Already exists. Please Try with different User!!! ");
						return false;
					}
				}
			}
			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);
			// "CITY_NO": CityNo,
			// "CITY": City,
			if (copyUser !== true) {
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
			} else {
				oModel.update("/createUserSet('" + user + "')", payload, {
					success: function (oResult) {
						sap.m.MessageToast.show("User Updated Successfully");
						this.onCancel();
						payload = {};
						// this.getView().getModel("userModel").setProperty("/totalUserValues", []);
						// this.getView().getModel("userModel").setProperty("/active", []);
						// this.getCount();
					}.bind(this),
					error: function () {
						sap.m.MessageToast.show("Please try again ");
						this.onCancel();
					}

				});

			}
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
					this.getView().getModel("userModel").setSizeLimit(totalUsersArray.length);
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
			binding = olist.getBinding("rows");
			binding.filter(filters);
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

		// onRowSelect: function(oEvent){

		// var rowContext =	oEvent.getParameter("rowContext");
		// this.oRowSelectionContext.push(rowContext);
		// console.log(this.oRowSelectionContext);
		// },
		onDelete: function (oEvent) {
			
			var table = this.getView().byId("idProductsTable");
			var selectedIndexes = table.getSelectedIndices();
			// 	var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			// var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			// this.getView().setModel(oModel);

			var oModel = this.getOwnerComponent().getModel();

			oModel.setUseBatch(true);
			// var DeleteUserName = oEvent.getSource().getBindingContext('userModel').getObject().Bname;
			// this.getView().getModel("userModel").setProperty("/", []);
			for (let i = 0; i < selectedIndexes.length; i++) {

				let sPath = table._getRowContexts()[table.getSelectedIndices()[i]].sPath;

				let DeleteUserName = this.getView().getModel("userModel").getProperty(sPath).Bname.toUpperCase();

				oModel.remove("/createUserSet('" + DeleteUserName + "')", {
					method: "DELETE",
					success: function (data) {
						this.getView().getModel("userModel").setProperty("/totalUserValues", []);
						this.getView().getModel("userModel").setProperty("/active", []);
						this.getCount();
						// this.oModel.refresh();
						sap.m.MessageToast.show("User got deleted");
						table.rerender();

						// alert("oipi");
						// this.getView().getModel().setData();
						oModel.refresh();
					}.bind(this),
					error: function (e) {
						sap.m.MessageToast.show("Not able to delete the User ");
					}.bind(this)
				});
			}

			oModel.submitChanges({
				success: function (oData, oResponse) {
					// sap.m.MessageToast.show("batch creation Done");
					console.log("batch creation Done")
				},
				error: function (error, oResponse) {
					sap.m.MessageToast.show("batch call failed");
				}

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
			} else if (oEvent.getParameters().value === "Weekly") {
				this.getView().getModel("graph").setProperty("/daily", false);
				this.getView().getModel("graph").setProperty("/weekly", true);
				this.getView().getModel("graph").setProperty("/user", false);
				this.Searchweek("hi");
			} else if (oEvent.getParameters().value === "Userwise") {
				this.getView().getModel("graph").setProperty("/daily", false);
				this.getView().getModel("graph").setProperty("/weekly", false);
				this.getView().getModel("graph").setProperty("/user", true);
				this.Searchweek("hi");
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
			let oModel = this.getOwnerComponent().getModel();

			this.week = [];
			// var date = new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() + 1)
			// 	.getMonth() + 1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 1);
			oModel.setUseBatch(true);
			debugger
			if (this.getView().byId("comboUser").getValue() === "Weekly") {
				// if (oEvent.getParameter("from").getMonth() === oEvent.getParameter("to").getMonth()) {
				// var k = 1;
				for (var i = 1; i <= 7; i++) {
					this.GetData(new Date(this.getView().byId("DP2").getValue()).getFullYear() + "-" + Number(new Date(this.getView().byId("DP2").getValue())
						.getMonth() + 1) + "-" + Number(new Date(this.getView().byId("DP2").getValue()).getDate() + i), this.getView().byId("combo1").getValue());

				}
				// } else if (oEvent.getParameter("from").getMonth() === oEvent.getParameter("to").getMonth()) {

				// }
			} else if (this.getView().byId("comboUser").getValue() === "Userwise") {
				for (var i = 0; i < this.getView().byId("multicombo").getSelectedItems().length; i++) {
					this.GetData(new Date(this.getView().byId("DP3").getValue()).getFullYear() + "-" + Number(new Date(this.getView().byId("DP3").getValue())
						.getMonth() + 1) + "-" + Number(new Date(this.getView().byId("DP3").getValue()).getDate()), this.getView().byId("multicombo").getSelectedItems()[
						i].getProperty("text"));
				}
			}
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 1));
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 2));
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 3));
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 4));
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 5));
			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 6));

			// this.GetData(new Date(oEvent.getParameter("from")).getFullYear() + "-" + Number(new Date(oEvent.getParameter("from")).getMonth() +
			// 	1) + "-" + Number(new Date(oEvent.getParameter("from")).getDate() + 7));
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
			if (this.getView().byId("comboUser").getValue() === "Weekly") {
				var a = {
					"date": oEvent,
					"count": totalHour + "." + totalMin
				}
			} else if (this.getView().byId("comboUser").getValue() === "Userwise") {
				var a = {
					"date": user,
					"count": totalHour + "." + totalMin
				}
			}

			this.week.push(a);
			// 

			// var noH = 23 - totalHour,
			// 	noM = 60 - totalMin;
			// var graphTotal = totalHour.concat(totalMin);
			// var workhour = (Number(totalHour.toString() + "." + totalMin.toString()) * 100) / 24;
			// var nonWork = 100 - workhour;
			// this.getView().getModel("donut").setProperty("/a", workhour);
			// this.getView().getModel("donut").setProperty("/b", nonWork);
			// this.getView().getModel("donut").setProperty("/c", totalHour.toString() + ":" + totalMin.toString());
			// this.getView().getModel("donut").setProperty("/d", noH.toString() + ":" + noM.toString());

		},
		onPressActive: function (oEvent) {
			var oTable = this.getView().byId("idProductsTable"),
				// oValue = this.getView().getModel("userModel").getProperty("/")
				binding,
				filters;
			var loginDate = this.getView().getModel("userModel").getProperty("Trdat");
			var dateOffset = (24 * 60 * 60 * 1000) * 90;
			var myDate = new Date();
			myDate.setTime(myDate.getTime() - dateOffset);
			var threemonthsBackdate = new Date(myDate);

			filters = new Filter({
				filters: [new Filter("Trdat", FilterOperator.GT, threemonthsBackdate)

				],
				and: false
			});
			binding = oTable.getBinding("rows");
			binding.filter(filters);
			var activeCount = this.getView().getModel("userModel").getProperty("/active").length;

			oEvent.getSource().setText(`Active (${activeCount})`);
		},
		onPressInActive: function (oEvent) {
			var oTable = this.getView().byId("idProductsTable"),
				// oValue = this.getView().getModel("userModel").getProperty("/")
				binding,
				filters;
			var dateOffset = (24 * 60 * 60 * 1000) * 90;
			var myDate = new Date();
			myDate.setTime(myDate.getTime() - dateOffset);
			var threemonthsBackdate = new Date(myDate);
			filters = new Filter({
				filters: [new Filter("Trdat", FilterOperator.LT, threemonthsBackdate)

				],
				and: false
			});
			binding = oTable.getBinding("rows");
			binding.filter(filters);

			var inActiveCount = this.getView().getModel("userModel").getProperty("/inactive").length;
			oEvent.getSource().setText(`InActive (${inActiveCount})`);
		},
		onPressAll: function (oEvent) {
				var oTable = this.getView().byId("idProductsTable");
				// oValue = this.getView().getModel("userModel").getProperty("/")

				let binding = oTable.getBinding("rows");
				binding.filter(null);
			}
			// getDate1: function (oData) {
			// 	var LoginTime = null,
			// 		a = [],
			// 		LogutTime = null;
			// 	for (var i = 0; i < oData.results.length; i++) {
			// 		if (oData.results[i].Auditmessage.split(" ")[0] === "Logon" && LoginTime === null) {
			// 			LoginTime = oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7));
			// 		} else if (oData.results[i].Auditmessage.split(" ")[1] === "Logoff" && LoginTime !== null) {
			// 			LogutTime = LoginTime.concat(oData.results[i].Audittime.slice(2, 4).concat(oData.results[i].Audittime.slice(5, 7)));
			// 			a.push(LogutTime);
			// 			LoginTime = null;

		// 			LogutTime = null;
		// 		}
		// 	}
		// 	var totalHour = 0,
		// 		totalMin = 0;
		// 	for (i = 0; i < a.length; i++) {
		// 		var sHour = Number(a[i].slice(0, 2)),
		// 			sMin = Number(a[i].slice(2, 4)),
		// 			eHour = Number(a[i].slice(4, 6)),
		// 			eMin = Number(a[i].slice(6, 8));
		// 		if (sHour === eHour) {
		// 			var hour = 0;
		// 			var min = eMin - sMin;
		// 			totalHour = totalHour + hour;
		// 			totalMin = totalMin + min;
		// 		} else {
		// 			var hour = eHour - 1 - sHour;
		// 			var min = 60 - sMin + eMin;
		// 			totalHour = totalHour + hour;
		// 			totalMin = totalMin + min;
		// 		}
		// 	}
		// 	var addhour = 0;
		// 	for (var i = 0; i < 1000; i++) {
		// 		if (totalMin >= 60) {
		// 			addhour = addhour + 1;
		// 			totalMin = totalMin - 60;
		// 		} else {
		// 			break;
		// 		}
		// 	}
		// 	totalHour = totalHour + addhour;
		// 	totalMin = totalMin;
		// 	var noH = 23 - totalHour,
		// 		noM = 60 - totalMin;
		// 	// var graphTotal = totalHour.concat(totalMin);
		// 	var workhour = (Number(totalHour.toString() + "." + totalMin.toString()) * 100) / 24;
		// 	var a = {
		// 			"date": "8-12",
		// 			"count": totalHour.toString() + "." + totalMin.toString()
		// 		},
		// 		// this.week.push(arguments);

		// }

	});
});