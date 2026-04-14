/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IInputs, IOutputs } from "../generated/ManifestTypes";


export const getPrefixlocation = async (context: ComponentFramework.Context<IInputs>, filterCountry: string) : Promise<string[]> => {
    
    const entityName = "emd_licenseplateprefix";
    const fetchXml =`<fetch version="1.0" no-lock="true" >
                    <entity name="${entityName}">
                    <attribute name="emd_licenseplateprefixid"/>
                    <attribute name="emd_name"/>
                    <filter type="and">
                    <condition attribute="statecode" operator="eq" value="0"/>
                    </filter>
                    </entity>
                    </fetch>`
        const response = await context.webAPI.retrieveMultipleRecords(entityName, `?fetchXml=${encodeURIComponent(fetchXml)}`);
        const resultPrefix = [];
        for(const prefix of response.entities) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            const name = prefix["emd_name"];
            const filter = name.split("-");
            if(filter[1] == filterCountry) { resultPrefix.push(filter[0]); }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return resultPrefix; 
}

// export const getElettricCode = async (context: ComponentFramework.Context<IInputs>) : Promise<string> => {
//     const entityName = "emd_vehicle";
//     const fetchXml = `<fetch version="1.0" no-lock="true" top="1">
//                         <entity name="${entityName}">
//                         <attribute name="emd_electricvehicleindicator"/>
//                         <filter type="and">
//                         <condition attribute="statecode" operator="eq" value="0"/>
//                         <condition attribute="emd_countryid" operator="eq" value="{7a4c9ba3-b22d-f111-88b4-7ced8d484466}" uiname="Germany" uitype="emd_country"/>
//                         </filter>
//                         </entity>
//                         </fetch>`
//     const result = await context.webAPI.retrieveMultipleRecords(entityName, `?fetchXml=${encodeURIComponent(fetchXml)}`);
//     // eslint-disable-next-line @typescript-eslint/dot-notation
//     const entities = result.entities[0];
//     return entities.emd_electricvehicleindicator;
// }
