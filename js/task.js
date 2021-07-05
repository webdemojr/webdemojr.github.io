export var task = {
    "category_id":"",
    "id":"",
    "title":"",
    "importance":0
}


export function CreateTask(category_id, title, importance){
    task["category_id"] = category_id;
    task["id"] = CreateTaskID();
    task["title"] = title;
    task["importance"] = importance;

    return task;
}

function CreateTaskID(){
    let code = "TAS";
    let time = new Date().getTime().toString();
    let identifier = code + time;
    return identifier;
}