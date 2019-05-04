var usersArray = {
    'a':
        {
        'password': 'a',
            'firstName': 'test',
            'lastName': 'user',
            'email': 'a@test.com'
        },
};
var isLoggedIn = false;
var availableColor = ['red', 'green', 'yellow', 'magenta', 'white'];
var gameSettings = {
    'controls': {
        'upInput': 38,
        'rightInput': 39,
        'downInput': 40,
        'leftInput': 37
    },
    'numberOfBalls': 50,
    'ball1_color': 'white',
    'ball2_color': 'red',
    'ball3_color': 'green',
    'gameTime': 60,
    'monstersNumber': 1,
};

// MODAL FUNCTIONS
var modal = document.getElementById('aboutModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function ModalShow(element){
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
//catching the esc key clicked
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        modal.style.display = "none";
    }
};

function LoginFormSubmit(){
    var loginUserName = $('#usernameInputField').val();
    var loginUserPassword = $('#userPasswordInputField').val();
    let isValid = ValidateLoginData(loginUserName, loginUserPassword);
    if(isValid){
        isLoggedIn = true;
        document.getElementById("loginButton").innerText = "Logout";
        document.getElementById("userFirstLastName").innerText = usersArray[loginUserName]['firstName']+' '+usersArray[loginUserName]['lastName'];
        SwipeDivs('game_div');
    }
    else{
        alert('wrong username or password');
    }
}
function RegisterFormSubmit(){
    $.validator.addMethod("atLeastOneLowercaseLetter", function (value, element) {
    return this.optional(element) || /[a-z]+/.test(value);
    },"Must have at least one lowercase letter");
    $.validator.addMethod("atLeastOneNumber", function (value, element) {
        return this.optional(element) || /[0-9]+/.test(value);
    },"Must have at least one letter");
    $.validator.addMethod("noNumbers", function (value, element) {
        return this.optional(element) ||/^([^0-9]*)$/.test(value);
    },"No numbers allowed");
    $("#registerForm").validate({
        rules :{
            registerUsernameInputField : {
                required : true
            },
            registerUserPasswordInputField : {
                required : true,
                minlength : 8,
                atLeastOneLowercaseLetter: true,
                atLeastOneNumber: true,
            },
            registerUserFNInputField : {
                required : true,
                noNumbers : true
            },
            registerUserLNInputField : {
                required : true,
                noNumbers : true
            },
            registerUserEmailInputField : {
                required : true,
                email : true
            },
            registerUserDBirthInputField : {
                required : true
            }
        },
        messages :{
            registerUsernameInputField : {
                required : 'this field is required'
            },
            registerUserPasswordInputField : {
                required : 'this field is required',
                minlength : 'password must be 8 characters at least',
                atLeastOneLowercaseLetter: 'must contain a letter',
                atLeastOneNumber: 'must contain a number'
            },
            registerUserFNInputField : {
                required : 'this field is required',
                noNumbers : 'please no digits'
            },
            registerUserLNInputField : {
                required : 'this field is required',
                noNumbers : 'please no digits'
            },
            registerUserEmailInputField : {
                required : 'this field is required',
                email : 'not a valid email'
            },
            registerUserDBirthInputField : {
                required : 'this field is required'
            }
        }
    });
    var username = $('#registerUsernameInputField').val();
    var password = $('#registerUserPasswordInputField').val();
    var firstName = $('#registerUserFNInputField').val();
    var lastName = $('#registerUserLNInputField').val();
    var email = $('#registerUserEmailInputField').val();
    if($("#registerForm").valid()){
        usersArray[username] = {
            'password': password,
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
        };
        alert('registration successful');
        SwipeDivs('welcome_div');
    }
}


/**
 * @return {boolean}
 */
function ValidateLoginData(username, password){
    return usersArray[username]['password'] === password;
}
function betweenNums(x, max, min, includes){
    if (x === ""){
        return false;
    }
    if(max === "inf"){
        return x >= min;
    }
    if(min === "m_inf"){
        return x<=max;
    }
    if(includes){
        return x <= max && x >= min;
    }
    return x < max && x > min;
}
function showWrongField(fieldName){
    document.getElementById(fieldName).style.backgroundColor = 'red';
    document.getElementById(fieldName).value = '';
}
function settingsFormSubmit(){
    let ballsNumber = document.getElementById("ballsNumber").value;
    let ballsNumberValid = betweenNums(ballsNumber, 90, 50, true);
    if (!ballsNumberValid){
        showWrongField("ballsNumber");
        return;
    }
    let ball1Color = document.getElementById("ball1Color").value;
    let ball1ColorValid = availableColor.includes(ball1Color);
    if (!ball1ColorValid){
        showWrongField("ball1Color");
        return;
    }
    let ball2Color = document.getElementById("ball2Color").value;
    let ball2ColorValid = availableColor.includes(ball2Color);
    if (!ball2ColorValid){
        showWrongField("ball2Color");
        return;
    }
    let ball3Color = document.getElementById("ball3Color").value;
    let ball3ColorValid = availableColor.includes(ball3Color);
    if (!ball3ColorValid){
        showWrongField("ball3Color");
        return;
    }
    let gameLength = document.getElementById("gameLength").value;
    if (!betweenNums(gameLength, "inf", 60, true)){
        showWrongField("gameLength");
        return;
    }
    let monstersNumbers = document.getElementById("monstersNumbers").value;
    if (!betweenNums(monstersNumbers, 3, 1, true)){
        showWrongField("monstersNumbers");
        return;
    }

    gameSettings['controls']['upInput'] = document.getElementById("upInput").value;
    gameSettings['controls']['rightInput'] = document.getElementById("rightInput").value;
    gameSettings['controls']['downInput'] = document.getElementById("downInput").value;
    gameSettings['controls']['leftInput'] = document.getElementById("leftInput").value;
    gameSettings['numberOfBalls'] = ballsNumber;
    gameSettings['ball1_color'] = ball1Color;
    gameSettings['ball2_color'] = ball2Color;
    gameSettings['ball3_color'] = ball3Color;
    gameSettings['gameTime'] = gameLength;
    gameSettings['monstersNumber'] = monstersNumbers;
    alert("New Settings Saved!");
    SwipeDivs('welcome_div');
}

function PopulateRandomSettings(){
    document.getElementById("upInput").value = 38;
    document.getElementById("rightInput").value = 39;
    document.getElementById("downInput").value = 40;
    document.getElementById("leftInput").value = 37;
    document.getElementById("ballsNumber").value = Math.max(50, parseInt(Math.random()*90));
    document.getElementById("ball1Color").value = availableColor[parseInt(Math.random()*5)];
    document.getElementById("ball2Color").value = availableColor[parseInt(Math.random()*5)];
    document.getElementById("ball3Color").value = availableColor[parseInt(Math.random()*5)];
    document.getElementById("gameLength").value =Math.max( 60, parseInt(Math.random()*1000));
    document.getElementById("monstersNumbers").value = parseInt(Math.random()*3) + 1 ;
}


function SwipeDivs(divId){
    if(divId === "login_div" && isLoggedIn){
        document.getElementById("userFirstLastName").innerText = 'User';
        document.getElementById("loginButton").innerText = "Login";
        isLoggedIn = false;
    }
    if(divId === "game_div" && !isLoggedIn){
        alert("you must be connected to start a game!!");
        return;
    }
    if(divId === "game_div"){
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        var controldDict = {
            'up': gameSettings['controls']['upInput'],
            'right': gameSettings['controls']['rightInput'],
            'down': gameSettings['controls']['downInput'],
            'left': gameSettings['controls']['leftInput'],
        };
        startNewGame(controldDict , gameSettings['numberOfBalls'], gameSettings['ball1_color'], gameSettings['ball2_color'], gameSettings['ball3_color'], gameSettings['gameTime'], gameSettings['monstersNumber'], );
    }
    if(isLoggedIn){
        document.getElementById("loginButton").innerText = "Logout";
    }
    var allDivs = document.getElementsByClassName("contentDiv");
    for (var i = 0; i < allDivs.length; i++) {
        if( allDivs[i].id === divId){
            allDivs[i].style.display = "block";
        }
        else{
            allDivs[i].style.display = "none";
        }
    }
}

document.querySelector('#upInput').addEventListener('keyup', function (e) {
    if(e.keyCode == 9){
        return;
    }
    gameSettings['controls']['upInput'] = e.keyCode;
    document.getElementById("upInput").value = e.keyCode;
});
document.querySelector('#rightInput').addEventListener('keyup', function (e) {
    if(e.keyCode == 9){
        return;
    }
    gameSettings['controls']['rightInput'] = e.keyCode;
    document.getElementById("rightInput").value = e.keyCode;
});
document.querySelector('#downInput').addEventListener('keyup', function (e) {
    if(e.keyCode == 9){
        return;
    }
    gameSettings['controls']['downInput'] = e.keyCode;
    document.getElementById("downInput").value = e.keyCode;
});
document.querySelector('#leftInput').addEventListener('keyup', function (e) {
    if(e.keyCode == 9){
        return;
    }
    gameSettings['controls']['leftInput'] = e.keyCode;
    document.getElementById("leftInput").value = e.keyCode;
});