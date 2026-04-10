/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export class DecodeVinRequest {
    public Vin: string;

    constructor(Vin: string) {
        this.Vin = Vin;
    }
    public getMetadata() {
        return {
            boundParameter: null,
            operationType: 0,
            operationName: "emd_DecodeVINAPI",
            parameterTypes: {
                Vin: {
                typeName: "Edm.String",
                structuralProperty: 1
                }
            }
        }
    }
}


export const Decoder = async (ValidVINValue: string) : Promise<string> => {
    const response = await Xrm.WebApi.online.execute(new DecodeVinRequest(ValidVINValue));
        if (!response.ok) {
        throw new Error(`Errore HTTP ${response.status} - ${response.statusText}`);
    }
    const body = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return body.ResultJson ?? "test fallito";
}