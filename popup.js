var packages = [
    {'name': 'ACT Freedom', 'data': 20},
    {'name': 'ACT Liberty', 'data': 30},
    {'name': 'ACT Privilege', 'data': 40},
    {'name': 'ACT Abundant', 'data': 50},
    {'name': 'ACT Indulge', 'data': 60},
    {'name': 'ACT Extravagant', 'data': 100},
    {'name': 'ACT Force', 'data': 200},
    {'name': 'ACT BB HO Value', 'data': 250},
    {'name': 'ACT BB HO Extra', 'data': 350}
],
    usage, // Total usage, in GigaBytes
    package, // Users's package -> one among the list

    usageHandler,
    packageHandler,
    render,
    onError,

    logCache = [],
    log;

render = function (n) {
    if (!usage || !package) {
        return false;
    }

    document.body.classList.remove("loading");

    var consumed = document.getElementById("consumed"),
        fup = document.getElementById("fup"),
        bbMeter = document.getElementById("bb-meter");

    consumed.innerHTML = usage;
    fup.innerHTML = package.data + ' GB';
    bbMeter.innerHTML = (((package.data - usage) / package.data) * 100).toFixed(2) + "%";

    return this;
},

onError = function (message) {
    document.body.classList.add("error");
    message = message || this.statusText;
    if (this.status === 0) {
        log('error', "Unable to connect to the Internet");
    } else {
        log('error', message);
    }
};

log = function(level, message) {
    level = level || 'info';
    message = message || ' ';

    // Cache message till DOM is ready
    logCache.push([level, message]);

    if (document.readyState !== 'complete') {
        return;
    }

    var $log = document.getElementById("log"),
        span;

    logCache.forEach(function(message) {
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
packageHandler.open("GET", "http://portal.acttv.in/index.php/mypackage", true);
packageHandler.onreadystatechange = function () {
    var div, t;

    if (this.readyState !== 4 || this.status !== 200) {
        return this;
    }

    log('success', 'Fetched package info');

    div = document.createElement("div");
    div.innerHTML = this.responseText;

    t = div
        .querySelector('title')
        .textContent;

    if (t === 'Invalid Access') {
        return log('error', "`Invalid Access` fetching package information");
    }

    t = div
        .querySelector(".moduletable tr:nth-child(3) td:nth-child(3)")
        .textContent
        .trim();

    package = packages.filter(function (f) {
        return (f.name.toUpperCase() === t);
    })[0];

    return render();
};
log('info', 'Fetching package info');
packageHandler.send();

// Find and update current usage
usageHandler = new XMLHttpRequest();
usageHandler.onerror = onError;
usageHandler.open("GET", "http://portal.acttv.in/index.php/myusage", true);
usageHandler.onreadystatechange = function () {
    var div, t;

    if (this.readyState !== 4 || this.status !== 200) {
        return this;
    }

    log('success', 'Fetched usage info');

    div = document.createElement("div");
    div.innerHTML = this.responseText;

    t = div
        .querySelector('title')
        .textContent;

    if (t === 'Invalid Access') {
        return log('error', "`Invalid Access` fetching usage information");
    }

    t = div
        .querySelector("#total td:nth-child(2)")
        .textContent
        .replace("GB", '');

    usage = parseFloat(t, 10);

    return render();
};
log('info', 'Fetching usage info');
usageHandler.send();
