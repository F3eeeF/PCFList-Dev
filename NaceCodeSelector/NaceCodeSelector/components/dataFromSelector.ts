import { IInputs } from "../generated/ManifestTypes";


export const dataForSelectorCreate = async (context: ComponentFramework.Context<IInputs>) : Promise<ComponentFramework.WebApi.Entity[]> => {

const entityName = "emd_nacecode";
const fetchXml = `
<fetch no-lock="true">
    <entity name="${entityName}">
        <all-attributes /> 
        <filter type="and">
            <condition attribute="statecode" operator="eq" value="0" />
        </filter>
    </entity>
</fetch>`;

    const response = await context.webAPI.retrieveMultipleRecords(entityName, `?fetchXml=${encodeURIComponent(fetchXml)}`);
    return response.entities
}
