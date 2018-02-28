let people = [];
let teams = ["Black", "White"];

function main() {
    getData();
    refresher();
}

function refresher() {
    setTimeout(function() {location.reload();}, 10000);
}

function readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function countGoals(team) {
    let result = 0;
    people.forEach(function(p) {
        if (p.team === team) result += p.score;
    });
    return result;
}

function setCookie() {
    let result = "data=";
    people.forEach(function(p) {
        result += p.id + "," + p.name + "," + p.nickname + "," + p.score + "," + p.team + "|"
    });
    document.cookie = result.substring(0, result.length - 1);
}

function getCookie() {
    let c = readCookie("data");
    if (c && c.length) {
        console.log(c);
        c.split("|").forEach(function(p) {
            let content = p.split(",");
            let temp = {};
            temp.id = parseInt(content[0]);
            temp.name = content[1];
            temp.nickname = content[2];
            temp.score = parseInt(content[3]);
            temp.team = parseInt(content[4]);
            people.push(temp);
        });
    }
    console.log(1, people);
}

function getData() {
    getCookie();
    parseData();
    let url = 'http://www.martinusmaco.sk/24/connect.php';
    return fetch(url, {}).then(function(res1) {
        return JSON.parse(res1).then(function(res2) {
            parseData(res2);
        });
    }).catch(function(e) {
        let data = [
            {"id":"1","name":"Martin Maco","nickname":"Maco","score":"3","team":"0"},
            {"id":"2","name":"Tom\u00e1\u0161 \u0160trigner","nickname":"Tom\u00e1\u0161","score":"1","team":"0"},
            {"id":"3","name":"Bot Three","nickname":"Botto","score":"2","team":"0"},
            {"id":"4","name":"Bot One","nickname":"","score":"6","team":"1"},
            {"id":"5","name":"Bot Two","nickname":"","score":"7","team":"1"},
            {"id":"6","name":"Bot Four","nickname":"Foury","score":"4","team":"1"},
            {"id":"7","name":"Bot Five","nickname":"MaxiXXAXAXAXA","score":"19","team":"1"}
        ];
        parseData(data);
    });
}

function bestPlayers() {
    let div = $("#player-info");
    let result = '';
    let t1 = [];
    let t2 = [];
    people.forEach(function(p) {
        if (p.team === 0) t1.push(p);
        else t2.push(p);
    });
    t1 = t1.sort(compare2);
    t2 = t2.sort(compare2);
    let names = [t1[0].name, t1[1].name, t1[2].name, t2[0].name, t2[1].name, t2[2].name];
    if (t1[0].nickname && t1[0].nickname.length) names[0] = t1[0].nickname;
    if (t1[1].nickname && t1[1].nickname.length) names[1] = t1[1].nickname;
    if (t1[2].nickname && t1[2].nickname.length) names[2] = t1[2].nickname;
    if (t2[0].nickname && t2[0].nickname.length) names[3] = t2[0].nickname;
    if (t2[1].nickname && t2[1].nickname.length) names[4] = t2[1].nickname;
    if (t2[2].nickname && t2[2].nickname.length) names[5] = t2[2].nickname;
    result += names[0] + ': ' + t1[0].score + ', ';
    result += names[1] + ': ' + t1[1].score + ', ';
    result += names[2] + ': ' + t1[2].score + '<br>';
    result += names[3] + ': ' + t2[0].score + ', ';
    result += names[4] + ': ' + t2[1].score + ', ';
    result += names[5] + ': ' + t2[2].score;
    div.html(result);
}

function findByID(id) {
    for (let i = 0; i < people.length; i++) if (people[i].id === id) return people[i];
    return null;
}

function compare(a,b) {
    if (a.name > b.name)
        return -1;
    if (a.name < b.name)
        return 1;
    return 0;
}

function compare2(a,b) {
    if (a.score > b.score)
        return -1;
    if (a.score < b.score)
        return 1;
    return 0;
}

function fillTeam(team) {
    let players = [];
    people.forEach(function(p) {if (p.team === team) players.push(p);});
    players = players.sort(compare);
    let result = '<p class="team-title team-title-' + team + '">Team ' + teams[team] + ': ' + countGoals(team) + ' goals</p>';
    players.forEach(function (p) {
        let name_shown = p.name;
        if (p.nickname && p.nickname.length) name_shown = p.nickname;
        result += '<p class="player-name player-name-' + team + '">' + name_shown + '</p>';
    });
    $("#team-" + team).html(result);
}

function parseData(data) {
    if (!data) data = people;
    console.log(data.length, data);
    let announcer = $("#announcer");
    announcer.hide();
    let news = [];
    data.forEach(function(p) {
        let temp = findByID(parseInt(p.id));
        if (!temp) temp = {};
        temp.id = parseInt(p.id);
        temp.name = p.name;
        temp.nickname = p.nickname;
        if (p.score > 0 && temp.score !== undefined && temp.score !== null && temp.score < parseInt(p.score)) news.push(temp);
        temp.score = parseInt(p.score);
        temp.team = parseInt(p.team);
        if (findByID(parseInt(p.id)) === null) people.push(temp);
        fillTeam(0);
        fillTeam(1);
    });
    if (news.length === 1) {
        goal(news[0]);
    } else {
        announcer.hide();
    }
    bestPlayers();
    setCookie();
}

function convertName(name) {
    let result = name;
    let methods = {

        'ä': 'a',
        'č': 'c',
        'ď': 'd',
        'é': 'e',
        'ě': 'e',
        'í': 'i',
        'ľ': 'l',
        'ĺ': 'l',
        'ň': 'n',
        'ó': 'o',
        'ô': 'o',
        'ö': 'o',
        'ř': 'r',
        'š': 's',
        'ť': 't',
        'ú': 'u',
        'ü': 'u',
        'ý': 'y',
        'ž': 'z'
    };
    for (let key in methods) result = result.replace(key, methods[key]);
    return result.replace(" ", "_");
}

function goal(person) {
    let announcer = $("#announcer");
    announcer.show();
    let result = '';
    let name_shown = person.name;
    if (person.nickname && person.nickname.length) name_shown = person.nickname;
    result += '<p class="goal-p">Team ' + teams[person.team] + ' scored!</p>';
    result += '<p class="goal-person">Player ' + name_shown + ', ' + person.score + ' goals</p>';
    result += '<img src="img/' + convertName(person.name.toLowerCase()) + '.png" class="player-image" />';
    announcer.html(result);
}

function refresh() {
    location.reload();
}