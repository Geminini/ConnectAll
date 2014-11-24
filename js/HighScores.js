
function test()
{
	var str = window.location+'';
	if( endsWith(str,"restart"))
		alert("yes it does");
}



function GetHighScoresArray()
{
	var hs = [];
	var temp;
	for(var i = 0; i<10; i++)
    {
    	//user1,0
    	temp = store.get('hs:'+i);
		hs[i] = temp.split(',')[1];
    }
    return hs;
}

function GetFullHighScoresArray()
{
	var hs = [];
	var temp;
	for(var i = 0; i<10; i++)
    {
    	//user1,0
    	temp = store.get('hs:'+i).split(',');
    	var name = temp[0].substring(0, 25);
		hs[i] =  name + "\t(" + temp[1] + " pts)";
    }
    return hs;
}

function GetHighScores()
{
	var hsList = '';
	for(var i = 9; i>=0; i--)
    {
		hsList += store.get('hs:'+i) + '\n';
    }

	var returnValue = hsList.substring(0, hsList.length - 1);

	alert(returnValue);
    return returnValue;
}

function IsTop10HighScore(aScore)
{
	var returnValue = false;
	var top10array = GetHighScoresArray();

	for(var i = 0; i<10; i++)
    {
    	if( aScore > parseInt(top10array[i]) )
		{
			returnValue = true;
			break;
		}
    }

    return returnValue;
}

function GetNewTop10HighScorePosition(aScore)
{
	var returnValue = 0;

	var top10array = GetHighScoresArray();

	for(var i = 9; i>=0; i--)
    {
    	if( aScore > parseInt(top10array[i]) )
    	{
			returnValue = i+1;
			break;
    	}
    }

    return returnValue;
}



function SetNewHighScore(newHighScoreUserName, newHighScore)
{
	//alert("setNewHighScore");

	if( newHighScore > 0 && IsTop10HighScore(newHighScore) )
	{
		var newHighScorePosition = GetNewTop10HighScorePosition(newHighScore);

		var temp;
		for(var i = 0; i<newHighScorePosition; i++)
		{
			temp = store.get('hs:'+(i+1));
			store.set('hs:'+ i, temp);	
		}	

		store.set('hs:'+ (newHighScorePosition -1), newHighScoreUserName + ',' + newHighScore);	
	}
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