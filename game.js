enchant();

window.onload = preloadAssets;
/* 定数の宣言 */
/* ゲーム画面の大きさ */
const GAME_X = 320;
const GAME_Y = 352;
/* ブロックサイズ */
const SIZE_X = 16;
const SIZE_Y = 16;
/* マップのサイズ */
const MAP_WIDTH = 10;
const MAP_HEIGHT = 20;
/* マップの位置 */
const OFFSET_X = 16;
const OFFSET_Y = 16;
/* FramePerSeconds */
const FPS = 24;
/* ブロックの種類の数 */
const MAX_BLOCKS_TYPE = 1;

/* 変数の宣言 */
/* ゲーム */
var game;
/* 各シーン */
var scene_background;
var scene_game;
var scene_start;
/* フレームカウンター */
var frame_counter = 0;
/* ブロックの種類 */
var blocks;
/* ブロックの種類 */
var block_type;
/* ブロック */
var block;
/* 表示するブロックの配列 */
var display_block;
/* ブロックを作るかどうかのフラグ */
var flag_create_block = 1;
/* 動かしているブロックの位置 */
var pos_x;
var pos_y;
/* 動かす前のブロックの位置 */
var pre_pos_x;
var pre_pos_y;
/* マップ */
var map;

function preloadAssets() {
    game = new Game(GAME_X, GAME_Y);
    game.fps = FPS;
    game.preload('chara1.gif', 'map2.gif', 'icon0.png', 'jump.wav', 'gameover.wav');
    game.onload = init;
    game.start();
}

function init() {
    /* 各シーンの作成 */
    createBackGroundScene();
    createGameScene();
    createStartScene();

    /* マップの作成 */
    createMap();

    /* 表示するブロックの初期化 */
    initDisplayBlock();
    /*
    display_block = new Array();
    for(var i; i<MAP_WIDTH*MAP_HEIGHT; i++) {
        display_block[i] = new Sprite(SIZE_X, SIZE_Y);
        display_block[i].image = game.assets['map2.gif'];
        display_block[i].x = (i % MAP_WIDTH) * SIZE_X + OFFSET_X;
        display_block[i].y = Math.floor(i / MAP_WIDTH) * SIZE_Y + OFFSET_Y;
        display_block[i].frame = 11;
        scene_game.addChild(display_block[i]);
    }
    */

    /* ブロックの種類の作成 */
    createBlocks();

    /* シーンのプッシュ */
    game.pushScene(scene_start);

    /* スタート画面 */
    scene_start.addEventListener('enterframe', StartMenu);

    /* ゲーム画面 */
    scene_game.addEventListener('enterframe', main);
}

function main() {
    // ゲーム本体
    checkState(frame_counter);
    update_display(frame_counter);
    rotate(frame_counter);
    moveX(frame_counter);
    moveY(frame_counter);

    frame_counter++;
    if(frame_counter == FPS) {
        frame_counter = 0;
    }
}
/* 現在の状態をチェックする関数 */
function checkState(frame_counter) {
    // 落ちているブロックが接地しているかのチェック->接地していればmapに反映&新しいブロックの作成及び配置
    if(check_block() == 1) {
        update_map();
        update_display();
        flag_create_block = 1;
    }
    if(flag_create_block == 1) {
        createBlock();
        flag_create_block = 0;
    }
    // ラインがそろっているかチェック
    // GameOverのチェック
}

function check_block() {
    // ブロックが設置しているかをチェックする。1ならば設置。
    if(pos_y == MAP_HEIGHT - 1) {
        return 1;
    }
    else {
        return 0;
    }
}

function update_map() {
    // ブロックが設置している場合mapとblockを合体(?)させる
    map[pos_x][pos_y] = 1;
}

function update_display(frame_counter) {
    // mapとblockの位置からディスプレイの更新
    scene_game.removeChild(display_block[pre_pos_y*MAP_WIDTH+pre_pos_x]);
    scene_game.addChild(display_block[pos_y*MAP_WIDTH+pos_x]);
    pre_pos_x = pos_x;
    pre_pos_y = pos_y;
    for(var x=0; x<MAP_WIDTH; x++) {
        for(var y=0; y<MAP_WIDTH; y++) {
            if(map[x][y] >　0 && map[x][y] < 10) {
                scene_game.addChild(display_block[y*MAP_WIDTH+x]);
                map[x][y] += 10;
            }
        }
    }
}

function rotate(frame_counter) {
    // blockの回転
}

function moveX(frame_counter) {
    // blockの横移動

    if(game.input.right) {
        if(pos_x < MAP_WIDTH - 1) {
            pos_x++;
        }
    }
    else if(game.input.left) {
        if(pos_x > 0) {
            pos_x--;
        }
    }
}

function moveY(frame_counter) {
    // blockの縦移動
    if(frame_counter == FPS - 1) {
        pos_y++;
    }
}

function StartMenu() {
    // StartMenuの設定
    // 難易度の設定など？
    if(game.input.right) {
        game.replaceScene(scene_game);
    }
}

function createBackGroundScene() {
    scene_background = game.rootScene;
    var map_back = new Map(16,16);
    map_back.image = game.assets['map2.gif'];
    map_back.loadData(
        [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ]
    );
    scene_background.addChild(map_back);
}

function createGameScene() {
    scene_game = new Scene();
}

function createStartScene() {
    scene_start = new Scene();
    scene_start.backgroundColor = 'rgb(255, 150, 0)';
}

function createBlocks() {
    // ブロックの種類の作成
    // blocks配列でいくつか用意
    blocks = [
        [
            [1, 1],
            [1, 1]
        ]
    ];
}

function initDisplayBlock() {
    display_block = new Array();
    for(var i=0; i<MAP_WIDTH*MAP_HEIGHT; i++) {
        display_block[i] = new Sprite(SIZE_X, SIZE_Y);
        display_block[i].image = game.assets['map2.gif'];
        display_block[i].x = (i % MAP_WIDTH) * SIZE_X + OFFSET_X;
        display_block[i].y = Math.floor(i / MAP_WIDTH) * SIZE_Y + OFFSET_Y;
        display_block[i].frame = 11;
        //scene_game.addChild(display_block[i]);
    }
}

function createBlock() {
    // ブロックの作成
    // blocks配列の中からランダムで選べばいい？
    block_type = Math.floor(Math.random()*0);
    block = blocks[block_type];
    if(block_type == 0) {
        pos_x = 4;
        pre_pos_x = 4;
    }
    pos_y = 0;
    pre_pos_y = 0;
    scene_game.addChild(display_block[pos_y*MAP_WIDTH+pos_x]);
}

function createMap() {
    // map配列の作成
    map = new Array(MAP_WIDTH);
    for(var i=0; i<MAP_WIDTH; i++) {
        map[i] = new Array(MAP_HEIGHT);
        for(var j=0; j<MAP_HEIGHT; j++) {
            map[i][j] = 0;
        }
    }
}
