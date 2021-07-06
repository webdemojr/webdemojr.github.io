export var task = {
    "category_id":"",
    "id":"",
    "title":""
}


export function CreateTask(category_id, title){
    task["category_id"] = category_id;
    task["id"] = CreateTaskID();
    task["title"] = title;

    return task;
}

function CreateTaskID(){
    let code = "TAS";
    let time = new Date().getTime().toString();
    let identifier = code + time;
    return identifier;
}