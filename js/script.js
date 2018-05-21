window.addEventListener("load", pageReady, false);

function pageReady() {
  //Get HTML elements for manipulation
  var stageHeader = document.querySelector("main h2");
  var houseSections = document.getElementById("house").children;
  var mainDoor = document.getElementById("door");
  var windows = document.getElementsByClassName('window');
  var bases = document.getElementsByClassName("base");
  var roofTops = document.getElementsByClassName("r_top");
  var formHandler = document.forms.build;
  var radioInputs = document.querySelectorAll("input");
  var options; //variable to hold active list of selected items


  //HELPER FUNCTION
    //add event listeners to elements
    function addListener (arrayList, eventString, funcName) {
      for (var i=0; i < arrayList.length; i++) {
        let itemToTarget;
        arrayList[i].addEventListener(eventString, funcName, false);
      }
    }//end of addListener

  //USER INTERACTION
  formHandler.addEventListener("submit",function(e){rForm(e);}, false);

    //Reset Form values to original
    function rForm(e) {
      e.preventDefault;//prevent form submission

      options = document.querySelectorAll("*:checked");//Gets currently selected attributes
      for (var i = 0; i < options.length; i++){
        options[i].checked = false;
      }
      radioInputs[0].checked = true;
      radioInputs[3].checked = true;
      radioInputs[7].checked = true;
      return false;
    }


  //REFRESH AND BUILD HOUSE FUNCTIONS
  addListener(radioInputs, "change", getChecked);//add listeners for each radio input
  getChecked();

    //Get Updated list of checked items and update house
    function getChecked() {
      options = document.querySelectorAll("*:checked");//Gets currently selected attributes
      refreshHouse();//Refresh the house based on newly checked options
      stageHeader.focus();
    }

    //Update the House to reflect the recent selection
    function refreshHouse() {
      //Set new properties of the house
      setStories(options[0].value);
      setExtensions(options[1].value);
      setWindows(options[2].value);
    }

    //Set the Selected Extension to be visible
    function setExtensions(selectedValue) {

      switch(selectedValue) {
      case "Both":
      //Show Both extensions
        houseSections[2].classList.add("show");
        houseSections[0].classList.add("show");
        break;
      case "Left":
      //Show Left extension
        houseSections[2].classList.remove("show");
        houseSections[0].classList.add("show");
        break;
      case "Right":
      //Show Right extension
        houseSections[0].classList.remove("show");
        houseSections[2].classList.add("show");
        break;
      case "None":
      //Clear Both extensions
        houseSections[0].classList.remove("show");
        houseSections[2].classList.remove("show");
        break;
      }
    }//end of setExtensions

    //Fix Center section roof when 1 story
    function fixRoof(currentExtension) {
      switch(currentExtension){
        case "Right":
        //When Right extension is shown, fill in right roof gap
          roofTops[1].classList.add("right");
          roofTops[1].classList.remove("left");
          break;
        case "Left":
        //When Left extension is shown, fill in left roof gap
          roofTops[1].classList.add("left");
          roofTops[1].classList.remove("right");
          break;
        case "Both":
        //When Both extension is shown, fill in both roof gaps
          roofTops[1].classList.add("right");
          roofTops[1].classList.add("left");
          break;
        case "None":
        //When neither extension is shown, return roof to original
          roofTops[1].classList.remove("right");
          roofTops[1].classList.remove("left");
          break;
      }
    }

    //Adjust the house Height
    function setStories(selectedValue) {

      switch (selectedValue) {
      case "One":
      //if one story, return to original heights
        bases[0].classList.remove("two");
        bases[1].classList.remove("two");
        bases[2].classList.remove("two");
        bases[1].classList.remove("three");
        fixRoof(options[1].value);
        break;
      case "Two":
      //if two stories, set center to 7.5em height
        bases[0].classList.remove("two");
        bases[2].classList.remove("two");
        bases[1].classList.remove("three");
        bases[1].classList.add("two");
        roofTops[1].classList.remove("right");
        roofTops[1].classList.remove("left");
        break;
      case "Three":
      //if three stories, set center to 10em, right and left to 7.5em height
        bases[0].classList.add("two");
        bases[2].classList.add("two");
        bases[1].classList.add("three");
        bases[1].classList.remove("two");
        roofTops[1].classList.remove("right");
        roofTops[1].classList.remove("left");
        break;
      }
    }//end of setExtensions

    //Create a row for the windows
    function createWindowRow() {
      var Row = document.createElement("div");
      Row.setAttribute("class","w_row");
      return Row;
    }

    //Create a window with a pane of glass in it
    function createWindow() {
      var newWindow = document.createElement("div");
      newWindow.setAttribute("class","window");
      var newPane = document.createElement("div");
      newPane.setAttribute("class","pane");
      newWindow.appendChild(newPane);
      return newWindow;
    }

    //Fill windows into Rows
    function fillWindowRow(row, numberPerRow) {
      for (var i = 1; i <= numberPerRow; i++){
        row.appendChild(createWindow());
      }
    }

    //Add windows to parts of house that are visible
    function setWindows(selectedValue) {
      var tempRow; //temporary variable to hold the row of windows
      var tempWindow; //temporary variable to hold the a window

      //Clear all of the current rows of windows
      var windowRows = document.querySelectorAll(".w_row");
      for (var i = 0; i < windowRows.length; i++) {
        // windowRows[i].remove(); //Do not use as .remove() is not supported in IE
        windowRows[i].parentElement.removeChild(windowRows[i]); //parentElement has better coverage in IE
      }

      //If Some selected add Some Rows, then add Window Rows
      if (selectedValue == "Some" || selectedValue == "More") {

        //Add one Row to each House Section
        for (var i = 0; i <= 2; i++) {
          tempRow = createWindowRow();
          if (i==1){
            bases[i].insertBefore(tempRow, mainDoor);
          } else {
            bases[i].appendChild(tempRow);
          }
        }

        //Check the number of Stories selected
        switch (options[0].value) {
          case "Three":
          //add 2nd and 3rd rows to Center Section
            for (var a = 0; a <= 1; a++) {
              tempRow = createWindowRow();
              bases[1].insertBefore(tempRow, mainDoor);
            }
            //add 1 more row to the Left and Right Sections
            for (var b = 0; b <= 2; b+=2) {
              tempRow = createWindowRow();
              bases[b].appendChild(tempRow);
            }
            break;
          case "Two":
          // If there's 2 stories
            // add 2nd row to Center Section
            tempRow = createWindowRow();
            bases[1].insertBefore(tempRow, mainDoor);
            break;
        }
      }//end of IF to add WindowRows based on stories

      // Fill in the Windows into the Rows
      if (selectedValue == "Some") {
        for (var i=0; i<=2; i++) {
          // Get the number of rows in this(i) Section
          if (i==1) {
            numberRows = (bases[i].childElementCount)-1;
          } else {
            numberRows = (bases[i].childElementCount);
          }

          for (var j=0; j < numberRows; j++) {
            if (i==1) {
              fillWindowRow(bases[i].children[j], 2);
            } else {
              fillWindowRow(bases[i].children[j], 1);
            }
          }
        }
      }
      if (selectedValue == "More") {
        for (var i=0; i<=2; i++) {
          // Get the number of rows in this(i) Section
          if (i==1) {
            numberRows = (bases[i].childElementCount)-1;
          } else {
            numberRows = (bases[i].childElementCount);
          }

          for (var j=0; j < numberRows; j++) {
            if (i == 1 && j == 2 || i== 1 && j == 1 && options[0].value == "Two" || i== 1 && j == 0 && options[0].value == "One") {
              fillWindowRow(bases[i].children[j], 2);
            } else if (i==1 && j < 2) {
              fillWindowRow(bases[i].children[j], 3);
            } else {
              fillWindowRow(bases[i].children[j], 2);
            }
          }
        }
      }
    }//end of setWindows


  //Update Copyright year
  var cYear = document.getElementById('year');
  var currentYear = new Date();
  cYear.textContent = currentYear.getFullYear();


}//end of PageReady
