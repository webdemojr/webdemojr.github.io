export var category = {
    "id":"",
    "title":"",
    "color":""
}

export function CreateCategory(title, color){
    category["id"] = CreateCategoryID();
    category["title"] = title;
    category["color"] = color;

    return category;
}

export function GetCategory(){
    return category;
}

function CreateCategoryID(){
    let code = "CAT";
    let time = new Date().getTime().toString();
    let identifier = code + time;
    return identifier;
}

export function GetCategoryID(){
    return category["id"];
}



