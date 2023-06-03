import { firebaseConfig } from "./env.js";
// Initialize Firebase


firebase.initializeApp(firebaseConfig);


var nameV,emailV,passWV,genV;
var files = [];
var yourPosts = [];
var imageVs = [];
var imgName, imgUrl;
var reader;
var loggedIN = false;
var allPosts = [];
var totalPosts = [];
var postNames = [];
var postsonpostpage = [];
var currentref = "";
var postName = "";
var likes = 0;
var postType = "";
var allComments = [];


document.getElementById("enterBtn").onclick = function () {
    nameV = document.getElementById("namebox").value;
    emailV = document.getElementById("emailbox").value;
    passWV = document.getElementById("passbox").value;

    if (!(nameV == "") && !(emailV == "") && !(passWV == "")) {

            firebase.database().ref("Users/" + nameV).on('value', function (snapshot) {
                if (!loggedIN) {
                    if (snapshot.exists()) {
                        var passpass;
                        firebase.database().ref("Users/" + nameV + "/Password").on('value', function (snapshot) {
                            passpass = snapshot.val();
                        });

                        if (passWV === passpass) {
                            firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                                emailV = snapshot.val();
                                loggedIN = true;
                                firebase.database().ref('Users').once('value', function (allRecords) {
                                    allRecords.forEach(
                                        function (CurrentRecord) {
                                            var name = CurrentRecord.val().Name;
                                            names.push(name);
                                        }
                                    )
                                });
                            });

                            document.getElementById("signinScreen").hidden = true;
                            document.getElementById("app").hidden = false;
                            hideMainDivs();
                            document.getElementById("homePage").hidden = true;
                        } else {
                            alert("incorrect")
                        }
                    } else {
                        alert("We can't seem to find your account, would you like to sign up?")
                    }
                }
            });

    } else {
        alert("Your password, email, or name field is empty");
    }
}

document.getElementById("signup").onclick = function() {
    document.getElementById("signinScreen").hidden = true;
    document.getElementById("signupScreen").hidden = false;
}

document.getElementById("signupBack").onclick = function() {
    document.getElementById("signinScreen").hidden = false;
    document.getElementById("signupScreen").hidden = true;
}

document.getElementById("signupenterBtn").onclick = function() {
    nameV = document.getElementById("signUpNamebox").value;
    emailV = document.getElementById("signUpEmailbox").value;
    passWV = document.getElementById("signUpPassbox").value;

    if (!(nameV == "") && !(emailV == "") && !(passWV == "")) {
        var alreadyExists = false;
        firebase.database().ref("Users").once('value', function (users) {
            if (users.exists()) {
                users.forEach(function (user) {
                    if (user.val().Name === nameV) {
                        if (user.val().Email === emailV && user.val().Password === passWV) {
                            alert("You already have an account, welcome back");
                            alreadyExists = true;

                            firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                                emailV = snapshot.val();
                                loggedIN = true;
                                firebase.database().ref('Users').once('value', function (allRecords) {
                                    allRecords.forEach(
                                        function (CurrentRecord) {
                                            var name = CurrentRecord.val().Name;
                                            names.push(name);
                                        }
                                    )
                                });
                            });

                            loggedIN = true;
                            document.getElementById("signupScreen").hidden = true;
                            document.getElementById("app").hidden = false;
                            hideMainDivs();
                            document.getElementById("homePage").hidden = true;
                        } else {
                            alert("Username already taken, please try again")
                            alreadyExists = true;
                        }
                    }
                });
            }
            if (!alreadyExists) {
                firebase.database().ref("Users/" + nameV).set({
                    Name: nameV,
                    Email: emailV,
                    Password: passWV,
                    Followers: 0,

                });
                loggedIN == true;

                firebase.database().ref("Users/" + nameV + "/Email").on('value', function (snapshot) {
                    emailV = snapshot.val();
                    loggedIN = true;
                    firebase.database().ref('Users').once('value', function (allRecords) {
                        allRecords.forEach(
                            function (CurrentRecord) {
                                var name = CurrentRecord.val().Name;
                                names.push(name);
                            }
                        )
                    });
                });

                alert("Welcome aboard")
                document.getElementById("signupScreen").hidden = true;
                document.getElementById("app").hidden = false;
                hideMainDivs();
                document.getElementById("homePage").hidden = true;
            }
        });

    }
}


document.getElementById("homeBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("homePage").hidden = false;
}
let names = [];

document.getElementById("searchBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("searchbar").value = ""
    document.getElementById("searchPage").hidden = false;
    for (let i = 0; i < totalPosts.length; i++) {
        document.getElementById('searchPage').removeChild(totalPosts[i])
    }
    totalPosts = [];
    allPosts = [];
    postNames = [];
    for (let i = 0; i < names.length; i++) {
        if (names[i] === nameV) {

        }
        else {
            firebase.database().ref('Users/' + names[i] + "/Posts").once('value', function (allRecords) {
                allRecords.forEach(
                    function (CurrentRecord) {
                        var link = CurrentRecord.val().Link;
                        var img = document.createElement('img');
                        postName = link.substring(link.indexOf("%2F")+3, link.indexOf(".png"))
                        postName = postName.replaceAll("%20"," ")
                        postName = postName.toLowerCase();
                        postNames.push(postName)
                        img.src = link
                        img.onclick = function () {
                            link = img.src;
                            postName = link.substring(link.indexOf("%2F")+3, link.indexOf(".png"))
                            postName = postName.replaceAll("%20"," ")
                            postName = postName.toLowerCase();
                            hideMainDivs();
                            document.getElementById("postpage").hidden = false;
                            for (let i = 0; i < postsonpostpage.length; i++) {
                                document.getElementById('postonpostpage').removeChild(postsonpostpage[i])
                            }
                            postsonpostpage = [];
                            var img2 = document.createElement('img');
                            img2.src = img.src
                            img2.className = "postimageonpostpage"

                            document.getElementById('postonpostpage').appendChild(img2);
                            postsonpostpage.push(img2);
                            for (let j = 0; j < names.length; j++) {
                                firebase.database().ref('Users/' + names[j] + "/Posts").once('value', function (allRecords2) {
                                    allRecords2.forEach(
                                        function (CurrentRecord2) {
                                            if (CurrentRecord2.val().Link == img.src){
                                                currentref = 'Users/' + names[j] + "/Posts/" + postName;
                                                viewPostPage(currentref, postName, names[j]);
                                                firebase.database().ref("Users/"+ nameV + "/Activity/"+postName).once('value', function (snapshot) {
                                                    if (snapshot.val().Reaction === "Liked"){
                                                        document.getElementById("heart").checked = true;
                                                    }
                                                    else{
                                                        document.getElementById("heart").checked = false;

                                                    }
                                                });
                                                firebase.database().ref(currentref).once('value', function (snapshot) {
                                                    likes = snapshot.val().Likes
                                                    if (likes===1){
                                                        document.getElementById("likescounter").innerText = likes + " Like"
                                                    }
                                                    else{
                                                        document.getElementById("likescounter").innerText = likes + " Likes"
                                                    }

                                                });
                                            }
                                        }
                                    )})
                            }





                        }

                        document.getElementById('searchPage').appendChild(img);
                        totalPosts.push(img);
                        var type = CurrentRecord.val().Type;
                        var arrayA = [link, type, names[i]];
                        allPosts.push(arrayA);
                    }
                )
            })
        }
    }
}
function updateSearch(){
    for (let i = 0; i < totalPosts.length; i++) {
        document.getElementById('searchPage').removeChild(totalPosts[i])
    }
    totalPosts = [];
    var searchText = document.getElementById("searchbar").value;
    for (let i = 0; i < postNames.length; i++) {
        if (postNames[i].includes(searchText.toLowerCase())) {
            var img = document.createElement('img');
            img.src = allPosts[i][0]
            img.onclick = function () {
                console.log("blaghsghaghs " + img.src)
                hideMainDivs();
                document.getElementById("postpage").hidden = false;
                for (let j = 0; j < postsonpostpage.length; j++) {
                    document.getElementById('postonpostpage').removeChild(postsonpostpage[j])
                }

                postsonpostpage = [];
                var img2 = document.createElement('img');

                img2.src = allPosts[i][0];
                img2.className = "postimageonpostpage"

                for (let j = 0; j < names.length; j++) {
                    firebase.database().ref('Users/' + names[j] + "/Posts").once('value', function (allRecords2) {
                        allRecords2.forEach(
                            function (CurrentRecord2) {
                                if (CurrentRecord2.val().Link == img2.src) {
                                    postName = img2.src.substring(img2.src.indexOf("%2F") + 3, img2.src.indexOf(".png"))
                                    postName = postName.replaceAll("%20", " ")
                                    postName = postName.toLowerCase();
                                    currentref = 'Users/' + names[j] + "/Posts/" + postName;
                                    viewPostPage(currentref, postName, names[j]);
                                    firebase.database().ref("Users/" + nameV + "/Activity/" + postName).once('value', function (snapshot) {
                                        if (snapshot.val().Reaction === "Liked") {
                                            document.getElementById("heart").checked = true;
                                        } else {
                                            document.getElementById("heart").checked = false;

                                        }
                                    });
                                    firebase.database().ref(currentref).once('value', function (snapshot) {
                                        likes = snapshot.val().Likes
                                        if (likes === 1){
                                            document.getElementById("likescounter").innerText = likes + " Like"

                                        }
                                        else{
                                            document.getElementById("likescounter").innerText = likes + " Likes"

                                        }
                                    });
                                }
                            }
                        )
                    })
                }
                document.getElementById('postonpostpage').appendChild(img2);
                postsonpostpage.push(img2);


            }
            document.getElementById('searchPage').appendChild(img);
            totalPosts.push(img);
        }
    }
}

function commentButton(){
    let d = new Date();
    firebase.database().ref(currentref + "/Comments/" + d).set({
        postdate: "" + d,
        poster: nameV,
        comment: document.getElementById("commentbox").innerHTML,

    });
    document.getElementById("commentbox").innerHTML = ""
    firebase.database().ref(currentref + "/Comments").once('value', function (allRecords) {
        for (let i = 0; i < allComments.length; i++) {
            document.getElementById('postpage').removeChild(allComments[i])

        }
        allComments = [];
        allRecords.forEach(
            function (CurrentRecord) {
                var comment = CurrentRecord.val().poster + ": " + CurrentRecord.val().comment;

                var hr1 = document.createElement('hr')

                var img1 = document.createElement('img')
                img1.className = "pfpcomment";

                var comment2 = document.createElement('p')

                var hr2 = document.createElement('hr')

                comment2.innerHTML = comment;
                comment2.className = "commentthing"

                var pfpsrc;
                firebase.database().ref("Users/" + CurrentRecord.val().poster + "/PFP/" + "Link").on('value', function (snapshot) {
                    pfpsrc = snapshot.val();
                    if (pfpsrc != null) {
                        img1.src = pfpsrc;
                    }
                    else{
                        img1.src = "resources/select image picture.PNG";
                    }
                });
                document.getElementById('postpage').append(hr1, img1, comment2, hr2)
                allComments.push(hr1, img1, comment2, hr2)
            }
        )
    });
}
document.getElementById("myprofileBtn").onclick = function () {
    hideMainDivs();
    document.getElementById("myprofilePage").hidden = false;
    document.getElementById("myprofile").hidden = false;
    document.getElementById("postingPage").hidden = true;
    var pfpsrc;
    firebase.database().ref("Users/" + nameV + "/PFP/" + "Link").once('value', function (snapshot) {
        pfpsrc = snapshot.val();
        if (pfpsrc != null) {
            document.getElementById("pfp").src = pfpsrc;
        }
    });


    for (let i = 0; i < yourPosts.length; i++) {
        document.getElementById('myprofile').removeChild(yourPosts[i])
    }
    yourPosts = [];
    firebase.database().ref("Users/"+nameV+"/Posts").once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            var str = "Users/"+nameV+"/Posts/"+child.key;

            firebase.database().ref("Users/"+nameV+"/Posts/"+child.key + "/Link").on('value', function (snapshot) {
                var img = document.createElement('img');

                img.src = snapshot.val();
                img.onclick = function () {
                    postName = img.src.substring(img.src.indexOf("%2F")+3, img.src.indexOf(".png"))
                    postName = postName.replaceAll("%20"," ")
                    postName = postName.toUpperCase();
                    viewPostPage(str, postName, nameV)
                    hideMainDivs();
                    document.getElementById("postpage").hidden = false;
                    document.getElementById("heart2").hidden = true;
                    for (let i = 0; i < postsonpostpage.length; i++) {
                        document.getElementById('postonpostpage').removeChild(postsonpostpage[i])
                    }
                    postsonpostpage = [];
                    var img2 = document.createElement('img');
                    img2.src = img.src
                    img2.className = "postimageonpostpage"

                    document.getElementById('postonpostpage').appendChild(img2);
                    postsonpostpage.push(img2);



                }
                document.getElementById('myprofile').appendChild(img);
                yourPosts.push(img);
            })
        });
    });


}
function heartchecked() {
    var checkBox = document.getElementById("heart");
    firebase.database().ref(currentref).once('value', function (snapshot) {
        likes = snapshot.val().Likes
        if (checkBox.checked === true){
            firebase.database().ref("Users/"+nameV+"/Activity/" + postName).update({
                Reaction: "Liked",
                Name: postName

            });
            likes++;
            firebase.database().ref(currentref).update({
                Likes: likes

            });
        } else {
            firebase.database().ref("Users/"+nameV+"/Activity/" + postName).update({
                Reaction: "Unliked",
                Name: postName

            });
            likes--;
            firebase.database().ref(currentref).update({
                Likes: likes

            });
        }
        if (likes === 1){
            document.getElementById("likescounter").innerText = likes + " Like"
        }
        else{
            document.getElementById("likescounter").innerText = likes + " Likes"

        }

    });

}
document.getElementById("pfp").onclick = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function(){
            document.getElementById("pfp").src = reader.result;
            imgName = nameV;
            var uploadTask = firebase.storage().ref('Image/'+imgName+".png").put(files[0]);

            uploadTask.on('state_changed', function (snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById('upProgress').innerHTML = 'Upload' + progress+'%';
                },
                function(error){
                    alert('error')
                },
                function(){
                    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                            imgUrl = url;

                            firebase.database().ref('Users/'+nameV+"/PFP").set({
                                Link: imgUrl,
                            });
                        }
                    );
                });
        }
        reader.readAsDataURL(files[0]);
    }
    input.click();




}

document.getElementById("postBtn").onclick = function () {
    document.getElementById("myprofile").hidden = true;
    document.getElementById("postingPage").hidden = false;
}



function hidePostOps() {
    document.getElementById("quote").hidden = true;
    document.getElementById("recipe").hidden = true;
    document.getElementById("workout").hidden = true;
}


function hideMainDivs() {
    document.getElementById("searchPage").hidden = true;
    document.getElementById("homePage").hidden = true;
    document.getElementById("myprofilePage").hidden = true;
    document.getElementById("postpage").hidden = true;

}


document.getElementById("simage").onclick = function(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.onload = function(){
            document.getElementById("myimg").src = reader.result;
        }
        reader.readAsDataURL(files[0]);
    }
    input.click();

}
document.getElementById("upload").onclick = function(){
    // alert(files[0]);
    var passesTest = true;
    var alertVar = "";

    if (files[0]==null) {
        passesTest = false;
        alertVar = alertVar+"; You don't have an image selected";
    }
    if (document.getElementById("namebox1").value === "") {
        passesTest = false;
        alertVar = alertVar+"; Please put a permissible title";
    }

    switch (postType) {
        case "":
            passesTest = false;
            alertVar = alertVar+"; Please select a valid post type";
            break;
        case "recipe":
            if (document.getElementById("prepTimetext").value==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the meal prep time";
            }
            if (document.getElementById("cooktimeText").value==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the cooking time required";
            }
            if (document.getElementById("servingSize").value==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the serving size";
            }
            if (document.getElementById("ingredientBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please specify the ingredients";
            }
            if (document.getElementById("methodBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please type the method of the recipe";
            }
            break;
        case "workout":
            if (document.getElementById("workoutDescBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please write a workout description";
            }
            if (document.getElementById("workoutBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please write the workout walkthrough";
            }
            break;
        case "quote":
            if (document.getElementById("quoteBox").innerHTML==="") {
                passesTest = false;
                alertVar = alertVar+"; Please put a quote in the field required";
            }
            break;
    }

    if (passesTest) {
        imgName = document.getElementById("namebox1").value;
        imgName = imgName.toLowerCase();
        var uploadTask = firebase.storage().ref('Image/' + imgName + ".png").put(files[0]);
        uploadTask.on('state_changed', function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById('upProgress').innerHTML = 'Upload' + progress + '%';
            },
            function (error) {
                alert(error)
                alert('error')
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                        imgUrl = url;
                        switch (postType) {
                            case "recipe":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    Likes: 0,
                                    PrepTime: document.getElementById("prepTimetext").value,
                                    CookTime: document.getElementById("cooktimeText").value,
                                    ServingSize: document.getElementById("servingSize").value,
                                    Ingredients: document.getElementById("ingredientBox").innerHTML,
                                    Method: document.getElementById("methodBox").innerHTML
                                });
                                break;
                            case "workout":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    Likes: 0,
                                    Description: document.getElementById("workoutDescBox").innerHTML,
                                    Workout: document.getElementById("workoutBox").innerHTML,
                                });
                                break;
                            case "quote":
                                firebase.database().ref('Users/' + nameV + "/Posts/" + imgName).set({
                                    Link: imgUrl,
                                    Type: postType,
                                    Likes: 0,
                                    Quote: document.getElementById("quoteBox").innerHTML,
                                });
                                break;
                        }
                        alert('image added successfully');
                    }
                );
            });

    } else {
        alert(alertVar);
    }

}
for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
    dropdown.addEventListener('click', function () {
        this.querySelector('.custom-select').classList.toggle('open');
    })
}

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            try {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            }catch (e) {

            }
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

            switch (this.innerHTML) {
                case "Recipe":
                    hidePostOps()
                    document.getElementById("recipe").hidden = false;
                    postType = "recipe";
                    break;
                case "Workout":
                    hidePostOps()
                    document.getElementById("workout").hidden = false;


                    postType = "workout";
                    break;
                case "Quote":
                    hidePostOps()
                    document.getElementById("quote").hidden = false;

                    postType = "quote";
                    break;
            }
        }
    })
}


window.addEventListener('click', function (e) {
    for (const select of document.querySelectorAll('.custom-select')) {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    }
});


function hideViewOps() {
    document.getElementById("viewQuoteDiv").hidden = true;
    document.getElementById("viewRecipe").hidden = true;
    document.getElementById("viewWorkoutDiv").hidden = true;
}

function viewPostPage(postPath, titleName, username) {
    document.getElementById("viewTitle").innerHTML = titleName.toUpperCase();
    document.getElementById("heart2").hidden = false;
    document.getElementById("username").innerText = username;
    firebase.database().ref(postPath).on('value', function (snapshot) {
        hideViewOps()
        switch (snapshot.val().Type.toString()) {
            case "recipe":
                document.getElementById("postType").innerHTML = "Recipe";
                document.getElementById("viewRecipe").hidden = false;
                document.getElementById("viewPrep").innerHTML = "Prep Time: " + snapshot.val().PrepTime + "mins";
                document.getElementById("viewCook").innerHTML = "Cook Time: " + snapshot.val().CookTime + "mins";
                document.getElementById("viewServingSize").innerHTML = "Serves: " + snapshot.val().ServingSize + " people";
                document.getElementById("viewIngredients").innerHTML = "Ingredients: " + snapshot.val().Ingredients;
                document.getElementById("viewMethod").innerHTML = "Method: " + snapshot.val().Method;
                break;
            case "workout":
                document.getElementById("postType").innerHTML = "Workout";

                document.getElementById("viewWorkoutDiv").hidden = false;

                document.getElementById("viewWorkoutDesc").innerHTML = "Description: " + snapshot.val().Description;
                document.getElementById("viewWorkout").innerHTML = "Workout: " + snapshot.val().Workout;
                break;
            case "quote":
                document.getElementById("postType").innerHTML = "Quote";

                document.getElementById("viewQuoteDiv").hidden = false;

                document.getElementById("viewQuote").innerHTML = "Quote: " + snapshot.val().Quote;
                break;
        }
    });
    firebase.database().ref(postPath + "/Comments").once('value', function (allRecords) {
        for (let i = 0; i < allComments.length; i++) {
            document.getElementById('postpage').removeChild(allComments[i])

        }
        allComments = [];
        allRecords.forEach(
            function (CurrentRecord) {
                var comment = CurrentRecord.val().poster + ": " + CurrentRecord.val().comment;

                var hr1 = document.createElement('hr')

                var img1 = document.createElement('img')
                img1.className = "pfpcomment";

                var comment2 = document.createElement('p')

                var hr2 = document.createElement('hr')

                comment2.innerHTML = comment;
                comment2.className = "commentthing"

                var pfpsrc;
                firebase.database().ref("Users/" + CurrentRecord.val().poster + "/PFP/" + "Link").on('value', function (snapshot) {
                    pfpsrc = snapshot.val();
                    if (pfpsrc != null) {
                        img1.src = pfpsrc;
                    }
                    else{
                        img1.src = "resources/select image picture.PNG";
                    }
                });
                document.getElementById('postpage').append(hr1, img1, comment2, hr2)
                allComments.push(hr1, img1, comment2, hr2)
            }
        )
    });
}

