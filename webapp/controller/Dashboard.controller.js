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
		},

		onSubmit: function (oEvent) {
			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);
			var myModel = this.getView().getModel("userModel");
			var lastName = myModel.getProperty("/lastname");
			var PassCodes = myModel.getProperty("/passCode");
			var PassCode = Number(PassCodes);
			var CityNo = myModel.getProperty("/cityNo");
			var City = myModel.getProperty("/city");
			var Address = myModel.getProperty("/address");
			var password = myModel.getProperty("/password");
			var user = myModel.getProperty("/user");

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
						myModel.setProperty("/lastname", "");
						myModel.setProperty("/passCode", "");
						myModel.setProperty("/cityNo", "");
						myModel.setProperty("/city", "");
						myModel.setProperty("/address", "");
						myModel.setProperty("/password", "");
						myModel.setProperty("/user", "");
					},
					error: function (oError) {
						sap.m.MessageToast.show("Please try again with correct Credentials");
						myModel.setProperty("/lastname", "");
						myModel.setProperty("/passCode", "");
						myModel.setProperty("/cityNo", "");
						myModel.setProperty("/city", "");
						myModel.setProperty("/address", "");
						myModel.setProperty("/password", "");
						myModel.setProperty("/user", "");
					}

				})
				// ,

			// error : function(error){

			// })

		},

		getCount: function () {
			var ODataModel = "/sap/opu/odata/sap/ZUSERDATA_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(oModel);

			oModel.read("/totalUsersSet", {
				success: function (oResult) {
					var active = this.getView().getModel("userModel").getProperty("/active");
					var inactive = this.getView().getModel("userModel").getProperty("/inactive");
					// check if the result is a number
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "yyyy-MM-dd"
					});
					var totalUsers = oResult.results.length;
					var users = oResult.results;
					debugger;

					for (var i = 0; i < totalUsers; i++) {
						var str = users[i].Trdat;
						if (str !== null) {
							var date = new Date(Number(str.substr(6, 13)));

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
					this.getView().getModel("userModel").setProperty("/totalUsers", totalUsers);
					this.getView().getModel("userModel").setProperty("/activeUser", oResult.results);
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
		}
	});
});