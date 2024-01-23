
testRunTrip() {
    const trip = {
      TripLegs: [
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: "",
          Longitude: "",
          LocationText: this.locationValue
            ? this.locationValue
            : (locationValue = null),
        },
        {
          Address: "",
          City: "",
          State: "",
          PostalCode: "",
          Latitude: "",
          Longitude: "",
          LocationText: this.locationValue2
            ? this.locationValue2
            : (this.locationValue2 = null),
        },
      ],
      UnitMPG: 6,
      RoutingMethod: this.selectedRoutingMethod,
      BorderOpen: this.borderCheck,
      AvoidTollRoads: this.tollCheck,
      VehicleType: 7,
      AllowRelaxRestrictions: false,
      GetDrivingDirections: true,
      GetMapPoints: true,
      GetStateMileage: true,
      GetTripSummary: true,
      GetTruckStopsOnRoute: false,
      GetFuelOptimization: false,
      apikey: tmAPIKey,
    };

    fetch("http://prime.promiles.com/WebAPI/api/RunTrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trip),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(this.selectedItem);
        console.log(JSON.stringify(data));
        this.tresults = data;
        this.$store.commit("setTResults", data);
        this.$emit("trip-results", this.tresults);
        console.log(this.selectedRoutingMethod);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }