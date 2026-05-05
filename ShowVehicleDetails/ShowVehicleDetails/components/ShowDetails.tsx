/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { TextField, ITextFieldStyles, DefaultButton, IButtonStyles} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Decoder } from '../service/VINDecoder';
import { CheckVerificationVIN } from './CheckverificationVIN';
import { IInputs, IOutputs } from "../generated/ManifestTypes";


//-------------------------------------INTERFACE-------------------------------------//
export interface dataToSend {
    _context: ComponentFramework.Context<IInputs>;
    VIN: string;
    API: string,
    flag : boolean;
    onValueChangeVIN: (newValVID: string) => void;
    onValueChangeJson: (newjsonVla: string) => void;
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


const ShowDetails = (props: dataToSend)=> {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const lastPopupVinRef = React.useRef<string | null>(null);
  const [VINValue, setVINValue] = React.useState<string>('');
  const [APIValue, setAPIValue] = React.useState<string>('');
  const [isTextVisible, { setTrue: showText, setFalse: hideText }] = useBoolean(false);


  const filterForVIN = "License Plate,Make,Model Name,Model Year,Registered,Color,Vehicle Specification,Gross List Price,Vehicle Tax (monthly),Emission Standard,Average CO2 Emissions (g/km),Fuel Type - Primary,Fuel Type - Secondary,Displacement (ccm),Max. Power Output (kW),Transmission Type,Drive,Height (mm),Length (mm),Width (mm),Weight without driver (kg)"

  React.useEffect(() => {
    setVINValue(props.VIN);
    if(!props.flag) { hideText() }
  }, [props.VIN, props.flag, hideText]);
  
  React.useEffect(() => {
    if(CheckVerificationVIN(VINValue)) { showText(); ShowJsonresult() }
  },[VINValue])

  const SetOnchange = React.useCallback((value: string): void => {
    const newVal = value ?? "";
    setVINValue(newVal);
    hideText();
    if(CheckVerificationVIN(newVal)) { showText() }

    props.onValueChangeVIN(newVal);
  }, [VINValue, setVINValue, props.onValueChangeVIN]);

  const ShowJsonresult = React.useCallback((): void => {
    const loadJson = async () : Promise<void> => {
      const jsonString = await Decoder(VINValue);
      const jsonObj = JSON.parse(jsonString);
      const jsonData = (jsonObj.data ?? {});
      const filterArray = filterForVIN.split(",");
      const result = filterArray.map(key => {
          const value = jsonData[key] ?? ""
          if(!value) {return `${key} : undefined`;}
          return `${key} : ${value}` 
        }).filter(item => item != null).join("\n");
      
      props.onValueChangeJson(result);
      props.onValueChangeVIN(VINValue)
      setAPIValue(result);
    }
    void loadJson();
  }, [ setAPIValue, APIValue, VINValue, props.onValueChangeJson, props.onValueChangeVIN]);
  

  const ShowInvalidVinPopup = React.useCallback((vin: string): void => {
    void props._context.navigation.openAlertDialog(
        {
          text: `VIN non valido\nIl VIN inserito non è valido: ${vin}\ninserire un Vin valido`,
          confirmButtonLabel: "OK"
        },
        {
          width: 450,
          height: 180
        }
      );
  }, [props._context]);

  const HandleVinBlur = React.useCallback((vinValue: string): void => {
    const vin = vinValue.trim().toUpperCase() ?? "";
    if (!vin) {
      return;
    }
    const isInvalidVin = !CheckVerificationVIN(vin);
    if (isInvalidVin) {
      hideText();
      if (lastPopupVinRef.current === vin) {
        return;
      }
      lastPopupVinRef.current = vin;
      ShowInvalidVinPopup(vin);
      return;
    }

    lastPopupVinRef.current = null;
}, [VINValue, hideText, ShowInvalidVinPopup]);

    return (
        <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
            
            <TextField
            invalid={!CheckVerificationVIN(VINValue)}
            //errorMessage={!CheckVerificationVIN(VINValue) ? "VIN non valido" : undefined}
            value={VINValue}
            styles={titleFieldStyles}
            onChange={(_, value) => { SetOnchange(value ?? ""); if(value?.length == 17) {HandleVinBlur(value)} } }        
          />
        </div>
    )
}

export const displayDitails = React.memo(ShowDetails);