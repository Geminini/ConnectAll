
function testGameOver()
{
	$("#gameOver").addClass( "geelWins" ).fadeIn("slow");

	$("#gameOver").click(function() {
						//debugger;
						var aScore = 1234;
						var isTop10 = IsTop10HighScore(aScore);

						SetNewHighScoreIfAny(1256, "RED");
					});
}



function test()
{
	var str = window.location+'';
	if( endsWith(str,"restart"))
		alert("yes it does");
}

function CheckLocalStorage()
{
	if(typeof(Storage)!=="undefined")
  	{
  		// Yes! localStorage and sessionStorage support!
  		return true;
  	}
	else
  	{
  		return false;
  	}
}

function GetHighScoresArray()
{
	var hs = [];
	
	if( !CheckLocalStorage() )
		return null;

	var temp;
	for(var i = 0; i<10; i++)
    {
    	temp = store.get('hs:'+i);
    	if(temp != undefined)
    	{
    		hs[i] = temp.split(',')[1];
    	}	
    }
    return hs;
}

function GetFullHighScoresArray()
{
	var hs = [];

	if( !CheckLocalStorage() )
		return null;

	var temp;
	for(var i = 0; i<10; i++)
    {
    	temp = store.get('hs:'+i);
    	
    	if(temp != undefined)
    	{
    		temp = temp.split(',');

    		var name = temp[0].substring(0, 25);
			hs[i] =  name + "\t(" + temp[1] + " pts)";
    	}
    }
    return hs;
}

function GetHighScores()
{
	if( !CheckLocalStorage() )
		return null;

	var hsList = '';
	for(var i = 0; i<10; i++)
    {
    	var temp = store.get('hs:'+i);
    	if(temp != undefined)
			hsList += store.get('hs:'+i) + '\n';
    }

	var returnValue = hsList.substring(0, hsList.length - 1);

	alert(returnValue);
    return returnValue;
}

function IsTop10HighScore(aScore)
{
	return GetNewTop10HighScorePosition(aScore) > -1;
}

function GetNewTop10HighScorePosition(aScore)
{
	if( !CheckLocalStorage() )
		return false;

	var returnValue = -1;
	var top10array = GetHighScoresArray();

	if((top10array != null || top10array != undefined) && top10array.length > 0)
	{
		for(var i = 0; i<10; i++)
	    {
	    	if( top10array[i] != undefined && top10array[i] != null)
	    	{
	    		if( aScore > parseInt(top10array[i]) )
		    	{
					returnValue = i+1;
					break;
		    	}
	    	}
	    	else
	    	{
	    		returnValue = i+1;
				break;
	    	}
	    }
	}
	else
	{
		if( aScore > 0 )
		{
			returnValue = 1;
		}
	}

    return returnValue;
}


function SetNewHighScoreIfAny(newScore, winningColor)
{
	returnValue = false;

	if( IsTop10HighScore(newScore))
	{
		// prompt dialog
		var winnerUserName;

		alertify.prompt("New high score!!!\nPlease enter " + winningColor + " user name", function (e, str) {
		    // str is the input text
		    if (e) {
		        // user clicked "ok"
		        winnerUserName = str.substring(0, 25);
		        
				if(winnerUserName != '')
				{
        			setNewHighScore(winnerUserName, newScore);
        			redirectAfterGame(returnValue);
				}

		    } else {
		        // user clicked "cancel"
		        redirectAfterGame(returnValue);
		        
		    }
		}, "Harry Potter");	
	}			    
	return returnValue;
}

function setNewHighScore(newHighScoreUserName, newHighScore)
{
	if( !CheckLocalStorage() )
		return false;


	var newHighScorePosition = GetNewTop10HighScorePosition(newHighScore);
	var temp;

	for(var i = 9; i>=newHighScorePosition; i--)
	{
		temp = store.get('hs:'+(i-1));
    	if(temp != undefined)
    	{
    		store.set('hs:'+ i, temp);
    	}
	}
	store.set('hs:'+ (newHighScorePosition -1), newHighScoreUserName + ',' + newHighScore);	
}


function setInitialHighScore()
{
	//alert("setInitialHighScore");
	for(var i = 0; i<10; i++)
    {
		store.set('hs:'+i, 'User' + i + ',0');
    }
}

function resetInitialHighScore()
{
	store.clear();
	setInitialHighScore();
}

function CleanUp()
{
	store.clear();
}

function init() {

    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return;
    }

	setInitialHighScore();
}


function getsetUserName()
{
	var username = store.get('username');	
	if( username == undefined || username == null )
	{
		username = prompt("Enter yur name:");
		store.set('username', username);
	}
}

function morestuff() {
    var user = store.get('username');
    // ... and so on ...


    // Get 'username'
	store.get('username');

	// Remove 'username'
	store.remove('username');

	// Clear all keys
	store.clear();

	// Store an object literal - store.js uses JSON.stringify under the hood
	store.set('user', { name: 'marcus', likes: 'javascript' });

	// Get the stored object - store.js uses JSON.parse under the hood
	var user = store.get('user');
	/////alert(user.name + ' likes ' + user.likes);

	// Get all stored values
	store.getAll().user.name == 'marcus';

	// Loop over all stored values
	store.forEach(function(key, val) {
	    console.log(key, '==', val);
	})

}