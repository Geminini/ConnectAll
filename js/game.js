$(window).load(function() {

    $(".circles div").each(function() {
        $(this).circulate({
            speed: Math.floor(Math.random()*300) + 500,
            height: Math.floor(Math.random()*1000) - 470,
            width: Math.floor(Math.random()*1000) - 470
        });
    }).click(function() {
        $(this).circulate({
            speed: Math.floor(Math.random()*300) + 100,
            height: Math.floor(Math.random()*1000) - 470,
            width: Math.floor(Math.random()*1000) - 470
        });
    });

});

$(function() {

	var winLocation = window.location.href;
	winLocation = winLocation.split("?");
	if( winLocation.length == 1 )
	{
		$("#header").fadeOut("fast");
		$("#intro").fadeIn("slow");
	}
	else
	{
		$("#game").fadeIn("fast");
		$("#gameScores").fadeIn("fast");
	}

	$("#intro").click(function() 
	{
		$(this).fadeOut("slow", function()
			{
				$("#game").fadeIn("slow");
				$("#gameScores").fadeIn("slow");
				$("#header").fadeIn("slow");

				if(showDropHere())
				{
					$(".top-row").addClass("dropHere");
					window.setTimeout(function(){

						$(".top-row").animate({opacity: 0.0}, 1000, function(){
							$(".top-row").removeClass("dropHere");
							$(".top-row").animate({opacity: 1.0}, 1);
						});

					}, 5000);
				}

			});
	});

	$("#highScores").click(function() 
	{
		$(this).fadeOut("slow", function()
			{
				showGame()
			});
	});

	$(".btnRestart").click(function() {
		RestartGame();
	});

	$(".btnSeeHighScores").click(function() {
		ViewHighScores();
	});




	// Array voor schijven
	// format: schijvenCol[column][row]
	// values: "" (geen cube), geel, rood
	var schijvenCol = [["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""], 
					  ["", "", "", "", "", ""]];
	
	var beurt = "rood";
	var scoreRed = 0;
	var scoreYellow = 0;

	// verwijder alle schijven
	$("#game div.cube").remove();
	
	// event handler voor top-row om schijven te tonen
	$("#game div.top-row").mouseenter(function(e) {
		if ($("#game div.top-row").has(".cube").length == 0) {
			$("<div></div>").addClass("cube " + beurt).appendTo($("#game .top-row"));
			
			// x positie
			var topRowLeft = $("#game div.top-row").offset().left;
			var offset = e.pageX - topRowLeft - 40;

			if (offset < 10) {
				$("#game div.top-row div.cube").css("left", 10);
			} else if (offset > 545) {
				$("#game div.top-row div.cube").css("left", 545);
			} else {
				$("#game div.top-row div.cube").css("left", offset);
			}

		}
	});


	$("#game div.top-row").mousemove(function(e) {

		if ($("#game div.top-row div").filter(":animated").length == 0) {
			var topRowLeft = $("#game div.top-row").offset().left;
			var offset = e.pageX - topRowLeft - 40;
			if (offset < 10) {
				$("#game div.top-row div.cube").css("left", 10);
			} else if (offset > 500) {
				$("#game div.top-row div.cube").css("left", 500);
			} else {
				$("#game div.top-row div.cube").css("left", offset);
			}
		}
	});
	
	




	$("#game div.top-row").click(function(e) {

		var iMarginleft = parseInt( $("#game .firstCol").css("marginLeft") );   //15px van de left-margin (eerste kolon)
		var iColWidth = parseInt( $("#game .column").width() );
		var iCubeSize = parseInt( $("#game .cube").width() );

		// get mouse offset
		var topRowLeft = $("#game div.top-row").offset().left;
		var offset = e.pageX - topRowLeft;
		
		offset -= iMarginleft; 

		// bepaal colom voor nieuwe cube
		var column = 1 + parseInt(offset/iColWidth, 10);

		// bepaal rij voor nieuwe cube
		var row = 6;
		for (i=0; i<schijvenCol[column-1].length; i++) {
			if (schijvenCol[column-1][i] != "") {
				row = i;
				break;
			}
		}

		// Laat de cube vallen als de kolom nog niet vol zit:
		if (row >= 1) {
			
			var deviceTopOffset = 27;
			var deviceLeftOffset = 8;

			if ( isiPad() )
			{
				deviceTopOffset = 25;
				deviceLeftOffset = 7;	
				
			}
			else if ( isiPhone5() )
			{
				if(row != 1)
					deviceTopOffset = 40;

				deviceLeftOffset = 3;
			}
			else if ( isiPhone4() )
			{
				deviceLeftOffset = 0;
				if(row == 1)
					deviceLeftOffset = 0;
				else if(row > 1 && row <= 3)
					deviceTopOffset = 35;
				else
					deviceTopOffset = 55;
				
			}
			

			// offset for cube to animate to
			var left = (iColWidth * column) - iCubeSize -iMarginleft + deviceLeftOffset;//+ 5 + (column*1.5) ;  //+ (iMarginleft/2); // iColWidth = 72 en iCubeSize =  65
			var top = row * iColWidth + deviceTopOffset; 
			
			//testing position:
			//var topcss = "#game .row" + column;
			//alert(topcss);
			//var top = parseInt( $(topcss).css("top") );
			//alert(topcss + "\n" + top);

			// animate cube tot zijn positie in de kolom
			$("#game div.top-row div.cube").animate({left: left, top: top}, 400, function() {
				// create new cube
				$("<div></div>").addClass("cube " + beurt + " row" + row).appendTo($("#game div.column").eq(column - 1));
				
				// update schijven array
				schijvenCol[column-1][row - 1] = beurt;
				
				// verwijder top-row cube
				$("#game div.top-row div.cube").remove();
				
				
				var winner = 0;
				
				// zoek eerts horizontaal
				var l = 0, r = 0;
				
				// zoek naar links
				var searching = true;
				var aCol = column - 1 - l - 1;

				while (searching == true) {
					// volgende kolom bestaat?
					if (aCol < 0) {
						searching = false;
					} else {
						// heeft de volgende rij de juiste kleur cube
						if (schijvenCol[aCol][row - 1] == beurt) {
							l+=1;
							aCol = column - 1 - l - 1;
						} else {
							searching = false;
						}
					}
				}

				// zoek naar rechts
				var searching = true;
				while (searching == true) {
					// volgende kolom bestaat?
					if (column - 1 + r + 1 > 6) {
						searching = false;
					} else {
						// heeft de volgende rij de juiste kleur cube
						if (schijvenCol[column-1+r+1][row - 1] == beurt) {
							r+=1;
						} else {
							searching = false;
						}
					}
				}
				// is er genoeg in een rij?

				if (l + r > 2) {
					winner += (l + r)+1;

					if(winner > 4)
						winner *= 2
				}

				// zoek verticaal
				var d = 0;

				// zoek naar beneden
				var searching = true;
				while (searching == true) {
					// Is er een volgende rij
					if (row - 1 + d + 1 > 5) {
						searching = false;
					} else {
						// heeft de volgende rij de juiste kleur cube
						if (schijvenCol[column-1][row-1+d+1] == beurt) {
							d+=1;
						} else {
							searching = false;
						}
					}
				}
				// zijn er genoeg schijven in kolom
				if (d > 2) {
					if(d>3)
						d =  (d + 1)*2
					else
						d += 1;

					winner += d;
				}
					
				// zoek BOVEN LEFT -> BENEDEN RECHTS
				var l = 0, r = 0;
				// zoek BOVEN->RECHTS
				var searching = true;
				while (searching == true) {
					// is volgende rij/kolom niet null
					if (row - 1 - l - 1 < 0 || column - 1 - l - 1 < 0) {
						searching = false;
					} else {
						// heeft de volgende rij/kolom de juiste kleur cube
						if (schijvenCol[column-1-l-1][row-1-l-1] == beurt) {
							l+=1;
						} else {
							searching = false;
						}
					}
				}

				// zoek BENEDEN->RECHTS
				var searching = true;
				while (searching == true) {
					// is volgende rij/kolom niet null
					if (row - 1 + r + 1 > 5 || column - 1 + r + 1 > 6) {
						searching = false;
					} else {
						// heeft de volgende rij/kolom de juiste kleur cube
						if (schijvenCol[column-1+r+1][row-1+r+1] == beurt) {
							r+=1;
						} else {
							searching = false;
						}
					}
				}

				// zijn er genoeg schijven/plaatsen diagonaal
				if (l + r > 2) {
					winner += (l + r + 1)*3;
				}
			
				// zoek BENEDEN.RECHTS-> BOVEN.RECHTS
				var l = 0, r = 0;
				// zoek BENEDEN->LINKS
				var searching = true;
				while (searching == true) {
					// is volgende rij/kolom niet null
					if (row - 1 + l + 1 > 5 || column - 1 - l - 1 < 0) {
						searching = false;
					} else {
						// heeft de volgende rij/kolom de juiste kleur cube
						if (schijvenCol[column-1-l-1][row-1+l+1] == beurt) {
							l+=1;
						} else {
							searching = false;
						}
					}
				}
				
				// zoek TOP->RECHTS
				var searching = true;
				while (searching == true) {
					// is volgende rij/kolom niet null
					if (row - 1 - r - 1 < 0 || column - 1 + r + 1 > 6) {
						searching = false;
					} else {
						// heeft de volgende rij/kolom de juiste kleur cube
						if (schijvenCol[column-1+r+1][row-1-r-1] == beurt) {
							r+=1;
						} else {
							searching = false;
						}
					}
				}




				// zijn er genoeg schijven/plaatsen diagonaal
				if (l + r > 2) {
					winner += (l + r + 1)*3;
				}
				
				
				
				// set countUp options
    			var options = {
	        		useEasing : true, // toggle easing
			        useGrouping : true, // 1,000,000 vs 1000000
			        separator : ',', // character to use as a separator
			        decimal : '.', // character to use as a decimal
			    }

			    var options = {
				  useEasing : true, 
				  useGrouping : true, 
				  separator : ',', 
				  decimal : '.' ,
				  prefix : '' ,
				  suffix : '' 
				}
			    	
				if (winner > 0) {
					var countKleur = '';
					var countScore = 0;
					var vorigeScore = 0;

					if( beurt == "rood")
					{
						vorigeScore = scoreRed;
						scoreRed+=winner;
						countKleur = 'scoreRood';
						countScore = scoreRed;
					}
					else
					{
						vorigeScore = scoreYellow;
						scoreYellow+=winner;
						countKleur = 'scoreGeel';
						countScore = scoreYellow;
					}

					var countup = new countUp(countKleur, vorigeScore, countScore, 0, 2.5, options);
					//var demo = new countUp("myTargetElement", 0, 5, 0, 2.5, options);
				    countup.start();
				}


				var isGameOver = true;
				var iRow = 6;
				for (iCol=0; iCol< 7; iCol++ )
				{
					if (schijvenCol[iCol][0] == "") {
						isGameOver = false;
						break;
					}
				}

				var winningScore = 0;

				if( isGameOver )
				{
					$("#game").fadeOut("fast");
					$("#gameScores").fadeOut("fast");

					var winnerUserName = '';
					var winnerColor = '';
					var somebodyWins = false;


					if( scoreYellow > scoreRed )
					{
						somebodyWins = true;
						winnerColor = 'YELLOW';
						winningScore = scoreYellow;

						$("#gameOver").addClass( "geelWins" ).fadeIn("slow");
					}
					else if(scoreRed > scoreYellow )
					{
						somebodyWins = true;
						winnerColor = 'RED';
						winningScore = scoreRed;

						$("#gameOver").addClass( "roodWins" ).fadeIn("slow");
					}
					else 
					{
						$("#gameOver").addClass( "nobodyWins" ).fadeIn("slow");
					}

					$("#gameOver").click(function() {
						if( somebodyWins )
							SetNewHighScoreIfAny(winningScore, winnerColor);
						else
							redirectAfterGame(false);
					});
				}

				
				
				// switch beurten
				beurt = (beurt == "rood") ? "geel" : "rood";
				// trigger mouseenter
				$("#game div.top-row").trigger("mouseenter");
				
				// position nieuwe cube
				var topRowLeft = $("#game div.top-row").offset().left;
				var offset = e.pageX - topRowLeft - 40;
				if (offset < 10) {
					$("#game div.top-row div.cube").css("left", 10);
				} else if (offset > 616) {
					$("#game div.top-row div.cube").css("left", 616);
				} else {
					$("#game div.top-row div.cube").css("left", offset);
				}
			});
		}
	});
	
	$("#game div.top-row").mouseleave(function(e) {
		$("#game div.top-row div.cube").not(":animated").remove();
	});
});






function RestartGame()
{
	if( endsWith(window.location+'', "?restart") )
		window.location = window.location;
	else
		window.location = window.location + "?restart";
}

function ViewHighScores()
{
	hideGame();
	hideGameOver();
	
	$("#highScores").fadeIn("slow");
	//var high_scores = $("#high-scores");
	var high_scores = document.querySelector("#highScores ol.high-scores");

    high_scores.style.display = "block";
    high_scores.innerHTML = '';

    var scores = GetFullHighScoresArray();

    for(var i = 0; i <10; i++)
    {
    	if( scores[i] != undefined)
    	{
	        var s = scores[i];                      
	        var fragment = document.createElement('li');
	        fragment.innerHTML = (typeof(s) != "undefined" ? s : "" );
	        high_scores.appendChild(fragment);
	    }
    }
}

function hideGame()
{
	$("#gameContainer").fadeOut("fast");
}
function showGame()
{
	$("#gameContainer").fadeIn("fast");
	$("#game").fadeIn("fast");
	$("#gameScores").fadeIn("fast");

}

function hideGameOver()
{
	$("#gameOver").fadeOut("fast");
}


function showDropHere()
{
	if( !CheckLocalStorage() )
		return false;

	var returnValue = true;

    var temp = store.get('ConmAllFT');
    if(temp == undefined)
    {
		returnValue = true;
		store.set('ConmAllFT', 1);
    }

    return returnValue;
}

function setANewHighScore()
{
	var newHighScore = 1;

	// prompt dialog
	alertify.prompt("Enter new HighScore", function (e, str) {
	    // str is the input text
	    if (e) {
	        // user clicked "ok"
	        newHighScore = str;

	        if( newHighScore > 0 )
			{
				SetNewHighScoreIfAny(newHighScore,"Red");
			}

	    } else {
	        // user clicked "cancel"
	    }
	}, newHighScore);

}

function redirectAfterGame(isTop10)
{
	if(isTop10)
    	ViewHighScores();
    else
		RestartGame();
}
	