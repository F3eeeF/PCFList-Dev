import * as React from 'react';
import { TextField, ITextFieldStyles } from '@fluentui/react';

export interface dataToSend {
  dataRecord: Promise<string[]>;
  onValueChange: (newVal: string) => void;
}

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

const InsertMergeData = (props: dataToSend) => {
  const [textValue, setTextValue] = React.useState<string>('');

  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      const dataResult = await props.dataRecord;
      let mergeValue = "";
      let i = dataResult.length;
      for(const data of dataResult){
        mergeValue += data ?? "null";
        if(i % 2 == 0) {mergeValue += "-"}
        else { if(i - 1 != 0) {mergeValue += "_"} }
        i--;
      }
      setTextValue(mergeValue);
      props.onValueChange(mergeValue);
    };
    void loadData();
  }, [props.dataRecord, props.onValueChange]);

  return (
    <div style={{ width: '100%', minWidth: 0, display: 'block' }}>
      <TextField
        value={textValue}
        styles={titleFieldStyles}
        readOnly
      />
    </div>
  );
};

export const mergeData = React.memo(InsertMergeData);