sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ns.UserDetails.controller.Dashboard", {
		onInit: function () {
			this.getCount();
		},

		getCount: function () {
			var ODataModel = "sap/opu/odata/sap/ZUSERDATA_SRV";
			this._model = new sap.ui.model.odata.ODataModel(ODataModel, true);
			this.getView().setModel(this._model);
			debugger;
			this.getView().getModel().read("/totalUsersSet/$count", {
				success: function (oResult) {
					// check if the result is a number
					if (isNaN(oResult)) {
						var oIntResult = parseInt(oResult);
					}
				}
			});
		}
	});
});