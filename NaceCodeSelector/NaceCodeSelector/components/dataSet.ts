import { IDropdownOption } from '@fluentui/react/lib/Dropdown';

const selectLabel = {
    Section: "565220000",
    Division: "565220001",
    Group: "565220002",
    Class: "565220003"
}


export const dataObjectSet = (data: ComponentFramework.WebApi.Entity[]) : (IDropdownOption[])[] => {
    const firstDropdownLevel:IDropdownOption[] = [{key: "0", text: "Empty"}];
    const secondDropdownLevel:IDropdownOption[] = [{key: "0", text: "Empty"}];
    const thirdDropdownLevel:IDropdownOption[] = [{key: "0", text: "Empty"}];
    const fourthDropdownLevel:IDropdownOption[] = [{key: "0", text: "Empty"}];
    for (const entity of data)
    {
        switch (entity.emd_levelcode){
            case Number(selectLabel.Section): 
                firstDropdownLevel.push({key: `${firstDropdownLevel.length}`, text: `${entity.emd_displaycode ?? ""}`});
                break;
            case Number(selectLabel.Division): 
                secondDropdownLevel.push({key: `${secondDropdownLevel.length}`, text: `${entity.emd_displaycode ?? ""}`}); 
                break;
            case Number(selectLabel.Group):
                thirdDropdownLevel.push({key: `${thirdDropdownLevel.length}`, text: `${entity.emd_displaycode ?? ""}`});
                break;
            case Number(selectLabel.Class):
                fourthDropdownLevel.push({key: `${fourthDropdownLevel.length}`, text: `${entity.emd_displaycode ?? ""}`});
                break;
        }
    }
    return [firstDropdownLevel,secondDropdownLevel,thirdDropdownLevel,fourthDropdownLevel];
} 