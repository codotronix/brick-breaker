$(document).ready(function () {
    //alert("I'm on...");

    //all the things of arena
    var arena = {};
    arena.width = parseInt($("#arena").css("width"));
    arena.height = parseInt($("#arena").css("height"));
    //alert("arena height = " + arena.height + " and arena width = " + arena.width);


    //all the things related to player
    var player = {};
    player.width = parseInt($("#player").css("width"));
    player.height = parseInt($("#player").css("height"));
    //alert("player width = " + player.width + " and player height = " + player.height);
    player.top = arena.height - player.height;
    player.left = arena.width / 2 + 30;
    player.shift = 5;
    player.score = 0;
    //alert("player top = " + player.top + " and player left = " + player.left);

    //all the things related to bullet
    var bullet = {};
    bullet.width = parseInt($("#bullet").css("width"));
    bullet.height = parseInt($("#bullet").css("height"));
    bullet.left = player.left + player.width/2 - bullet.width / 2;
    bullet.top = player.top - bullet.height;
    bullet.status = "sleeping";

    //all the things related to bricks
    var bricks = {};
    bricks.width = parseInt($(".brickSize").css("width"));
    bricks.height = parseInt($(".brickSize").css("height"));
    //alert("Brick width = " + bricks.width + " and Bricks height = " + bricks.height);
    bricks.array = new Array();
    bricks.shift = 40;
    bricks.turn = 1;    // 1=left, 2=right, 3=right, 4=left 5=down

    //lets initiate all array places with "y"... signifying that Bricks are alive...
    for (var i = 1; i <= 20; i++)
    {
        bricks.array[i] = "y";
    }

    //detect key press
    $(document).keydown(function (e) {
        //alert(e.keyCode);

        switch (e.keyCode)
        {
            case 37:        //Left Arrow Pressed
                //alert("Left arrow pressed");
                player.left = player.left - player.shift;
                if (player.left < 0) { player.left = 0;}
                break;
            case 39:        //Right Arrow Pressed
                //alert("Right arrow pressed");
                player.left = player.left + player.shift;
                if (player.left > (arena.width - player.width)) { player.left = arena.width - player.width; }
                break;
            case 32:        // space to fire
                if (bullet.status === "sleeping")
                {                    
                    bullet.left = player.left + player.width / 2 - bullet.width / 2;
                    bullet.top = player.top - bullet.height;
                    bullet.status = "running";
                }
        }

    });


    //call init
    init();
    
    function init()
    {
        //initialize player position
        $("#player").css({
            top: player.top + "px",
            left:player.left + "px"
        });

        //initialize bullet position
        $("#bullet").css({
            top: bullet.top + "px",
            left: bullet.left + "px"
        });
    }

    
    function render()
    {
        drawPlayer();
        drawBullet();
        detectCollission();
    }

    function detectCollission()
    {
        var top;
        var left;
        var BrickID;

        for (var i = 1; i <= 20; i++)
        {
            if (bricks.array[i] === "y")        // if that brick is alive
            {
                //for Brick no. i check if any collission has occurred...
                BrickID = "#brick" + i;
                top = parseInt($(BrickID).css("top"));
                left = parseInt($(BrickID).css("left"));

                //check if Brick rectangle contains Bullet rectangle

                if(bullet.status === "running" &&  left<=bullet.left && (left+bricks.width >= bullet.left + bullet.width) && top <= bullet.top && (top+bricks.height >= bullet.top+bullet.height))
                {
                    bullet.status = "sleeping";
                    $("#bullet").css({ "display": "none" });
                    bricks.array[i] = "n";
                    $(BrickID).fadeOut();
                    $("#flyingPoint").css({
                        "top": top,
                        "left": left,
                        "display": "block"
                    }).animate({
                        "top": 0
                    }).fadeOut();
                    player.score += 100;
                    document.getElementById("Scoreboard").innerHTML = "Score : " + player.score;
                    if (player.score == 2000)
                    {
                        clearInterval(interval1);
                        clearInterval(interval2);
                        document.getElementById("Scoreboard").innerHTML += "<br/> CONGRATULATION !!!";
                        $("#Scoreboard").animate({
                            "height": 120 + "px"
                        });
                    }
                }
                else if(top + bricks.height > player.top)           // Bricks Touching Player??? Then Game Over
                {
                    $(".brickSize").fadeOut();
                    //alert("Game Over...");
                    clearInterval(interval1);
                    clearInterval(interval2);
                    document.getElementById("Scoreboard").innerHTML += "<br/> GAME OVER";
                    $("#Scoreboard").animate({
                        "height": 120 + "px"
                    });
                }
            }

        }
    }

    function drawPlayer()
    {
        $("#player").css({ "left": player.left + "px" });
    }

    function drawBullet()
    {
        if (bullet.status === "running" && bullet.top > 0) {
            bullet.top = bullet.top - 15;
            $("#bullet").css({
                "display": "block",
                "top": bullet.top,
                "left": bullet.left
            });
        }
        else {
            bullet.status = "sleeping";
            $("#bullet").css({ "display": "none" });
        }
    }

    function drawBricks()
    {
        //alert("Drawing Bricks");

        
        //draw all bricks
        for (var i = 1; i <= 20; i++)
        {
            if (bricks.array[i] === "y")        // if that brick is alive
            {
                var BrickID = "#brick" + i;
               
                if (bricks.turn == 1 || bricks.turn == 4)       //Shift towards Left
                {
                    var Newleft = parseInt($(BrickID).css("left")) - bricks.shift;
                    $(BrickID).css({ "left": Newleft });
                }
                else if (bricks.turn == 2 || bricks.turn == 3)  //Shift towards Right
                {
                    var Newleft = parseInt($(BrickID).css("left")) + bricks.shift;
                    $(BrickID).css({ "left": Newleft });
                }
                else if (bricks.turn == 5)                      // Shift Downwards
                {
                    var NewTop = parseInt($(BrickID).css("top")) + bricks.shift;
                    $(BrickID).css({ "top": NewTop });         
                }
            }
        }

        //Increase Bricks Turn
        bricks.turn++;
        if (bricks.turn == 6) { bricks.turn = 1;}
    }


    var interval1 = setInterval(render, 1000 / 60);
    var interval2 = setInterval(drawBricks, 1500);

});