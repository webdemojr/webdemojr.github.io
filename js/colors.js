export const list = [
    {
        id:"CLR00",
        colorHEX:"#4ab1f6",
        name:"Balsamic Blue"
    },
    {
        id:"CLR01",
        colorHEX:"#55db8b",
        name:"Leafy Green"
    },
    {
        id:"CLR02",
        colorHEX:"#fa8b4b",
        name:"Organic Orange"
    },
    {
        id:"CLR03",
        colorHEX:"#ff5e5e",
        name:"Rowdy Red"
    },
    {
        id:"CLR04",
        colorHEX:"#ff9cda",
        name:"Powerful Pink"
    }
]

export function GetSpecificColor(id){
    let found = list.find(x => x.id == id);
    if(found){
        return found;
    }
}