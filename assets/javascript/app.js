$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDO_8U_LHLECbsknbaD8VLMnTzwJnK1ZNU",
    authDomain: "trainscheduler-543bc.firebaseapp.com",
    databaseURL: "https://trainscheduler-543bc.firebaseio.com",
    projectId: "trainscheduler-543bc",
    storageBucket: "trainscheduler-543bc.appspot.com",
    messagingSenderId: "894866866008"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

//when data in firebase changes...
  database.ref().on("child_added", 
    function(snapshot) {
      // console.log(snapshot.val());

      var currentTime = moment();

      var lastTrain = currentTime.diff(snapshot.val().startTime, 'minutes') % snapshot.val().frequency;
      var nextTrain = snapshot.val().frequency - lastTrain;
      // console.log(nextTrain);

      var nextArrival = currentTime.add(nextTrain, 'minutes');
      console.log(nextArrival);
      var nextArrivalC = moment(nextArrival).format("HH:mm");
      // console.log(nextArrivalC);

      $(".table").append(
        "<tr><td>" + snapshot.val().name + 
        "</td><td>" + snapshot.val().destination + 
        "</td><td>" + snapshot.val().frequency + 
        "</td><td>" + nextArrivalC + 
        "</td><td>" + nextTrain + 
        "</td></tr>");
    }, 
    function(errorObject) {
        console.log("The read failed: " + errorObject.code);
  });


//when "add train" button is clicked
  $("#addTrain").on("click", function(event) {
    event.preventDefault();
    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var startTime = moment().format("YYYY-MM-DD") + ($("#train-time").val().trim());
    var frequency = $("#frequency").val().trim();

    var currentTime = moment();

    var lastTrain = currentTime.diff(startTime, 'minutes') % frequency;
    var nextTrain = frequency - lastTrain;
    // console.log(nextTrain);

    var nextArrival = currentTime.add(nextTrain, 'minutes');
    var nextArrivalC = moment(nextArrival).format("HH:mm");
    // console.log(nextArrivalC);

    database.ref().push({
      name: name,
      destination: destination,
      startTime: startTime,
      frequency: frequency
    });
  });

});