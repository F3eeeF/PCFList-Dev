/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { dataToSend, controlDisplay } from "./components/ControlDisplay";
import { IInputs, IOutputs } from "./generated/ManifestTypes";


export class VehicleLicensePlateRegistration implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private _vehicleReg: string;
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        
        const vehicleRegistration = (context.parameters.ControlVehicleregistration?.raw ?? "".toLocaleUpperCase());
        const countryVehicle = context.parameters.Country?.raw ?? "";
        const EletricOption = context.parameters.IsEletric?.raw ?? 0;
        const _context = context;
        // let countryVehicle;
        // if (lookupValue && lookupValue.length > 0) {
        //     const record = lookupValue[0];
        //     countryVehicle = this.getDataLookup(record, context)
        // }

        const props: dataToSend = {
            vehicleRegistration,
            _context,
            countryVehicle,
            EletricOption,
            onValueChangeRegistration: this.handleReactRegistration,
        }
        return React.createElement(
            controlDisplay, props
        );
    }
    private handleReactRegistration = (newVal: string): void =>{
        this._vehicleReg = newVal ?? "";
        this.notifyOutputChanged();
    }
    // private getDataFuelType = async (data: ComponentFramework.LookupValue, context: ComponentFramework.Context<IInputs>) : Promise<string | null> => {
    //     const result = await context.webAPI.retrieveRecord(
    //             data.entityType,
    //             data.id,
    //             "?$select=emd_fueltype_primary"
    //         )
    //         return (result as ComponentFramework.WebApi.Entity & { emd_fueltype_primary?: string }).emd_fueltype_primary ?? null;
    // }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { ControlVehicleregistration: this._vehicleReg };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
