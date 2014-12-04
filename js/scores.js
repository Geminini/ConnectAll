function createLeaderboard() {

    // create array of sample scores
 
    for (var i = 0; i < highScores; i++) {
        readScore.push([10000 - (i * 1000)]);
    }

	var ScoresSerialized = JSON.stringify(readScore);

 	var applicationData = Windows.Storage.ApplicationData.current;
	var localFolder = applicationData.localFolder;

	localFolder.createFileAsync("myScores.txt",

	Windows.Storage.CreationCollisionOption.failIfExists).then(function (sampleFile) {

	        return Windows.Storage.FileIO.writeTextAsync(sampleFile,
	        ScoresSerialized);

	    });

localFolder.getFileAsync("myScores.txt")

	     .then(function (sampleFile) {

	         return Windows.Storage.FileIO.readTextAsync(sampleFile);

	     }).done(function (gotscores) {

	             var fscores = JSON.parse(gotscores);

	         readScore = fscores;

	     }, function () {

	     });

	}