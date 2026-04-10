export const CheckVerificationVIN = (value: string) : boolean  => {
    const effectivVIN = value.trim().replace(/\s+/g, '');
    const regexCodiceToUpperCase = /^[A-HJ-NPR-Z0-9]{17}$/;
    const regexCodeForRepetition = /^(.)\1*$/;
    return (
        effectivVIN.length == 17 
        && regexCodiceToUpperCase.test(effectivVIN) 
        && !regexCodeForRepetition.test(effectivVIN) 
        && !CheckIfContainRepeticion(effectivVIN)
    )
}

const CheckIfContainRepeticion = (value :string): boolean => {
    if(!value) {return false}
    return (value + value).slice(1, -1).includes(value);    
}