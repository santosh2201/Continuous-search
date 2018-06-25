// ================================= Mock Server Start =============================
var FAILURE_COEFF = 10;
var MAX_SERVER_LATENCY = 200;

function getRandomBool(n) {
  var maxRandomCoeff = 1000;
  if (n > maxRandomCoeff) n = maxRandomCoeff;
  return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
}

function getSuggestions(text) {
  var pre = 'pre';
  var post = 'post';
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    var randomTimeout = Math.random() * MAX_SERVER_LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COEFF)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}
// ================================= Mock Server End =============================

function populateLiElements(input, list, ul) {
  var html = "";
  var selectedClass = "selected";
  list.forEach(function(element) {
    var index = element.indexOf(input);
    var pre = element.substring(0, index);
    var post = element.substring(index + input.length);
    html = html + '<li class="' + selectedClass + '" element="' + element + '"><p>' + pre + '<span>' + input + '</span>' + post + '</p></li>';
    selectedClass = "";
  });
  ul.innerHTML = html;
}

function getSuggestionsProvider() {
  var input, ul;
  ul = document.getElementById("myUL");
  var inputString = document.getElementById("myInput").value;
  var inputSplit = inputString.split(" ");
  input = inputSplit[inputSplit.length - 1];

	if (input == "") {
		return false;
	} else {
		toggleSuggestionsProvider(true);
	}
  getSuggestions(input).then(function(list) {
      populateLiElements(input, list, ul);
    },
    function(error) {
      var list = [];
      populateLiElements(input, list, ul);
    });
}

function toggleSuggestionsProvider(show) {
  var ul = document.getElementById("myUL");
  if (show) {
    ul.style.display = "";
  } else {
    ul.style.display = "none";
  }
}

function selectSuggestion(li) {
  var inputElement = document.getElementById("myInput");
  var inputString = inputElement.value;
  var lastIndexOfSpace = inputString.lastIndexOf(" ");
  var inputWithoutLastSpace = inputString.substring(0, lastIndexOfSpace + 1);
  var input = inputWithoutLastSpace + li.attr("element") + " ";
  inputElement.value = input;
  li.parent().html("");
}

$(window).keydown(function(e) {
  var li = $('li');
  var liSelected = $('ul .selected');
  if (e.which === 40) {	//Up arrow button
    if (liSelected) {
      liSelected.removeClass('selected');
      next = liSelected.next();
      if (next.length > 0) {
        liSelected = next.addClass('selected');
      } else {
        liSelected = li.eq(0).addClass('selected');
      }
    } else {
      liSelected = li.eq(0).addClass('selected');
    }
  } else if (e.which === 38) {	//Down arrow button
    if (liSelected) {
      liSelected.removeClass('selected');
      next = liSelected.prev();
      if (next.length > 0) {
        liSelected = next.addClass('selected');
      } else {
        liSelected = li.last().addClass('selected');
      }
    } else {
      liSelected = li.last().addClass('selected');
    }
  } else if (e.which == 13 && liSelected.length) {	//Enter button
    selectSuggestion(liSelected);
  } else if (e.which == 32) {	//Space button is not allowed
    return false;
  }
  return true;
}).keyup(function(e) {
  if ($.inArray(e.which, [40, 38, 13, 32]) == -1) {	//showing suggestions on keyup event
    getSuggestionsProvider();
  }
});
