class B787_10_FMC_ThrustLimPage {
	static ShowPage1(fmc) {
		fmc.clearDisplay();

		fmc.refreshPageCallback = () => {
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};

		let selectedTempCell = '[settable]' + fmc.getThrustTakeOffTemp() + '[/settable]';
		selectedTempCell = selectedTempCell + '°';
		fmc.onLeftInput[0] = () => {
			let value = fmc.inOut;
			fmc.clearUserInput();
			if (fmc.setThrustTakeOffTemp(value)) {
				B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
			}
		};
		let toN1Cell = fmc.getThrustTakeOffLimit().toFixed(1) + '%';
		let oatValue = SimVar.GetSimVarValue('AMBIENT TEMPERATURE', 'celsius');
		let oatCell = oatValue.toFixed(1) + '°';
		let thrustTOMode = fmc.getThrustTakeOffMode();
		let thrustClimbMode = fmc.getThrustCLBMode();
		fmc.onLeftInput[1] = () => {
			fmc.setThrustTakeOffMode(0);
			fmc.setThrustCLBMode(0);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[2] = () => {
			fmc.setThrustTakeOffMode(1);
			fmc.setThrustCLBMode(1);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onLeftInput[3] = () => {
			fmc.setThrustTakeOffMode(2);
			fmc.setThrustCLBMode(2);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onRightInput[1] = () => {
			fmc.setThrustCLBMode(0);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onRightInput[2] = () => {
			fmc.setThrustCLBMode(1);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};
		fmc.onRightInput[3] = () => {
			fmc.setThrustCLBMode(2);
			B787_10_FMC_ThrustLimPage.ShowPage1(fmc);
		};

		let toN1CellTitle;

		switch (thrustTOMode) {
			case 0:
				toN1CellTitle = 'TO N1';
				break;
			case 1:
				toN1CellTitle = 'TO 1 N1';
				break;
			case 2:
				toN1CellTitle = 'TO 2 N1';
				break;
			default:
				toN1CellTitle = 'TO N1';
		}

		let thrustClimbModeCell0 = '';
		let thrustClimbModeCell1 = '';
		let thrustClimbModeCell2 = '';
		switch (thrustClimbMode) {
			case 0:
				thrustClimbModeCell0 = (fmc.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB ? '<SEL>' : '<ARM>')
				break;
			case 1:
				thrustClimbModeCell1 = (fmc.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB ? '<SEL>' : '<ARM>')
				break;
			case 2:
				thrustClimbModeCell2 = (fmc.currentFlightPhase === FlightPhase.FLIGHT_PHASE_CLIMB ? '<SEL>' : '<ARM>')
				break;
			default:
				toN1CellTitle = 'TO N1';
		}

		fmc.setTemplate([
			['THRUST LIM'],
			['SEL/OAT', toN1CellTitle],
			[selectedTempCell + '[size=medium-size]C[/size]/' + oatCell + '[size=medium-size]C[/size]', toN1Cell],
			[''],
			['\<TO', '<CLB', (thrustTOMode === 0 ? '<SEL>' : ''), thrustClimbModeCell0],
			['TO 1'],
			['\<-10%', '<CLB 1', (thrustTOMode === 1 ? '<SEL>' : ''), thrustClimbModeCell1],
			['TO 2'],
			['\<-20%', '<CLB 2', (thrustTOMode === 2 ? '<SEL>' : ''), thrustClimbModeCell2],
			[''],
			[''], //['\<TO-B'],
			['__FMCSEPARATOR'],
			['\<INDEX', '<TAKEOFF']
		]);

		fmc.onLeftInput[5] = () => {
			B787_10_FMC_InitRefIndexPage.ShowPage1(fmc);
		};
		fmc.onRightInput[5] = () => {
			B787_10_FMC_TakeOffRefPage.ShowPage1(fmc);
		};
		fmc.updateSideButtonActiveStatus();
	}
}

//# sourceMappingURL=B787_10_FMC_ThrustLimPage.js.map