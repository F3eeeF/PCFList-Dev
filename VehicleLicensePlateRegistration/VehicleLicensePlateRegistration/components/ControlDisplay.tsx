/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from 'react';
import { TextField, ITextFieldStyles} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { ControlInput } from './InputControl';
import { getPrefixlocation , getElettricCode } from './getPrefixLocationAndElettricCode';
import { IInputs, IOutputs } from "../generated/ManifestTypes";



//-------------------------------------INTERFACE-------------------------------------//
export interface dataToSend {
    vehicleRegistration: string;
    _context: ComponentFramework.Context<IInputs>
    countryVehicle: Promise<string | null> | undefined,
    onValueChangeRegistration: (newVal: string) => void;
}

//-------------------------------------STYLE-------------------------------------//
const titleFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    width: '100%',
  },
  wrapper: {
    width: '100%',
  },
  fieldGroup: {
    width: '100%',
    minHeight: 35,
    border: '1px solid transparent',
    borderRadius: 2,
    backgroundColor: '#f3f2f1',
    boxSizing: 'border-box',
    selectors: {
      ':hover': {
        backgroundColor: '#edebe9',
      },
      ':focus-within': {
        backgroundColor: '#ffffff',
        borderColor: '#8a8886',
      },
    },
  },
  field: {
    padding: '0 10px',
    fontSize: 14,
    color: '#323130',
    backgroundColor: 'transparent',
  },
};
//-------------------------------------STYLE-------------------------------------//

const Control = (prop: dataToSend)=> {
    const [isCountryValid, { setTrue: validCountry, setFalse: invalidCountry }] = useBoolean(false);
    const [vehicleRegistrationValue, setvehicleRegistrationValue] = React.useState<string>('');
    const [elettricFalgValue, SetelettricFalgValue] = React.useState<string>('');
    const [countryVehicleValue, setcountryVehicleValue] = React.useState<string>('');
    const [ArrayofprefixValue, setArrayofprefixValue] = React.useState<string[]>([]);

  React.useEffect(() => {
    setvehicleRegistrationValue((prop.vehicleRegistration ?? "").toUpperCase());
  }, [prop.vehicleRegistration]);

  React.useEffect(() => {
    const LoadData = async (): Promise<void> => {
        const countryValue = await prop.countryVehicle ?? "";
        setcountryVehicleValue(countryValue);

        let electricValue = "";
        if (countryValue === "DE") {
            electricValue = await getElettricCode(prop._context);
        }
        SetelettricFalgValue(electricValue);

        const prefixes = await getPrefixlocation(prop._context, countryValue);
        setArrayofprefixValue(prefixes);
    }
    void LoadData();
  }, [prop.countryVehicle, prop._context]);

  React.useEffect(() => {
    const isValid = ControlInput(vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue);
    invalidCountry();
    if (isValid) { validCountry() }
}, [vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry]);


    const CheckOnchange = React.useCallback((value: string) :void => {
      const newVal = value.toUpperCase();
      setvehicleRegistrationValue(newVal);
      const validControl = ControlInput(newVal, countryVehicleValue, elettricFalgValue, ArrayofprefixValue)
      invalidCountry()
      if(validControl) { validCountry() }
    }, [countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry]);


        return (
        <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
            <TextField
                invalid={!isCountryValid}
                errorMessage={!isCountryValid ? "Targa non valida" : undefined}
                value={vehicleRegistrationValue}
                styles={titleFieldStyles}
                onChange={(_, value) => CheckOnchange(value ?? "")} 
                onBlur={() => prop.onValueChangeRegistration(vehicleRegistrationValue)}
            />
          </div>
        );
}

export const controlDisplay = React.memo(Control);
