var packageHandler,
render,
onError,

logCache = [],
log;

render = function (consumed, fup, daysLeft) {
  document.body.classList.remove("loading");
  document.getElementById("log").remove();
  document.getElementById("fup").innerHTML = fup;
  document.getElementById("consumed").innerHTML = consumed;
  document.getElementById("bb-meter").innerHTML =
    (((fup - consumed) / fup) * 100).toFixed(2) + "%";
  document.getElementById("target-rate").innerHTML =
    (consumed/daysLeft).toFixed(2);
  return this;
};

onError = function (message) {
  document.body.classList.add("error");
  message = message || this.statusText;
  if (this.status === 0) {
    log('error', "Unable to connect to the Internet");
  } else {
    log('error', message);
  }
};

log = function (level, message) {
  level = level || 'info';
  message = message || ' ';

  // Cache message till DOM is ready
  logCache.push([level, message]);

  if (document.readyState !== 'complete') {
    return;
  }

  var $log = document.getElementById("log"),
  span;

  logCache.forEach(function (message) {
    span = document.createElement("span");
    span.className = message[0];
    span.innerHTML = message[1];

    $log.appendChild(span);
  });

  logCache = [];
};

log('info', 'Starting up');

// Find and update user's package.
packageHandler = new XMLHttpRequest();
packageHandler.onerror = onError;
packageHandler.open("GET", "http://122.160.230.125:8080/gbod/gb_on_demand.do", true);
packageHandler.onreadystatechange = function () {

  var div,
  details,
  usage, // Total usage, in GigaBytes
  fup, // Users's package -> one among the list
  daysLeft; //No of days left in current billing cycle

  if (this.readyState !== 4 || this.status !== 200) {
    return this;
  }

  log('success', 'Fetched package info');

  div = document.createElement("div");
  div.innerHTML = this.responseText;

  elems = div.querySelectorAll('.content-data ul li')

  details = [];

  for(i = 0; i< elems.length;i++){details.push(elems[i].innerText.split(":"))}
  usage = parseFloat(details[1][1].trim());
  fup   = parseFloat(details[2][1].trim());
  daysLeft = details[3][1].trim();

  return render(usage, fup, daysLeft);
};
log('info', 'Fetching package info');
packageHandler.send();
