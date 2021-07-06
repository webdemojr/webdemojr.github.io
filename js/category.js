export var category = {
    "id":"",
    "title":""
}

export function CreateCategory(title){
    category["id"] = CreateCategoryID();
    category["title"] = title;

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



