var list = [
    {'name':'ACT Freedom','data':'20 GB'},
    {'name':'ACT Liberty','data':'30 GB'},
    {'name':'ACT Privilege','data':'40 GB'},
    {'name':'ACT Abundant','data':'50 GB'},
    {'name':'ACT Indulge','data':'60 GB'},
    {'name':'ACT Extravagant','data':'100 GB'},
    {'name':'ACT Force','data':'200 GB'},
    {'name':'ACT BB HO Value','data': '250 GB'},    
    {'name':'ACT BB HO Extra','data': '350 GB'}
];

var xhr1 = new XMLHttpRequest();
xhr1.open("GET", "http://portal.acttv.in/index.php/mypackage", true);
xhr1.onreadystatechange = function() {
	if(this.readyState != 4) return;

	document.body.classList.remove("loading");

	if(this.status != 200) {
		document.body.classList.add("error");
		return;
	}

	var div = document.createElement("div");
	div.innerHTML = this.responseText;

	var fup = document.getElementById("fup");
	var value = div.querySelector(".moduletable tr:nth-child(3) td:nth-child(3)").textContent.trim();

	for (vendor in list){
	    if(value == list[vendor].name.toUpperCase()){
	    	fup.innerHTML = list[vendor].data;
	    	break;
	    }
	}
};
xhr1.send();

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://portal.acttv.in/index.php/myusage", true);
xhr.onreadystatechange = function() {
	var div = document.createElement("div");
	div.innerHTML = this.responseText;

	consumed = document.getElementById("consumed");
	consumed.innerHTML = div.querySelector("#total td:nth-child(2)").textContent;

	var fup = document.getElementById("fup");

	var fup_no = fup.innerHTML.replace(" GB","");
	var consumed_no = consumed.innerHTML.replace("&nbsp;GB","");
	bb_meter = document.getElementById("bb-meter");

	bb_meter.innerHTML =  ((fup_no - consumed_no) / fup_no)*100 + "%";
};
xhr.send();