/** const abbredSongName = {
    "title": "Whole Name of Song",
    "offset": [xEndIndex, yEndIndex, [
        difficulty1,
        difficulty2,
        ...
    ]],
    "content": [
        [posX1, posY1, delay1],
        [posX2, posY2, delay2],
        [posX3, posY3, delay3],
        ...
    ]
} */
const star = {
    "title": "Twinkle Twinkle Little Star",
    "offset": {
        "board": {
            "endX": 7,
            "endY": 7,
            "cellSize": 50,
        },
        "song": {
            "bpm": 100,
            "startMargin": 3000,
        },
        "difficulty": [ "easy", "normal", "hard" ],
    },
    "content": [
        [3, 6, 1],
        [4, 6, 1],
        [4, 4, 1],
        [5, 4, 1],
        [5, 3, 1],
        [6, 3, 1],
        [6, 4, 2]
    ]
};