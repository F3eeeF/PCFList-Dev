/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { TextField, ITextFieldStyles, DefaultButton, IButtonStyles} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Decoder } from '../service/VINDecoder';
import { CheckVerificationVIN } from './CheckverificationVIN';


//-------------------------------------INTERFACE-------------------------------------//
export interface dataToSend {
    VIN: string;
    filter: string,
    API: string,
    flag : boolean;
    onValueChangeVIN: (newValVID: string) => void;
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
  const [VINValue, setVINValue] = React.useState<string>('');
  const [APIValue, setAPIValue] = React.useState<string>('');
  const [isTextVisible, { setTrue: showText, setFalse: hideText }] = useBoolean(false);


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
      const filterArray = props.filter.split(",");
      const result = filterArray.map(key => {
          const value = jsonData[key] ?? ""
          if(!value) {return "";}
          return `${key} : ${value}` 
        }).filter(item => item != null).join("\n");
      
      setAPIValue(result);
    }
    void loadJson();
  }, [ setAPIValue, APIValue, VINValue]);

    return (
        <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
            <TextField
            invalid={!CheckVerificationVIN(VINValue)}
            errorMessage={!CheckVerificationVIN(VINValue) ? "VIN non valido" : undefined}
            value={VINValue}
            styles={titleFieldStyles}
            onChange={(_, value) => SetOnchange(value ?? "") }         
          />
          {isTextVisible && 
          <div ref={containerRef} style={{ width: '100%', minWidth: 0, display: 'block' , maxHeight: '300px', overflowY: 'scroll' }}>
            {isTextVisible && 
            <TextField
                multiline 
                autoAdjustHeight 
                scrollContainerRef={containerRef}
                value={APIValue}
                styles={titleFieldStyles}
                readOnly
            />}
          </div>}
        </div>
    )
}

export const displayDitails = React.memo(ShowDetails);