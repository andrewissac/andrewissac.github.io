var items = [];

$("textarea.Source").bind("input propertychange", function () {
	let str = $("textarea.Source").val();
	items = parseStringToListOfStrings(str);
	updateItems(items);
});

$("#SelectRandomItem").click(function () {
	$("p#ChosenItem").html(chooseRandomItem(items));
});

function parseStringToListOfStrings(myString) {
	myString = myString.replace(/(\r\n|\n|\r)/gm, "linebreak");
	var stringArray = myString.split("linebreak");
	stringArray = removeAllOccurances(stringArray, "");
	return stringArray;
}

function updateItems(stringArray) {
	var items = [];
	stringArray.forEach((item) => {
		items.push("<li>" + item + "</li>");
	});
	$("ul.Items").empty().html(items.join(""));
}

function removeAllOccurances(arr, value) {
	var i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}

function chooseRandomItem(array) {
	return array[Math.floor(Math.random() * array.length)];
}
