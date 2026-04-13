
import * as React from 'react';
import { TextField, ITextFieldStyles, Callout, List, DirectionalHint} from '@fluentui/react';
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
    const [prefixFilteredValue, setprefixFilteredValue] = React.useState<string>('');
    const [ArrayofprefixValue, setArrayofprefixValue] = React.useState<string[]>([]);
    const inputRef = React.useRef<HTMLDivElement | null>(null);

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
        setArrayofprefixValue(prefixes.sort());
    }
    void LoadData();
  }, [prop.countryVehicle, prop._context]);

  React.useEffect(() => {
    const isValid = ControlInput(vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue, prefixFilteredValue);
    invalidCountry();
    if (isValid) { validCountry() }
  }, [vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry, prefixFilteredValue]);


    const CheckOnchange = React.useCallback((value: string) :void => {
      const newVal = value.toUpperCase();
      setvehicleRegistrationValue(newVal);
      
      const detectedPrefix = findValidPrefix(newVal);
      setprefixFilteredValue(detectedPrefix);

      //const validControl = ControlInput(newVal, countryVehicleValue, elettricFalgValue, ArrayofprefixValue, prefix)
      const validControl = ControlInput(newVal, countryVehicleValue, elettricFalgValue, ArrayofprefixValue, detectedPrefix);
      invalidCountry()
      if(validControl) { validCountry() }
    }, [countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry, prefixFilteredValue]);

    const filteredPrefixes = React.useMemo(() => {
      return ArrayofprefixValue.filter(prefix => prefix.startsWith(vehicleRegistrationValue));
    }, [vehicleRegistrationValue, ArrayofprefixValue])

    const changeDropDownList = React.useCallback((value: string) :void => {
      if(!value) { return }
      if((value.length > vehicleRegistrationValue.length) || (vehicleRegistrationValue.length == value.length) || (!vehicleRegistrationValue)) {
        setvehicleRegistrationValue(value);
      }
      if(vehicleRegistrationValue.length > value.length) {
        let startSplit = 0;
        for(let i = 0; i < 4; i++){
          const filter = ArrayofprefixValue.filter((elem: string) => elem == vehicleRegistrationValue.slice(0, i));
          if(filter.length > 0) {startSplit = filter[0].length}
          const split = vehicleRegistrationValue.substring(startSplit);
          setvehicleRegistrationValue(`${value}${split}`);
        }
      }
      setprefixFilteredValue(value);
    }, [vehicleRegistrationValue, ArrayofprefixValue, setvehicleRegistrationValue, setprefixFilteredValue]) 

    const findValidPrefix = React.useCallback((text: string): string => {
      if (!text) return "";
      const potentialMatches = ArrayofprefixValue.filter(p => text.startsWith(p));
      const sortedMatches = [...potentialMatches].sort((a, b) => b.length - a.length);
      for (const p of sortedMatches) {
        if (ControlInput(text, countryVehicleValue, elettricFalgValue, ArrayofprefixValue, p)) {
          return p; 
        }
      }
      return sortedMatches.length > 0 ? sortedMatches[0] : "";
    }, [ArrayofprefixValue, countryVehicleValue, elettricFalgValue]);


        return (
        <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
          <div ref={inputRef}>
              <TextField
              invalid={!isCountryValid}
              errorMessage={!isCountryValid ? "Targa non valida" : undefined}
              value={vehicleRegistrationValue}
              styles={titleFieldStyles}
              onChange={(_, value) => CheckOnchange(value ?? "")} 
              onFocus={() => setIsFocused(true)}
              onClick={() => setIsFocused(true)}
              onBlur={() => {prop.onValueChangeRegistration(vehicleRegistrationValue); setIsFocused(false)}}
              />
          </div>
            {
              isFocused && inputRef.current && (
                <Callout
                  target={inputRef.current}
                  onDismiss={() => setIsFocused(false)}
                  setInitialFocus={false}
                  directionalHint={DirectionalHint.bottomLeftEdge}
                  calloutWidth={inputRef.current?.clientWidth}
                  isBeakVisible={false}
                >
                <div style={{ maxHeight: 200, overflowY: 'auto', padding: 4 }}>
                  {
                    filteredPrefixes.map((item) => (
                      <div
                        key={item}
                        style={{ padding: '8px 12px', cursor: "pointer", borderBottom: '1px solid #f3f2f1'}}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {changeDropDownList(item) ; setIsFocused(false)}}
                      >
                      {item}
                      </div>
                    ))
                  }
                </div>
                </Callout>
              )
            }
        </div>
      );
}

export const controlDisplay = React.memo(Control);
