"use strict";
function main() {
    var mainMenu = document.getElementById('mainMenu');
    var content = document.getElementById('content');
    var chef = new Chef();
    var connectBtn = document.getElementById('connectBtn');
    var connected = false;
    var thingsLoaded = 0;
    var conn = null;
    var game = new Game();
    var fowCanvas = document.getElementById('fowCanvas');
    var drawCanvas = document.getElementById('drawCanvas');
    var minimapCanvas = document.getElementById('minimapCanvas');
    var ctrlDiv = document.getElementById('controlDiv');
    game.chef = chef;
    game.inputState = new UserInput.InputState();
    game.tileDrawer = new TileDrawer(drawCanvas, 'img/tileset.png', 'img/lttp-all.png');
    game.fowDrawer = new FOWDrawer(fowCanvas);
    game.selectionDrawer = new SelectionDrawer(drawCanvas);
    game.selectionBoxDrawer = new SelectionBoxDrawer(drawCanvas);
    game.minimapBoxDrawer = new MinimapBoxDrawer(minimapCanvas);
    game.statusBarDrawer = new StatusBarDrawer(drawCanvas);
    game.commandPanel = commands(game);
    var spritemap = new SpriteMap(spriteRefs(game.teamColors));
    spritemap.onload = function (e) {
        game.unitDrawer = new UnitDrawer(drawCanvas, spritemap);
        game.minimapDrawer = new MinimapDrawer(minimapCanvas, spritemap);
        game.buildPlacementDrawer = new BuildPlacementDrawer(drawCanvas, spritemap);
        mainMenu.appendChild(spritemap.spriteSheet);
    };
    connectBtn.onclick = function () {
        var nameFieldValue = document.getElementById('nameField').value;
        var passFieldValue = document.getElementById('passField').value;
        var addrFieldValue = document.getElementById('addrField').value;
        var portFieldValue = document.getElementById('portField').value;
        console.log('Attempting connection...');
        if (addrFieldValue === "localhost") {
            conn = new WebSocket('wss://localhost:' + portFieldValue);
        }
        else {
            conn = new WebSocket('wss://[' + addrFieldValue + ']:' + portFieldValue);
        }
        conn.binaryType = "arraybuffer";
        game.connection = conn;
        conn.onclose = function () {
            console.log('Connection closed.');
            mainMenu.hidden = false;
            content.hidden = true;
            game.connected = false;
            game.reset();
        };
        conn.onmessage = function (event) {
            Decoding.processPacket(game, new Cereal(new DataView(event.data)));
        };
        conn.onopen = function () {
            console.log('Connection open.');
            mainMenu.hidden = true;
            content.hidden = false;
            conn.send(nameFieldValue);
            conn.send(passFieldValue);
            chef.putU8(Interaction.Core.ServerMessage.MapInfoRequest);
            chef.putU32(game.orderID++);
            conn.send(chef.done());
            chef.putU8(Interaction.Core.ServerMessage.UnitInfoRequest);
            chef.putU32(game.orderID++);
            conn.send(chef.done());
            chef.putU8(Interaction.Core.ServerMessage.MissileInfoRequest);
            chef.putU32(game.orderID++);
            conn.send(chef.done());
            game.connected = true;
            game.inputState.addListener(minimapCanvas, Interaction.Minimap.interact(game));
            game.inputState.addListener(ctrlDiv, Interaction.Core.interact(game));
            playGame(game);
        };
        conn.onerror = function () {
            console.log('Connection Error.');
            mainMenu.hidden = false;
            content.hidden = true;
            game.connected = false;
            game.reset();
        };
    };
}
;
function playGame(game) {
    function draw() {
        if (game.connected) {
            game.draw();
            requestAnimationFrame(draw);
        }
    }
    draw();
}
function commands(game) {
    var cmdDiv = document.getElementById('commandDiv');
    var cmds = new CommandPanel(cmdDiv, game.commandPanelHandler());
    cmds.addCommand("attack", { src: "img/attack.png", tooltip: "[A] Attack" });
    cmds.addCommand("move", { src: "img/move.png", tooltip: "[M] Move" });
    cmds.addCommand("stop", { src: "img/stop.png", tooltip: "[S] Stop" });
    cmds.addCommand("build", { src: "img/build.png", tooltip: "[B] Build" });
    return cmds;
}
function spriteRefs(colors) {
    var tc_imgs = [
        "img/basic_missile.png",
        "img/platform1.png",
        "img/platform2.png",
        "img/extractor_blade1.png",
        "img/artillery_wpn1.png",
        "img/artillery_wpn2.png",
        "img/factory.png",
        "img/missile1.png",
        "img/basic_unit.png",
        "img/basic_wpn.png",
        "img/fast1.png",
        "img/fast_wpn1.png",
        "img/fast_msl1.png",
        "img/fighter1.png",
        "img/bomber1.png",
        "img/minimap_unit.png"
    ];
    var list = new Array();
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        for (var n = 0; n < tc_imgs.length; n++) {
            var src = tc_imgs[n];
            var ref = color.name + '/' + src;
            list.push({ src: src, ref: ref, color: color });
        }
    }
    list.push({
        src: "img/Prime_deposit.png",
        ref: "prime_node",
        color: new TeamColor(),
    });
    return list;
}
main();
