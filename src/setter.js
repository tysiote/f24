let people = [];
let teams = ["bielych", "čiernych"];

function main() {
    getData();
}
function getData() {
    let url = 'http://www.martinusmaco.sk/24/connect.php';
    return fetch(url, {}).then(function(res1) {
        return res1.json().then(function(res2) {
            parseData(res2);
        });
    })
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
        '<button data-toggle="collapse" class="btn collapse-btn" data-target="#team-' + team + '">Tím ' + teams[team] + '</button>' +
        '<div id="team-' + team + '" class="collapse collapse-team">';
    let t = getByTeam(team);
    t = t.sort(compare);
    t.forEach(function(p) {
        result += '' +
            '<p class="collapse-player">' +
                '<button type="button" class="btn btn-success add-btn" onclick="changeScore(' + p.id + ', 1);">+</button>' +
                '<button type="button" class="btn btn-danger remove-btn" onclick="changeScore(' + p.id + ', -1);">-</button>' +
                '<span id="player-stats-' + p.id + '">' + p.name + ' (' + p.score + ')</span>' +
            '</p>';
    });
    result += '</div></div>';
    main.html(main.html() + result);
}

function changeScore(id, inc) {
    console.log(id);
    let p = findByID(id);
    p.score += inc;
    $("button").attr("disabled", true);
    sendData({id: id, score: p.score}).then(function(res) {
        $("#player-stats-" + p.id).html(p.name + ' (' + p.score + ')');
        $("button").attr("disabled", false);
    });
}

function parseData(data) {
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
    createTeam(0);
    createTeam(1);
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

function sendData(data) {
    return fetch("http://www.martinusmaco.sk/24/post.php", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {'content-type': 'application/json'},
        mode: 'no-cors'
    }).then((res) => {return res;});
}