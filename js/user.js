export var user = 
    {
        "id":"",
        "name":"",
        "categories":[],
        "tasks":[],
        "theme_id":"",
        "wallet":0,
        "wallet_icon":"🍉",
        "level":0,
        "badges":[]
    }
;


// Category

export function GetCategories(){
    return user["categories"];
}

export function AddCategory(category){
    user["categories"].push(category);
}

export function DeleteCategory(catid){

    let foundindex;

    for(let i = 0; i < user.categories.length; i++){
        if(user.categories[i].id == catid){
            foundindex = i;
            break;
        }
    }

    if (foundindex >= 0) {
        user.categories.splice(foundindex, 1);
    }

    let newtasksarr = user.tasks.filter(x => x.category_id != catid);
    user.tasks = newtasksarr;

    console.log(user.tasks);
}

export function GetSpecificCategory(id){
    let found = user.categories.find(x => x.id == id);
    if(found){
        return found;
    }
}



// Task

export function GetTasks(){
    return user["tasks"];
}

export function AddTask(task){
    user["tasks"].push(task);
}

export function DeleteTask(taskid){

    let foundindex;

    for(let i = 0; i < user.tasks.length; i++){
        if(user.tasks[i].id == taskid){
            foundindex = i;
            console.log("Found: " + i);
            break;
        }
    }

    if (foundindex >= 0) {
        user.tasks.splice(foundindex, 1);
    }
}

// Wallet

export function AddtoWallet(amount){
    user.wallet += amount;
}

export function GetWallet(){
    return user.wallet;
}