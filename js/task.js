export var task = {
    "category_id":"",
    "id":"",
    "title":"",
    "isToday":false
}


export function CreateTask(category_id, title, isToday){
    task["category_id"] = category_id;
    task["id"] = CreateTaskID();
    task["title"] = title;
    task.isToday = isToday;
    return task;
}

function CreateTaskID(){
    let code = "TAS";
    let time = new Date().getTime().toString();
    let identifier = code + time;
    return identifier;
}