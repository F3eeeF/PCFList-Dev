/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { dataToSend, mergeData } from "./components/mergeData";
import { getAttributeFromRecord } from "./components/getDataFetch";
import * as React from "react";

 
export class FieldMerge implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>; 
    private _state: ComponentFramework.Dictionary; 
    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;
    private _mergedString: string;
    //private _inputElement: HTMLAreaElement;

    constructor() {
        // <Empty>
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
        state: ComponentFramework.Dictionary,
        container : HTMLDivElement 
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._context = context;
        this._state = state;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const dataToFetch = context.parameters.arrayParam?.raw ?? "";
        const dataRecord = getAttributeFromRecord(context, String(dataToFetch).split(","));
        const props: dataToSend = {
            dataRecord,
            onValueChange: this.handleReactData,
            firstSeparator: this.normalizeSeparator(true, context) ?? "",
            secondSeparator: this.normalizeSeparator(false, context) ?? ""
        }
        return React.createElement(
            mergeData, props
        );
    }

    private normalizeSeparator(first: boolean, context: ComponentFramework.Context<IInputs>): string {
        if(first) {
            return `${context.parameters.firstDivider?.raw ?? ""}${context.parameters.useSpacesBetweenFirstValue?.raw === true ? " " : ""}`
        }
        else {
         return `${context.parameters.secondDivider?.raw ?? ""}${context.parameters.useSpacesBetweenSecondValue?.raw === true ? " " : ""}`   
        }
    }

    private handleReactData = (newVal: string): void => {
        this._mergedString = newVal;
        this._notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { result: this._mergedString};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
