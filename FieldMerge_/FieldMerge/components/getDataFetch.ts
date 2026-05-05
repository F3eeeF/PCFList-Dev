/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IInputs } from "../generated/ManifestTypes";


export const getAttributeFromRecord =  async (context: ComponentFramework.Context<IInputs>, arrayLogicalName: (string | null)[]) : Promise<string[]> =>
{
    interface RuntimeContextInfo {
        entityId?: string;
        entityTypeName?: string;
        entityRecordName?: string;
    }
    const ctxInfo = (context.mode as any).contextInfo as RuntimeContextInfo | undefined;
    const entityName = ctxInfo?.entityTypeName;
    const entityId = ctxInfo?.entityId;
    if (!entityName) {
        throw new Error("entityTypeName non disponibile (probabilmente non sei in Model-Driven o sei in design-time).");
    }

    let attributes = "";
    for(const atrln of arrayLogicalName)
    {
        attributes += `<attribute name="${atrln}" /> \n`;
    }   
    
  const fetchXml = `<fetch no-lock="true" top="1">
  <entity name="${entityName}">
        ${attributes}
            <filter type="and">
                <condition attribute="${entityName}id" operator="eq" value="${entityId}" />
            </filter>
        </entity>
    </fetch>`

    const response = await context.webAPI.retrieveMultipleRecords(entityName, `?fetchXml=${encodeURIComponent(fetchXml)}`);
    if(response.entities.length === 0) {return []}
    const record = response.entities[0];

    const hasOwn = (obj: Record<string, any>, key: string): boolean => Object.prototype.hasOwnProperty.call(obj, key);

    const readLookupDisplay = (row: Record<string, any>, fieldOrAlias: string): string => {
    const odataKey = `_${fieldOrAlias}_value`;

    const useODataKey =  
      hasOwn(row, odataKey) ||
      hasOwn(row, `${odataKey}@OData.Community.Display.V1.FormattedValue`) ||
      hasOwn(row, `${odataKey}@Microsoft.Dynamics.CRM.lookuplogicalname`);

    const key = useODataKey ? odataKey : fieldOrAlias; 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const formatted = row[`${key}@OData.Community.Display.V1.FormattedValue`];
    if (formatted !== undefined && formatted !== null) return String(formatted);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rawId = row[key];
    if (rawId !== undefined && rawId !== null) return String(rawId);
   
    return "";
  };
    //const metaData = await getFieldsMetadata(context, entityName, fieldsLogicalName);
    return arrayLogicalName.map((elem) => {
        if (!elem) return "";
        return readLookupDisplay(record, elem);
    });
    
} 