class Heavy_Boeing_FMC extends Boeing_FMC {
	constructor() {
		super(...arguments);
	}

	Init() {
		super.Init();
		this.onExec = () => {
			if (this.getIsRouteActivated()) {
				this.insertTemporaryFlightPlan(() => {
					this._isRouteActivated = false;
					SimVar.SetSimVarValue('L:FMC_EXEC_ACTIVE', 'number', 0);
					if (this.refreshPageCallback) {
						this.refreshPageCallback();
					}
				});
			}
		};
	}

	activateExecEmissive(){
		this._shouldBeExecEmisssive = true;
		SimVar.SetSimVarValue('L:FMC_EXEC_ACTIVE', 'Number', 1);
	}

	activateExec(){
		this.activateExecEmissive();
	}

	/**
	 * TODO: This is reimplemented and working version of "DIRECT TO".
	 * TODO: Need to be tested. especially "DIRECT TO" Approach and Arrival waypoints
	 *
	 * TODO: Add "ActivateDirectTo" for departure and enroute waypoints
	 *
	 * MSFS does not support deleting waypoints from STAR.
	 *
	 * DIRECT TO STARs use "activateDirectTo". "ActivateDirectTo" works different than normal Boeing direct to.
	 *
	 * Direct to departure waypoints and enroute waypoints remove skipped waypoints from flightplan.
	 * @param directToWaypointIdent
	 * @param directToWaypointIndex
	 * @param callback
	 */

	setMyBoeingDirectTo(directToWaypointIdent, directToWaypointIndex, callback = EmptyCallback.Boolean) {
		let waypoints = this.flightPlanManager.getWaypoints();
		let departureCount = this.flightPlanManager.getDepartureWaypointsCount() - 1
		waypoints.splice(1, departureCount);

		let waypointIndex = waypoints.findIndex(w => {
			return w.ident === directToWaypointIdent;
		});

		if (waypointIndex === -1) {
			waypoints = this.flightPlanManager.getApproachWaypoints();
			if (waypoints) {
				let waypoint = waypoints.find(w => {
					return w.ident === directToWaypointIdent;
				});
				if (waypoint) {
					return this.flightPlanManager.activateDirectTo(waypoint.icao, () => {
						return callback(null);
					});
				}
			}
		}

		if (waypointIndex > -1) {
			this.ensureCurrentFlightPlanIsTemporary(() => {
				this.flightPlanManager.setDepartureProcIndex(-1, () => {
					let i = 1;
					let removeWaypointMethod = () => {
						if (i < waypointIndex) {
							console.log('Remove Waypoint ' + this.flightPlanManager.getWaypoints()[directToWaypointIndex].ident);
							this.flightPlanManager.removeWaypoint(1, i === waypointIndex - 1, () => {
								i++;
								removeWaypointMethod();
							});
						} else {
							callback(true);
						}
					};
					removeWaypointMethod();
				});
			});
		} else {
			callback(false);
		}
	}
}