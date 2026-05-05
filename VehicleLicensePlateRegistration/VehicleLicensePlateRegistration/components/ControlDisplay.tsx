
import * as React from 'react';
import { TextField, ITextFieldStyles, Callout, List, DirectionalHint} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { ControlInput } from './InputControl';
import { getPrefixlocation  } from './getPrefixLocationCode';
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { useMemo } from 'react';



//-------------------------------------INTERFACE-------------------------------------//
export interface dataToSend {
    vehicleRegistration: string;
    _context: ComponentFramework.Context<IInputs>
    countryVehicle: string,
    EletricOption: number,
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
    const [isCountryValid, { setTrue: validCountry, setFalse: invalidCountry }] = useBoolean(true);
    const [isFocused, setIsFocused] = React.useState(false);
    const [vehicleRegistrationValue, setVehicleRegistrationValue] = React.useState<string>('');
    const [elettricFalgValue, setElettricFlagValue] = React.useState<number>(0);
    const [countryVehicleValue, setCountryVehicleValue] = React.useState<string>('');
    const [prefixFilteredValue, setPrefixFilteredValue] = React.useState<string>('');
    const [ArrayofprefixValue, setArrayofprefixValue] = React.useState<string[]>([]);
    const inputRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setVehicleRegistrationValue((prop.vehicleRegistration ?? "").toUpperCase());
  }, [prop.vehicleRegistration]);

  React.useEffect(() => {
    const LoadData = async (): Promise<void> => {
        const countryValue = prop.countryVehicle ?? "";
        setCountryVehicleValue(countryValue);

        let electricValue = 0;
        if (countryValue === "DE") {
            //electricValue = await getElettricCode(prop._context);
            electricValue = prop.EletricOption;
        }
        setElettricFlagValue(electricValue);

        const prefixes = await getPrefixlocation(prop._context, countryValue);
        setArrayofprefixValue(prefixes.sort());
    }
    void LoadData();

  }, [prop.countryVehicle, prop._context, prop.EletricOption]);

  React.useEffect(() => {
    const detectedPrefix = findValidPrefix(vehicleRegistrationValue);
    setPrefixFilteredValue(detectedPrefix);

    const validControl = ControlInput(vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue, prefixFilteredValue);
    if(vehicleRegistrationValue.length >= 1) {invalidCountry();}
    if (validControl) { validCountry() }
  }, [vehicleRegistrationValue,countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry, prefixFilteredValue, prop.EletricOption]);


    const CheckOnchange = React.useCallback((value: string) :void => {
      const newVal = value.toUpperCase();
      setVehicleRegistrationValue(newVal);
      
      const detectedPrefix = findValidPrefix(newVal);
      setPrefixFilteredValue(detectedPrefix);

      const validControl = ControlInput(newVal, countryVehicleValue, elettricFalgValue, ArrayofprefixValue, detectedPrefix);
      if(vehicleRegistrationValue.length >= 1) {invalidCountry();}
      
      if(validControl) { validCountry() }
    }, [countryVehicleValue,elettricFalgValue,ArrayofprefixValue,validCountry,invalidCountry, prefixFilteredValue]);

    const filteredPrefixes = React.useMemo(() => {
      return ArrayofprefixValue.filter(prefix => prefix.startsWith(vehicleRegistrationValue));
    }, [vehicleRegistrationValue, ArrayofprefixValue])

    const changeDropDownList = React.useCallback((value: string) :void => {
      if(!value) { return }
      if((value.length > vehicleRegistrationValue.length) || (vehicleRegistrationValue.length == value.length) || (!vehicleRegistrationValue)) {
        setVehicleRegistrationValue(value);
      }
      if(vehicleRegistrationValue.length > value.length) {
        let startSplit = 0;
        for(let i = 0; i < 4; i++){
          const filter = ArrayofprefixValue.filter((elem: string) => elem == vehicleRegistrationValue.slice(0, i));
          if(filter.length > 0) {startSplit = filter[0].length}
          const split = vehicleRegistrationValue.substring(startSplit);
          setVehicleRegistrationValue(`${value}${split}`);
        }
      }
      setPrefixFilteredValue(value);
    }, [vehicleRegistrationValue, ArrayofprefixValue, setVehicleRegistrationValue, setPrefixFilteredValue]) 

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
              //invalid={vehicleRegistrationValue.length >= 9}
              errorMessage={!isCountryValid ? "Vehicle License Plate Registration not valid" :  (vehicleRegistrationValue.length >= 9 ? "Vehicle License Plate Registration not valid" :undefined)}
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
