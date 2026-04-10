
import * as React from 'react';
import { TextField, ITextFieldStyles} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { ControlInput } from './InputControl';
import { getPrefixlocation , getElettricCode } from './getPrefixLocationAndElettricCode';
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { useMemo } from 'react';



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
    //border: '1px solid transparent',
    borderRadius: 2,
    border: "none",
    backgroundColor: "transparent",
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
    const [isFocused, setIsFocused] = React.useState(false);
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

  const normalizedValue = vehicleRegistrationValue ?? "";
  const Autofill = React.useMemo(() => {
    if(!normalizedValue)  { return  "" }

    return (
      ArrayofprefixValue.find((item) => item.toUpperCase().startsWith(normalizedValue)) ?? ""
    );
  }, [normalizedValue, ArrayofprefixValue]);

  const suggestedSuffix = 
        Autofill &&
        Autofill.length > normalizedValue.length &&
        Autofill.toUpperCase().startsWith(normalizedValue.toUpperCase())
        ? Autofill.substring(normalizedValue.length)
        : "";

  const acceptSuggestion = React.useCallback(() => {
    if (!Autofill) return;
    setvehicleRegistrationValue(Autofill);
    prop.onValueChangeRegistration(Autofill);
  }, [Autofill, prop.onValueChangeRegistration]);

    const handleKeyDown = React.useCallback(
      (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!suggestedSuffix) return;
  
        if (ev.key === "Tab" || ev.key === "ArrowRight") {
          ev.preventDefault();
          acceptSuggestion();
        }
      },
      [suggestedSuffix, acceptSuggestion]
    );

    const CheckOnchange = React.useCallback((value: string) :void => {
      const newVal = value.toUpperCase();
      setvehicleRegistrationValue(newVal);
      const validControl = ControlInput(newVal, countryVehicleValue, elettricFalgValue, ArrayofprefixValue)
      invalidCountry()
      if(validControl) { validCountry() }
    }, [countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry]);


        return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 35,
        border: isFocused ? "1px solid #8a8886" : "1px solid transparent",
        borderRadius: 2,
        backgroundColor: isFocused ? "#ffffff" : "#f3f2f1",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        if (!isFocused) {
          (e.currentTarget.style.backgroundColor = "#edebe9");
        }
      }}
      onMouseLeave={(e) => {
        if (!isFocused) {
          (e.currentTarget.style.backgroundColor = "#f3f2f1");
        }
      }}
    >
          {/* Ghost text dietro al vero input */}
 <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          whiteSpace: "pre",
          overflow: "hidden",
          fontSize: 14,
          color: "#999",
          zIndex: 1,
        }}
      >
        <span style={{ visibility: "hidden" }}>{vehicleRegistrationValue}</span>
        <span>{suggestedSuffix}</span>
      </div>
            <TextField
                invalid={!isCountryValid}
                errorMessage={!isCountryValid ? "Targa non valida" : undefined}
                value={vehicleRegistrationValue}
                styles={titleFieldStyles}
                onChange={(_, value) => CheckOnchange(value ?? "")} 
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {prop.onValueChangeRegistration(vehicleRegistrationValue); setIsFocused(false)}}
            />
          </div>
        );
}

export const controlDisplay = React.memo(Control);
