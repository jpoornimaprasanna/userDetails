sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ns/UserDetails/formatters/activeusers",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/format/DateFormat"

], function (Controller, formatter, Filter, FilterOperator, DateFormat) {
	"use strict";

	return Controller.extend("ns.UserDetails.controller.Dashboard", {
		formatter: formatter,

		onInit: function () {
			this.getCount();

			this.getView().getModel("userModel").setProperty("/active", []);
			this.getView().getModel("userModel").setProperty("/inactive", []);
			this.getView().getModel("userModel").setProperty("/totalUserValues", []);
			// this.getView().getModel("userModel").setProperty("/totalusers", "");

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
		}
	});
});