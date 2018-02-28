let people = [];
let teams = ["Bielych", "Čiernych"];

function mobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function main() {
    if (mobile()) drawMobile();
    else getData();
}

function refresher() {
    setTimeout(function() {location.reload();}, 6000);
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
        console.log("COOKIE", c);
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
}

function getData() {
    getCookie();
    parseData();
    let url = 'http://www.martinusmaco.sk/24/connect.php';
    return fetch(url, {}).then(function(res1) {
        console.log(res1);
        return res1.json().then(function(res2) {
            console.log(res2);
            parseData(res2);
            refresher();
        });
    })
}

function bestPlayers() {
    if (people.length < 6) return false;
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
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function parseGoals(g) {
    if (g === 0) return "gólov";
    if (g === 1) return "gól";
    if (g < 5) return "góly";
    return "gólov";
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
    let result = '<p class="team-title team-title-' + team + '">Tím ' + teams[team] + ': ' + countGoals(team) + ' ' + parseGoals(countGoals(team)) + '</p>';
    result += '<div class="row">';
    players.forEach(function (p) {
        let name_shown = p.name;
        if (p.nickname && p.nickname.length) name_shown = p.nickname;
        result += '<div class="col-lg-6 col-md-6 col-sm-12"><p class="player-name player-name-' + team + '">' + name_shown + '</p></div>';
    });
    result += '</div>';
    $("#team-" + team).html(result);
}

function parseData(data) {
    if (!data) data = people;
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
    });
    fillTeam(0);
    fillTeam(1);
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
    result += '<p class="goal-p">Tím ' + teams[person.team] + ' skóruje!</p>';
    result += '<p class="goal-person">' + name_shown + ', ' + person.score + ' ' + parseGoals(person.score) + '</p>';
    result += '<img src="img/' + convertName(person.name.toLowerCase()) + '.png" class="player-image" />';
    announcer.html(result);
}

function refresh() {
    location.reload();
}

function drawMobile() {
    getData2();
}

function getData2() {
    let url = 'http://www.martinusmaco.sk/24/connect.php';
    return fetch(url, {}).then(function(res1) {
        return res1.json().then(function(res2) {
            parseData2(res2);
        });
    })
}

function parseData2(data) {
    data.forEach(function(p) {
        let temp = findByID(parseInt(p.id));
        if (!temp) temp = {};
        temp.id = parseInt(p.id);
        temp.name = p.name;
        temp.nickname = p.nickname;
        temp.score = parseInt(p.score);
        temp.team = parseInt(p.team);
        if (findByID(parseInt(p.id)) === null) people.push(temp);
    });
    let main = $("#main");
    main.removeClass();
    main.html("");
    createTeam(0);
    createTeam(1);
}

function getByTeam(team) {
    let result = [];
    people.forEach(function(p) {
        if (p.team === team) result.push(p);
    });
    return result;
}

function createTeam(team) {
    let main = $("#main");
    let result = '<div>' +
        '<button data-toggle="collapse" class="btn collapse-btn" data-target="#collapse-team-' + team + '">Team ' + teams[team] + ': ' + countGoals(team) + ' ' + parseGoals(countGoals(team)) + '</button>' +
        '<div id="collapse-team-' + team + '" class="collapse collapse-team">';
    let t = getByTeam(team);
    t = t.sort(compare);
    t.forEach(function(p) {
        result += '' +
            '<p class="collapse-player">' +
            '<span id="player-stats-' + p.id + '">' + p.name + ' (' + p.score + ')</span>' +
            '</p>';
    });
    result += '</div></div>';
    main.html(main.html() + result);
}