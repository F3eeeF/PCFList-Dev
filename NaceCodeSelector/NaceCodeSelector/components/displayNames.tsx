import * as React from 'react';
import { TextField, ITextFieldStyles } from '@fluentui/react';
import { mergeStyleSets, DefaultButton, FocusTrapZone, IButtonStyles , Popup } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { dataObjectSet } from './dataSet';


export interface dataToSend {
    dataCollector: Promise<ComponentFramework.WebApi.Entity[]>;
    onValueChange: (newVal: string) => void;
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
const popupStyles = mergeStyleSets({
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  popup: {
    minWidth: 420,
    maxWidth: 520,
    backgroundColor: "#ffffff",
    border: "1px solid #d1d1d1",
    borderRadius: 2,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
    overflow: "hidden",
    color: "#323130",
    fontFamily:
      '"Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    padding: "0 16px",
    backgroundColor: "#f3f2f1",
    borderBottom: "1px solid #edebe9",
  },

  title: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "22px",
    color: "#323130",
    margin: 0,
  },

  body: {
    padding: 16,
    backgroundColor: "#ffffff",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: 12,
    backgroundColor: "#faf9f8",
    borderTop: "1px solid #edebe9",
  },

  closeButton: {
    width: 32,
    height: 32,
    minWidth: 32,
    border: "1px solid transparent",
    borderRadius: 2,
    backgroundColor: "transparent",
    color: "#605e5c",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    selectors: {
      ":hover": {
        backgroundColor: "#f3f9fd",
        borderColor: "#d1d1d1",
        color: "#323130",
      },
      ":active": {
        backgroundColor: "#e5f1fb",
        color: "#201f1e",
      },
      ":focus": {
        outline: "none",
        borderColor: "#0078d4",
        boxShadow: "0 0 0 1px #0078d4 inset",
      },
    },
  },
});
const dynamicsPrimaryButtonStyles: IButtonStyles = {
  root: {
    height: 32,
    minWidth: 100,
    background: "#0078d4",
    color: "#ffffff",
    border: "1px solid #0078d4",
    borderRadius: 2,
    boxShadow: "none",
    padding: "0 16px",
  },
  rootHovered: {
    background: "#106ebe",
    borderColor: "#106ebe",
    color: "#ffffff",
  },
  rootPressed: {
    background: "#005a9e",
    borderColor: "#005a9e",
    color: "#ffffff",
  },
  rootDisabled: {
    background: "#c8c6c4",
    borderColor: "#c8c6c4",
    color: "#ffffff",
  },
};
const dynamicsButtonStylesValidateFileds: IButtonStyles = {
   root: {
    height: 32,
    minWidth: 100,
    background: "#ffffff",
    color: "#323130",
    border: "1px solid #d1d1d1",
    borderRadius: 2,
    boxShadow: "none",
    padding: "0 16px",
  },
  rootHovered: {
    background: "#f3f9fd",
    borderColor: "#8a8886",
    color: "#201f1e",
  },
  rootPressed: {
    background: "#e5f1fb",
    borderColor: "#605e5c",
    color: "#201f1e",
  },
  rootDisabled: {
    background: "#f3f2f1",
    borderColor: "#edebe9",
    color: "#a19f9d",
  },
};
const dynamicsButtonStylesClearFields: IButtonStyles = {
  root: {
    marginRight: "auto",
    height: 32,
    minWidth: 100,
    background: "#ffffff",
    color: "#323130",
    border: "1px solid #d1d1d1",
    borderRadius: 2,
    boxShadow: "none",
    padding: "0 16px",
  },
  rootHovered: {
    background: "#f3f9fd",
    borderColor: "#8a8886",
    color: "#201f1e",
  },
  rootPressed: {
    background: "#e5f1fb",
    borderColor: "#605e5c",
    color: "#201f1e",
  },
  rootDisabled: {
    background: "#f3f2f1",
    borderColor: "#edebe9",
    color: "#a19f9d",
  },
};
const dropdownStyles: Partial<IDropdownStyles> = {
  root: {
    width: "100%",
  },

  dropdown: {
    border: "1px solid #8a8886",
    borderRadius: 2,
    backgroundColor: "#ffffff",
    selectors: {
      ":hover": {
        borderColor: "#605e5c",
      },
      ":focus": {
        borderColor: "#0078d4",
      },
      ":after": {
        border: "none",
      },
    },
  },

  title: {
    minHeight: 32,
    lineHeight: 30,
    fontSize: 14,
    color: "#323130",
    backgroundColor: "#ffffff",
    paddingLeft: 12,
    paddingRight: 32,
    borderRadius: 2,
  },

  caretDownWrapper: {
    right: 8,
  },

  caretDown: {
    color: "#605e5c",
    fontSize: 12,
  },

  callout: {
    borderRadius: 2,
    boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
    border: "1px solid #edebe9",
  },

  dropdownItemsWrapper: {
    paddingTop: 4,
    paddingBottom: 4,
  },

  dropdownItem: {
    minHeight: 32,
    lineHeight: 20,
    fontSize: 14,
    color: "#323130",
    backgroundColor: "#ffffff",
    selectors: {
      ":hover": {
        backgroundColor: "#f3f9fd",
        color: "#201f1e",
      },
    },
  },

  dropdownItemSelected: {
    backgroundColor: "#e5f1fb",
    color: "#201f1e",
    selectors: {
      ":hover": {
        backgroundColor: "#dbeaf7",
      },
    },
  },

  dropdownOptionText: {
    fontSize: 14,
  },
};
//-------------------------------------STYLE-------------------------------------//


const Display = (props: dataToSend) => {
  const index = 3;
  const [textValue, setTextValue] = React.useState<string>('');
  const [dataValue, setDataValue] = React.useState<IDropdownOption[][]>([])
  const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
  const [isTextVisible, { setTrue: showText, setFalse: hideText }] = useBoolean(false);

  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      const opt = dataObjectSet(await props.dataCollector);
      setDataValue(opt);
    };
    void loadData();
  }, [props.dataCollector, props.onValueChange]); 

  const getInitialSelectedKeys = React.useCallback(
    () => dataValue.map(options => options[0]?.key),
    [dataValue]
  );
  const [selectedKeys, setSelectedKeys] = React.useState<(string | number | undefined)[]>(
    getInitialSelectedKeys()
  );
  const filterOptionsSet = React.useCallback(
    (level: number): string => {
      const key = selectedKeys[level];
      const option = (dataValue[level] ?? []).find(x => x.key == key);
      return option?.text ?? '';
    },
    [dataValue, selectedKeys]
  );
  
  const handleDropdownChange = (index: number , elem?: IDropdownOption) => {
    
    setSelectedKeys(prev => {
      const update = [...prev];
      update[index] = elem?.key;
      for(let i  = index + 1; i < update.length; i++) {update[i] = "0"}
      return update;
    });
  }
  const handleClearFields = () => {
    setSelectedKeys(getInitialSelectedKeys());
  };

  const showSelectedElem = () => {
    const selectedElem = selectedKeys
      .map((key, index) => {
        const selectedOption = dataValue[index].find(option => option.key == key);
        if(index == 3){return selectedOption?.text ?? ""}
      })
      .join("");
    props.onValueChange(selectedElem);
    setTextValue(selectedElem);
  }
  const choiceFirstOptions = dataValue[index - 3] ?? [];
  const choiceSecondOptions = (dataValue[index - 2] ?? []).filter(opt => opt.text.includes(filterOptionsSet(index - 3)));
  const choiceThirdOptions = (dataValue[index - 1] ?? []).filter(opt => opt.text.includes(filterOptionsSet(index - 2)));
  const choiceFourthOptions = (dataValue[index] ?? []).filter(opt => opt.text.includes(filterOptionsSet(index - 1)));

    return (
        <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
          {!isPopupVisible && <DefaultButton styles={dynamicsPrimaryButtonStyles} onClick={() => {showPopup(); hideText()}} text="Nace Code Multi Selector" />}
          {isPopupVisible &&
          <div className={popupStyles.overlay}>
            <Popup
              className={popupStyles.popup}
              role="choise"
              aria-modal="true"
              onDismiss={hidePopup}
            >
              <FocusTrapZone>
                <div className={popupStyles.body}>
                    <Dropdown
                      label="Nace Code Level 1"
                      options={choiceFirstOptions}
                      selectedKey={selectedKeys[index - 3]}
                      onChange={(_,elem) => handleDropdownChange(index - 3, elem)}
                      styles={dropdownStyles}
                      />
                      <Dropdown
                      label="Nace Code Level 2"
                      options={choiceSecondOptions}
                      selectedKey={selectedKeys[index - 2]}
                      onChange={(_,elem) => handleDropdownChange(index - 2, elem)}
                      styles={dropdownStyles}
                      />
                      <Dropdown
                      label="Nace Code Level 3"
                      options={choiceThirdOptions}
                      selectedKey={selectedKeys[index - 1]}
                      onChange={(_,elem) => handleDropdownChange(index - 1, elem)}
                      styles={dropdownStyles}
                      />
                      <Dropdown
                      label="Nace Code Level 4"
                      options={choiceFourthOptions}
                      selectedKey={selectedKeys[index]}
                      onChange={(_,elem) => handleDropdownChange(index, elem)}
                      styles={dropdownStyles}
                      />
                      <div style={{ height: "20px" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" , gap: "16px",}}>
                        <DefaultButton styles={dynamicsButtonStylesValidateFileds} onClick={() => {showSelectedElem(); hidePopup(); showText()}}>Validate Fields</DefaultButton>
                        <DefaultButton styles={dynamicsButtonStylesClearFields} onClick={handleClearFields}>Clear Fields</DefaultButton>
                      </div>
                  </div>
                </FocusTrapZone>
              </Popup>
            </div>
          }
            {isTextVisible && 
            <TextField
            value={textValue}
            styles={titleFieldStyles}
            readOnly
            />}
        </div>
        )
}
export const displayNames = React.memo(Display);