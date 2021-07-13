import * as User from './js/user.js';
import * as C from './js/category.js';
import * as T from './js/task.js';
import * as Clr from './js/colors.js';

var colorSelected;
var taskNow = true;
var taskLater = false;
var categorySelected;

$(document).ready(function(){


    


    

    CheckTime();
    setInterval(CheckTime,60*1000);






    //New

    if($(".entry-category").hasClass("selected-icon")){

        $(".entry-task").removeClass("selected-icon");
        $(".entry-time").addClass("display-none");
        $(".ctgrs-container").addClass("display-none");
        for(let i=0; i<Clr.list.length;i++){
            let $clr = $("<div id='" + Clr.list[i].id + "' class='clr-list-item'><span class='clr-list-item-ball' style='background-color:" + Clr.list[i].colorHEX + "'></span></div>");
            if(i == 0){
                $clr.addClass("clr-list-item-selected");
            }
            $(".clrs-container").append($clr);
        }
    }



    $(".entry-task").click(function(){
        if(!$(".entry-task").hasClass("selected-icon")){
            $(".entry-task").addClass("selected-icon");
            $(".entry-category").removeClass("selected-icon");
            $(".entry-time").removeClass("display-none");
            $(".clrs-container").addClass("display-none");
            $(".ctgrs-container").removeClass("display-none");
            $(".creator-button-name").text("Task");


            if($(".ctgrs-container").hasClass("no-ctgr-selected")){
                $(".ctgrs-container").addClass("unavailable-color");
                $(".ctgrs-container").text("Tap Here to Select Category");
            }
        }
    });

    $(".entry-category").click(function(){
        if(!$(".entry-category").hasClass("selected-icon")){
            $(".entry-category").addClass("selected-icon")
            $(".entry-task").removeClass("selected-icon");
            $(".entry-time").addClass("display-none");
            $(".clrs-container").removeClass("display-none");
            $(".ctgrs-container").addClass("display-none");
            $(".creator-button-name").text("Category");
        }
    });

    $(".clrs-container").on("click", ".clr-list-item", function(){
        $(this).addClass('clr-list-item-selected').siblings().removeClass('clr-list-item-selected');
        colorSelected = $(this).attr("id");
    });

    $(".entry-now").click(function(){
        if(!$(".entry-now").hasClass("selected-icon")){
            $(".entry-now").addClass("selected-icon");
            $(".entry-later").removeClass("selected-icon");
            taskNow = true;
            taskLater = false;
        }
    });

    $(".entry-later").click(function(){
        if(!$(".entry-later").hasClass("selected-icon")){
            $(".entry-later").addClass("selected-icon");
            $(".entry-now").removeClass("selected-icon");
            taskNow = false;
            taskLater = true;
        }
    });

    $(".ctgrs-container").click(function(){
        $(".options-selector").removeClass("display-none");
        $("html,body").addClass("overflow-hidden");
    });

    $(".close-options").click(function(){
        $(".options-selector").addClass("display-none");
        $("html,body").removeClass("overflow-hidden");
    });

    $(".options-selector-items-list").on("click", ".options-selector-item", function(){
        $(".options-selector").addClass("display-none");
        $("html,body").removeClass("overflow-hidden");
        categorySelected = $(this).attr("id");
        $(".ctgrs-container").removeClass("unavailable-color");
        let cat_found = User.GetSpecificCategory(categorySelected);
        $(".ctgrs-container").text(cat_found.title);
        $(".ctgrs-container").removeClass("no-ctgr-selected");
    });

    $(".creator-button").click(function(){
        CreateUserInput();
    });

    $("#CreatorInput").keyup(function(event){
        if(event.keyCode == 13){  
            CreateUserInput();
        }
    });

    $(".today-list").on("click", ".task-cancel", function(){
  
        let $thisid = $(this).data("target");
        User.RemoveTaskfromToday($thisid);
        console.log(User.user);
        let task = User.GetSpecificTask($thisid);
        let specific_cat = User.GetSpecificCategory(task.category_id);
        BuildTodayTasks();
        BuildTasks(specific_cat);
    });

    $(".today-list").on("click", ".task-delete", function(){
  
        let $thisid = $(this).data("target");
        DeleteThisTask($thisid);
    });

    $(".specific-category-tasks").on("click", ".task-delete", function(){
  
        let $thisid = $(this).data("target");
        DeleteThisTask($thisid);
        
    });

    $(".specific-category-tasks").on("click", ".task-to-today", function(){
        let taskid = $(this).data("target");

        if(!$(this).hasClass("selected-icon")){
            User.AddTasktoToday(taskid);
            BuildTodayTasks();
            $(this).addClass("selected-icon");
        }else{
            User.RemoveTaskfromToday(taskid);
            BuildTodayTasks();
            $(this).removeClass("selected-icon");
        }
        
    });


    $(".categories-list").on("click", ".category", function(){
        let $thisid = $(this).attr("id");
        OpenCategory($thisid);
    });

    // $('.specific-category-input').on("input", function() {
    //     var dInput = this.value;
    //     var thisid = this.attr("id");
    //     User.ChangeCategoryTitle(thisid, dInput);
    // });

    $(".today-list").on("click", ".task-category", function(){
        let $thisid = $(this).attr("id");
        OpenCategory($thisid);
    });

    $(".go-back").click(function(){
        $(".specific-category").addClass("display-none");
        $(".categories").removeClass("display-none");
        OpenCategories();
    });

    $(".utility-belt-solo").click(function(){
        if($(".creator").hasClass("creator-hide")){
            $(".creator").removeClass("creator-hide");
            $(".utility-belt-solo").addClass("focused-utility");
            $(".user-create i").removeClass("ph-plus").addClass("ph-x");
            $("#CreatorInput").focus();
        }else{
            $(".creator").addClass("creator-hide");
            $(".utility-belt-solo").removeClass("focused-utility");
            $(".user-create i").addClass("ph-plus").removeClass("ph-x");
        }
    });


    $(".utility-belt-edge > div").click(function(){
        $(this).addClass("user-utility-belt-active").siblings().removeClass('user-utility-belt-active');
        if($(this).hasClass("user-categories")){
            OpenCategories();
        }else if($(this).hasClass("user-shop")){

        }else if($(this).hasClass("user-profile")){

        }else if($(this).hasClass("user-home")){
            OpenHome();
        }
    });

    
    $(".specific-category-delete").click(function(){
        let $thisid = $(this).attr("id");
        User.DeleteCategory($thisid);
        OpenCategories();
    });

    $(".specific-category-edit").click(function(){
        let $thisid = $(this).attr("id");
        let thiscat = User.GetSpecificCategory($thisid);
        $(".edit-specific-category-window").removeClass("display-none");
        $(".edit-specific-category-window-input").val(thiscat.title);
        $(".submit-new-category").data("target",$thisid);

        for(let i=0; i<Clr.list.length;i++){
            let $clr = $("<div id='" + Clr.list[i].id + "' class='clr-list-item'><span class='clr-list-item-ball' style='background-color:" + Clr.list[i].colorHEX + "'></span></div>");
            if(Clr.list[i].id == thiscat.color){
                $clr.addClass("clr-list-item-selected");
            }
            $(".edit-specific-category-window-clrs-container").append($clr);
        }
    });

    $(".edit-specific-category-window-clrs-container").on("click", ".clr-list-item", function(){
        $(this).addClass('clr-list-item-selected').siblings().removeClass('clr-list-item-selected');
        colorSelected = $(this).attr("id");
    });

    $(".close-edit-specific-category").click(function(){
        $(".edit-specific-category-window").addClass("display-none");
        $(".edit-specific-category-window-clrs-container").empty();
    });

    $(".submit-new-category").click(function(){
        let cat_id = $(this).data("target");
        let new_cat_title = $(".edit-specific-category-window-input").val().trim();

        if(new_cat_title != ""){
            let input_healthy = CheckTextHealth(new_cat_title);

            if(input_healthy){
                User.UpdateCategory(cat_id, new_cat_title, colorSelected);
                $(".edit-specific-category-window").addClass("display-none");
                $(".edit-specific-category-window-clrs-container").empty();
                OpenCategory(cat_id);
                let user_cat = User.GetCategories();
                BuildCategoryOptions(user_cat);
                $(".ctgrs-container").text(new_cat_title);
            }
        }
        
    });

});


function OpenHome(){
    BuildTodayTasks();
    $(".categories").addClass("display-none");
    $(".today").removeClass("display-none");
    $(".specific-category").addClass("display-none");
}

function OpenCategories(){
    BuildCategories();
    $(".categories").removeClass("display-none");
    $(".today").addClass("display-none");
    $(".specific-category").addClass("display-none");
}

function OpenShop(){

}

function OpenProfile(){

}

function CreateUserInput(){
            let input = $("#CreatorInput").val().trim();

            if(input != ""){
                let input_healthy = CheckTextHealth(input);

                if(input_healthy){
                    if($(".entry-category").hasClass("selected-icon")){
                        if(colorSelected == undefined){
                            colorSelected = "CLR00";
                        }
                        let new_cat = C.CreateCategory(input, colorSelected);
                        let clone = {...new_cat};
                        User.AddCategory(clone);
                        let user_cat = User.GetCategories();
                        console.log(user_cat);
                        $("#CreatorInput").val("");
                        
                        BuildCategoryOptions(user_cat);
                        BuildCategories();
    
                        $(".creator-message").addClass("show-creator-message").addClass("message-success").removeClass("message-error");
                        $(".creator-message").text("Successfully Added!");
                        setTimeout(function(){ $(".creator-message").removeClass("show-creator-message"); }, 1000);
                        
                    }else if($(".entry-task").hasClass("selected-icon")){
                        console.log(categorySelected);
                        if(categorySelected != undefined){
    
                            if(taskNow){
    
                            
                                let new_task = T.CreateTask(categorySelected, input, true);
                                let clone = {...new_task};
                                User.AddTask(clone);
                                
                                let specific_cat = User.GetSpecificCategory(categorySelected);
        
                                BuildTodayTasks();
                                BuildTasks(specific_cat);
        
                            }else if(taskLater){
                                let new_task = T.CreateTask(categorySelected, input, false);
                                let clone = {...new_task};
                                User.AddTask(clone);
    
                                let specific_cat = User.GetSpecificCategory(categorySelected);
                                BuildTasks(specific_cat);
        
                            } 
                            $("#CreatorInput").val("");
                            $(".creator-message").addClass("show-creator-message").addClass("message-success").removeClass("message-error");
                            $(".creator-message").text("Successfully Added!");
                            setTimeout(function(){ $(".creator-message").removeClass("show-creator-message"); }, 1000);
                        }else{
                            $(".creator-message").addClass("show-creator-message").removeClass("message-success").addClass("message-error");
                            $(".creator-message").text("Please Select a Category!");
                            setTimeout(function(){ $(".creator-message").removeClass("show-creator-message"); }, 2000);
                        }
                        
    
                    }
                }else{
                    $("#CreatorInput").val("");
                }
                
            }else{
                $("#CreatorInput").val("");
            }

}


function OpenCategory($thisid){
    
    let thiscat = User.GetSpecificCategory($thisid);
    let clr = Clr.GetSpecificColor(thiscat.color);

    $(".specific-category-title").text(thiscat.title);
    $(".specific-category-hashtag").css("color",clr.colorHEX);
    $(".specific-category-delete").attr("id",$thisid);
    $(".specific-category-edit").attr("id",$thisid);

    $(".user-categories").addClass("user-utility-belt-active").siblings().removeClass('user-utility-belt-active');
    $(".today").addClass("display-none");
    $(".categories").addClass("display-none");
    $(".specific-category").removeClass("display-none");

    BuildTasks(thiscat);
}

function BuildCategories(){
    let user_categories = User.GetCategories();


    let categorieslist = $(".categories-list");
    categorieslist.empty();


    for(let i=user_categories.length-1; i>=0;i--){
        let colorfound = Clr.GetSpecificColor(user_categories[i].color);
        let $category = $("<span id='" + user_categories[i].id + "' class='category'><span class='category-icon'><i class='ph-hash' style='color:" + colorfound.colorHEX + "'></i></span><span class='category-title'>" + user_categories[i].title + "</span></span>")
        categorieslist.append($category);
    }
}

function BuildCategoryOptions(list){
    $(".options-selector-items-list").empty();
    for(let i=list.length-1; i>=0; i--){

        let foundClr = Clr.list.find(x => x.id == list[i].color);

        let $option_item = $("<div id='" + list[i].id + "' class='options-selector-item'><span class='option-item-icon'><i class='ph-hash' style='color:" + foundClr.colorHEX + "'></i></span><span class='option-item-name'>" + list[i].title + "</span></div>")
        $(".options-selector-items-list").append($option_item);

    }
}

function BuildTodayTasks(){

    let user_tasks = User.GetTasks();


    let todaylist = $(".today-list");
    todaylist.empty();

    let today_tasks = user_tasks.filter(x => x.isToday == true);

    for(let i=today_tasks.length-1; i>=0;i--){
        let specificCategory = User.GetSpecificCategory(today_tasks[i].category_id);
        let colorfound = Clr.GetSpecificColor(specificCategory.color);
        
       let $taskcontainer = $("<div id='" + today_tasks[i].id + "' class='task-container' style='border-left:2px solid " + colorfound.colorHEX +"'></div>");
       let $taskdetails = $("<div class='task-inner-container task-details'></div>");
       let $taskcategory = $("<div id='" + specificCategory.id + "' class='task-category' style='color:" + colorfound.colorHEX + "'><i class='ph-hash'></i>" + specificCategory.title + "</div><div class='task-title'>" + today_tasks[i].title + "</div>");
       let $taskactions = $("<div class='task-inner-container task-actions'></div>");
       let $taskactionsicons = $("<div data-target='" + today_tasks[i].id + "' class='task-check'><i class='ph-check'></i></div><div data-target='" + today_tasks[i].id + "' class='task-cancel'><i class='ph-x'></i></div><div data-target='" + today_tasks[i].id + "' class='task-delete'><i class='ph-trash'></i></div>");
            
       $taskdetails.append($taskcategory);
       $taskactions.append($taskactionsicons);
       $taskcontainer.append($taskdetails);
       $taskcontainer.append($taskactions);
    
       todaylist.append($taskcontainer);
    }


}

function BuildTasks(category){
    let user_tasks = User.GetTasks();
    let taskslist = user_tasks.filter(x => x.category_id == category.id);
    let colorfound = Clr.GetSpecificColor(category.color);
    let specificCategoryTasks = $(".specific-category-tasks");
    specificCategoryTasks.empty();

    for(let i=taskslist.length-1;i>=0;i--){
        let $taskcontainer = $("<div id='" + taskslist[i].id + "' class='task-container'></div>");
        let $taskdetails = $("<div class='task-inner-container task-details'></div>");
        let $taskcategory = $("<div class='task-title'>" + taskslist[i].title + "</div>");
        let $taskactions = $("<div class='task-inner-container task-actions'></div>");
        let $taskactionsicons;

        if(taskslist[i].isToday){
            $taskactionsicons = $("<div data-target='" + taskslist[i].id + "' class='task-check'><i class='ph-check'></i></div><div data-target='" + taskslist[i].id + "' class='task-to-today selected-icon'><i class='ph-folder-simple-plus'></i></div><div data-target='" + taskslist[i].id + "' class='task-delete'><i class='ph-trash'></i></div>");
        }else{
            $taskactionsicons = $("<div data-target='" + taskslist[i].id + "' class='task-check'><i class='ph-check'></i></div><div data-target='" + taskslist[i].id + "' class='task-to-today'><i class='ph-folder-simple-plus'></i></div><div data-target='" + taskslist[i].id + "' class='task-delete'><i class='ph-trash'></i></div>");
        }

        $taskdetails.append($taskcategory);
        $taskactions.append($taskactionsicons);
        $taskcontainer.append($taskdetails);
        $taskcontainer.append($taskactions);
        specificCategoryTasks.append($taskcontainer);
    }
}

function DeleteThisTask(taskid){
    let task = User.GetSpecificTask(taskid);
    User.DeleteTask(taskid);

    let specific_cat = User.GetSpecificCategory(task.category_id);

    BuildTodayTasks();
    BuildTasks(specific_cat);

}

function GetTodayDate(){
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    let dayName = days[d.getDay()];
    let output = dayName + ' ' + month  + '\n'+ day  + ', ' + year;

    return output;
}

export function CheckTextHealth(x) {

    var reg = /<(.|\n)*?>/g;

    if (reg.test(x) == true) {
        return false;

    }else{
        return true;
    }
}

function CheckTime(){
    console.log("checked time");
    let date = new Date();
    let hours = date.getHours();
    
    let today = GetTodayDate();

    console.log(hours);

    if(hours >= 0 && hours < 12){
        console.log("inside morning");
        $(".user-launch-greeting-text-time").text("morning");
        $(".user-launch-greeting-date").text("🌤 " + today);
    }else if(hours >= 12 && hours < 19){
        console.log("inside afternoon");
        $(".user-launch-greeting-text-time").text("afternoon");
        $(".user-launch-greeting-date").text("☀️ " + today);
    }else if(hours >= 19){
        console.log("inside evening");
        $(".user-launch-greeting-text-time").text("evening");
        $(".user-launch-greeting-date").text("🌙 " + today);
    }
}



    // $(".user-wallet-icon").text(User.user.wallet_icon);

    // Category
    // $(".button-add-category").click(function(){
    //     AddNewCategory();
    // });

    // $(".category-list").on("click", ".category", function(){
    //     OpenCategory($(this).attr("id"));
    // });

    // $(".specific-category-delete").click(function(){
    //     let cat_id = $(".specific-category").attr("id");
    //     User.DeleteCategory(cat_id);
    //     GenerateCategories();
    //     $(".specific-category").addClass("display-none");
    //     $(".category-container").removeClass("display-none");
    // });


    // On Enter Commands
    // $("#InputCategory").keyup(function(event) {
    //     if (event.keyCode === 13) {
    //         $(".button-add-category").click();
    //     }
    // });

    // $("#InputTask").keyup(function(event) {
    //     if (event.keyCode === 13) {
    //         $(".button-add-task").click();
    //     }
    // });


    // Tasks
    // $(".go-back-from-task").click(function(){
    //     $(".specific-category").addClass("display-none");
    //     $(".category-container").removeClass("display-none");
    // });

    // $(".button-add-task").click(function(){
    //     AddNewTask();
    // });

    // Task List Commands
    // $(".task-list").on("click", ".task-delete", function(){
    //     Delete($(this));
    // });


    // $(".task-list").on("click", ".task-check", function(){
    //     Delete($(this));
    //     User.AddtoWallet(1);
    //     $(".user-wallet-amount").text(User.GetWallet());
    // });







// Category
// function AddNewCategory(){
//     let input = $("#InputCategory").val().trim();

//     if(input != ""){
//         let new_cat = C.CreateCategory(input);
//         let clone = {...new_cat};
//         User.AddCategory(clone);
//         GenerateCategories();
//     }

//     $("#InputCategory").val("");

// }

// function GenerateCategories(){
//     $(".category-list").empty();
//     let list = User.GetCategories();
//     for(let i = 0 ; i < list.length; i++){
//         let $divcategory = $("<div id='" + list[i].id  + "' class='category'><span class='category-title'>" + list[i].title + "</span></div>");
//         $(".category-list").append($divcategory);
//     }
// }

// function OpenCategory(id){
//     $(".category-container").addClass("display-none");
//     let $thiscategory = User.GetSpecificCategory(id);
//     $(".specific-category").removeClass("display-none");

//         $(".specific-category h2").text($thiscategory.title);
//         $(".specific-category").attr("id",$thiscategory.id);
//         GenerateTasks($thiscategory.id);

// }




// Task
// function GenerateTasks(cat_id){
//     $(".task-list").empty();

//     let user_tasks = User.GetTasks();

//     let $emptytasks = $("<div class='empty-task-container'>No tasks yet!</div>")

//     if(user_tasks.length != 0){

//         var task_list = user_tasks.filter(x => {
//             return x.category_id == cat_id;
//         });

//         if(task_list.length != 0){
//             for(let i = 0 ; i < task_list.length; i++){
//                 BuildTask(task_list[i]);
//             }
//         }else{
//             $(".task-list").append($emptytasks);
//         }


//     }else{

//         $(".task-list").append($emptytasks);
//     }

    
// }

// function AddNewTask(){
//     let input = $("#InputTask").val().trim();

//     if(input != ""){
//         let specificCategoryID = $(".specific-category").attr("id");
//         let task = T.CreateTask(specificCategoryID, input);
    
    
//         let clone = {...task};
//         User.AddTask(clone);
//         GenerateTasks(specificCategoryID);
//     }

//     $("#InputTask").val("");
// }

// function BuildTask(t){
//     let $taskcontainer = $("<div id='" + t.id + "' class='task-container'></div>");
//     let $taskcheck = $("<div data-target='" + t.id + "' class='task-check'><i class='ph-check-circle'></i></div>");
//     let $tasktitle = $("<div class='task-title'>" + t.title + "</div>");
//     let $taskdetails = $("<div class='task-details'></div>");
//     let $taskdelete = $("<div data-target='" + t.id + "' class='task-delete'><i class='ph-trash'></i></div>");
    
//     $taskdetails.append($taskdelete);

//     $taskcontainer.append($taskcheck);
//     $taskcontainer.append($tasktitle);
//     $taskcontainer.append($taskdetails);

//     $(".task-list").append($taskcontainer);
// }


// function Delete($this){
//     let thisdatatarget = $this.attr("data-target");
//     $("#"+thisdatatarget).addClass("display-none");
//     User.DeleteTask(thisdatatarget);
//     let cat_id = $(".specific-category").attr("id");
//     GenerateTasks(cat_id);
// }