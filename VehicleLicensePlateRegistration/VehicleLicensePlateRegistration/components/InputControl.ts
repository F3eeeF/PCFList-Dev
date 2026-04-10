/* eslint-disable @typescript-eslint/no-unsafe-assignment */
localStorage.setItem("LocationPrefix", "");

const COUNTRY = {
    CODE : {
        "DE" : "DE",
        "AT" : "AT",
        "IT" : "IT",
        "CH" : "CH"
    }
}


export const ControlInput = (value: string, country: string, elettricFlag : string, filterLocation: string[]) : boolean => {
    switch(country){
        case COUNTRY.CODE.DE :
            {
                setPrefixLength(value, filterLocation);
                const separetor = Number(localStorage.getItem("LocationPrefix"));
                if(value.length > 8) {return false}
                //let isElectric = false;
                //if(elettricFlag == "565220002" || elettricFlag == "565220001") {isElectric = true}
                const subString = value.substring(separetor ?? 1);
                if( (!/^[a-zA-Z]{2}/.test(subString))) {return false}
                //if(isElectric && !subString.endsWith("E")) {return false}
            }
            return true;
        case COUNTRY.CODE.AT :
            {
                setPrefixLength(value, filterLocation);
                const separetor = Number(localStorage.getItem("LocationPrefix"));
                const subString = value.substring(separetor ?? 2);
                if(subString.length != 5){return false}
                if((!/^[a-zA-Z]{1}[a-zA-Z0-9]{3}[0-9]{1}$/.test(subString))) {return false}
                return true;
            }
        case COUNTRY.CODE.IT :
            { 
                if(value.length != 7) {return false}
                if((!/^[a-zA-Z]{2}[0-9]{3}[a-zA-Z]{2}$/.test(value))) {return false}
                return true; 
            }
        case COUNTRY.CODE.CH :
           {
                let prefix; 
                if(value.length > 2) {prefix = value.slice(0, 2)}
                if(value.length > 9) {return false}
                const subString = value.slice(2, value.length);
                if(prefix == "ZH"){
                    if((!/^[0-9]{7}$/.test(subString))) {return false}
                    return true;
                }
                if((!/^[0-9]{6}$/.test(subString))) {return false}
                return true;
           }
    }
    return false;
}


const setPrefixLength = (value: string, filterArray: string[]) :void => {
    if(!value) {return}
    const maxPrefix = filterArray.reduce((max, current) => {
        return current.length > max.length ? current : max;
    }, "");

    for(let i = 0; i < maxPrefix.length + 1; i++){
        const filter = filterArray.filter((elem: string) => elem == value.slice(0, i)); 
        if(filter.length > 0){
            localStorage.setItem("LocationPrefix", `${filter[0].length}`)
        }
    }
} 
