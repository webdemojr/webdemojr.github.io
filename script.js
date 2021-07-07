import * as User from './js/user.js';
import * as C from './js/category.js';
import * as T from './js/task.js';

var colorChoice;

$(document).ready(function(){


    $(".user-wallet-icon").text(User.user.wallet_icon);

    // Category
    $(".button-add-category").click(function(){
        AddNewCategory();
    });

    $(".category-list").on("click", ".category", function(){
        OpenCategory($(this).attr("id"));
    });

    $(".specific-category-delete").click(function(){
        let cat_id = $(".specific-category").attr("id");
        User.DeleteCategory(cat_id);
        GenerateCategories();
        $(".specific-category").addClass("display-none");
        $(".category-container").removeClass("display-none");
    });


    // On Enter Commands
    $("#InputCategory").keyup(function(event) {
        if (event.keyCode === 13) {
            $(".button-add-category").click();
        }
    });

    $("#InputTask").keyup(function(event) {
        if (event.keyCode === 13) {
            $(".button-add-task").click();
        }
    });


    // Tasks
    $(".go-back-from-task").click(function(){
        $(".specific-category").addClass("display-none");
        $(".category-container").removeClass("display-none");
    });

    $(".button-add-task").click(function(){
        AddNewTask();
    });

    // Task List Commands
    $(".task-list").on("click", ".task-delete", function(){
        Delete($(this));
    });


    $(".task-list").on("click", ".task-check", function(){
        Delete($(this));
        User.AddtoWallet(1);
        $(".user-wallet-amount").text(User.GetWallet());
    });






});


// Category
function AddNewCategory(){
    let input = $("#InputCategory").val().trim();

    if(input != ""){
        let new_cat = C.CreateCategory(input);
        let clone = {...new_cat};
        User.AddCategory(clone);
        GenerateCategories();
    }

    $("#InputCategory").val("");

}

function GenerateCategories(){
    $(".category-list").empty();
    let list = User.GetCategories();
    for(let i = 0 ; i < list.length; i++){
        let $divcategory = $("<div id='" + list[i].id  + "' class='category'><span class='category-title'>" + list[i].title + "</span></div>");
        $(".category-list").append($divcategory);
    }
}

function OpenCategory(id){
    $(".category-container").addClass("display-none");
    let $thiscategory = User.GetSpecificCategory(id);
    $(".specific-category").removeClass("display-none");

        $(".specific-category h2").text($thiscategory.title);
        $(".specific-category").attr("id",$thiscategory.id);
        GenerateTasks($thiscategory.id);

}




// Task
function GenerateTasks(cat_id){
    $(".task-list").empty();

    let user_tasks = User.GetTasks();

    let $emptytasks = $("<div class='empty-task-container'>No tasks yet!</div>")

    if(user_tasks.length != 0){

        var task_list = user_tasks.filter(x => {
            return x.category_id == cat_id;
        });

        if(task_list.length != 0){
            for(let i = 0 ; i < task_list.length; i++){
                BuildTask(task_list[i]);
            }
        }else{
            $(".task-list").append($emptytasks);
        }


    }else{

        $(".task-list").append($emptytasks);
    }

    
}

function AddNewTask(){
    let input = $("#InputTask").val().trim();

    if(input != ""){
        let specificCategoryID = $(".specific-category").attr("id");
        let task = T.CreateTask(specificCategoryID, input);
    
    
        let clone = {...task};
        User.AddTask(clone);
        GenerateTasks(specificCategoryID);
    }

    $("#InputTask").val("");
}

function BuildTask(t){
    let $taskcontainer = $("<div id='" + t.id + "' class='task-container'></div>");
    let $taskcheck = $("<div data-target='" + t.id + "' class='task-check'><img src='/assets/icons/checkmark.svg'></div>");
    let $tasktitle = $("<div class='task-title'>" + t.title + "</div>");
    let $taskdetails = $("<div class='task-details'></div>");
    let $taskdelete = $("<div data-target='" + t.id + "' class='task-delete'><img src='/assets/icons/delete.svg'></div>");
    
    $taskdetails.append($taskdelete);

    $taskcontainer.append($taskcheck);
    $taskcontainer.append($tasktitle);
    $taskcontainer.append($taskdetails);

    $(".task-list").append($taskcontainer);
}


function Delete($this){
    $this.addClass("display-none");
    let thisdatatarget = $this.attr("data-target");
    User.DeleteTask(thisdatatarget);
    let cat_id = $(".specific-category").attr("id");
    GenerateTasks(cat_id);
}