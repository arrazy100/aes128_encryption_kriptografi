var delay_time = 0;
var loop_delay = 0;

function hex_to_decimal(hex_string) {
    let dec = parseInt(hex_string, 16);

    return dec;
}

function decimal_to_hex(dec) {
    let hex = dec.toString(16);

    return hex;
}

function string_to_hex(str) {
    let hex = "";

    for (let i = 0; i < str.length; i++) {
        let ascii = str[i].charCodeAt();
        hex = hex + decimal_to_hex(ascii);
    }

    return hex;
}

function hex_to_string(hex) {
    let str = "";

    for (let i = 0; i < 32; i += 2) {
        let hex_block = hex[i] + hex[i + 1];
        let dec = hex_to_decimal(hex_block);
        str += String.fromCharCode(dec);
    }

    return str;
}

function encode_hex(hex) {
    let encoded = btoa(hex);

    return encoded;
}

function decode_hex(encoded) {
    let decoded = atob(encoded);

    return decoded;
}

function hex_to_array(hex) {
    let arr = [];

    for (let i = 0; i < hex.length - 1; i += 2) {
        arr.push(hex[i] + hex[i + 1]);
    }

    let arr2d = [];
    while (arr.length) arr2d.push(arr.splice(0, 4));

    arr2d = arr2d[0].map((col, i) => arr2d.map(row => row[i]));

    return arr2d;
}

function shift_array(arr, n) {
    let shifted = [];

    if (n === 0) return arr;

    for (let i = n; i < arr.length; i++) {
        shifted.push(arr[i]);
    }

    for (let i = 0; i < n; i++) {
        shifted.push(arr[i]);
    }

    return shifted;
}

function XOR(a_hex, b_hex) {
    let xor_result = hex_to_decimal(a_hex) ^ hex_to_decimal(b_hex);

    let xor_hex = decimal_to_hex(xor_result);
    if (xor_hex.length === 1) xor_hex = "0" + xor_hex;

    return xor_hex;
}

const rcon = [
    "01000000", 
    "02000000",
    "04000000",
    "08000000",
    "10000000",
    "20000000",
    "40000000",
    "80000000",
    "1B000000",
    "36000000"
];

const s_box = [
    ["63", "7c", "77", "7b", "f2", "6b", "6f", "c5", "30", "01", "67", "2b", "fe", "d7", "ab", "76"],
    ["ca", "82", "c9", "7d", "fa", "59", "47", "f0", "ad", "d4", "a2", "af", "9c", "a4", "72", "c0"],
    ["b7", "fd", "93", "26", "36", "3f", "f7", "cc", "34", "a5", "e5", "f1", "71", "d8", "31", "15"],
    ["04", "c7", "23", "c3", "18", "96", "05", "9a", "07", "12", "80", "e2", "eb", "27", "b2", "75"],
    ["09", "83", "2c", "1a", "1b", "6e", "5a", "a0", "52", "3b", "d6", "b3", "29", "e3", "2f", "84"],
    ["53", "d1", "00", "ed", "20", "fc", "b1", "5b", "6a", "cb", "be", "39", "4a", "4c", "58", "cf"],
    ["d0", "ef", "aa", "fb", "43", "4d", "33", "85", "45", "f9", "02", "7f", "50", "3c", "9f", "a8"],
    ["51", "a3", "40", "8f", "92", "9d", "38", "f5", "bc", "b6", "da", "21", "10", "ff", "f3", "d2"],
    ["cd", "0c", "13", "ec", "5f", "97", "44", "17", "c4", "a7", "7e", "3d", "64", "5d", "19", "73"],
    ["60", "81", "4f", "dc", "22", "2a", "90", "88", "46", "ee", "b8", "14", "de", "5e", "0b", "db"],
    ["e0", "32", "3a", "0a", "49", "06", "24", "5c", "c2", "d3", "ac", "62", "91", "95", "e4", "79"],
    ["e7", "c8", "37", "6d", "8d", "d5", "4e", "a9", "6c", "56", "f4", "ea", "65", "7a", "ae", "08"],
    ["ba", "78", "25", "2e", "1c", "a6", "b4", "c6", "e8", "dd", "74", "1f", "4b", "bd", "8b", "8a"],
    ["70", "3e", "b5", "66", "48", "03", "f6", "0e", "61", "35", "57", "b9", "86", "c1", "1d", "9e"],
    ["e1", "f8", "98", "11", "69", "d9", "8e", "94", "9b", "1e", "87", "e9", "ce", "55", "28", "df"],
    ["8c", "a1", "89", "0d", "bf", "e6", "42", "68", "41", "99", "2d", "0f", "b0", "54", "bb", "16"]
];

const inv_s_box = [
    ["52", "09", "6a", "d5", "30", "36", "a5", "38", "bf", "40", "a3", "9e", "81", "f3", "d7", "fb"],
    ["7c", "e3", "39", "82", "9b", "2f", "ff", "87", "34", "8e", "43", "44", "c4", "de", "e9", "cb"],
    ["54", "7b", "94", "32", "a6", "c2", "23", "3d", "ee", "4c", "95", "0b", "42", "fa", "c3", "4e"],
    ["08", "2e", "a1", "66", "28", "d9", "24", "b2", "76", "5b", "a2", "49", "6d", "8b", "d1", "25"],
    ["72", "f8", "f6", "64", "86", "68", "98", "16", "d4", "a4", "5c", "cc", "5d", "65", "b6", "92"],
    ["6c", "70", "48", "50", "fd", "ed", "b9", "da", "5e", "15", "46", "57", "a7", "8d", "9d", "84"],
    ["90", "d8", "ab", "00", "8c", "bc", "d3", "0a", "f7", "e4", "58", "05", "b8", "b3", "45", "06"],
    ["d0", "2c", "1e", "8f", "ca", "3f", "0f", "02", "c1", "af", "bd", "03", "01", "13", "8a", "6b"],
    ["3a", "91", "11", "41", "4f", "67", "dc", "ea", "97", "f2", "cf", "ce", "f0", "b4", "e6", "73"],
    ["96", "ac", "74", "22", "e7", "ad", "35", "85", "e2", "f9", "37", "e8", "1c", "75", "df", "6e"],
    ["47", "f1", "1a", "71", "1d", "29", "c5", "89", "6f", "b7", "62", "0e", "aa", "18", "be", "1b"],
    ["fc", "56", "3e", "4b", "c6", "d2", "79", "20", "9a", "db", "c0", "fe", "78", "cd", "5a", "f4"],
    ["1f", "dd", "a8", "33", "88", "07", "c7", "31", "b1", "12", "10", "59", "27", "80", "ec", "5f"],
    ["60", "51", "7f", "a9", "19", "b5", "4a", "0d", "2d", "e5", "7a", "9f", "93", "c9", "9c", "ef"],
    ["a0", "e0", "3b", "4d", "ae", "2a", "f5", "b0", "c8", "eb", "bb", "3c", "83", "53", "99", "61"],
    ["17", "2b", "04", "7e", "ba", "77", "d6", "26", "e1", "69", "14", "63", "55", "21", "0c", "7d"]
];

const multiply_2 = [
    0x00,0x02,0x04,0x06,0x08,0x0a,0x0c,0x0e,0x10,0x12,0x14,0x16,0x18,0x1a,0x1c,0x1e,
    0x20,0x22,0x24,0x26,0x28,0x2a,0x2c,0x2e,0x30,0x32,0x34,0x36,0x38,0x3a,0x3c,0x3e,
    0x40,0x42,0x44,0x46,0x48,0x4a,0x4c,0x4e,0x50,0x52,0x54,0x56,0x58,0x5a,0x5c,0x5e,
    0x60,0x62,0x64,0x66,0x68,0x6a,0x6c,0x6e,0x70,0x72,0x74,0x76,0x78,0x7a,0x7c,0x7e,
    0x80,0x82,0x84,0x86,0x88,0x8a,0x8c,0x8e,0x90,0x92,0x94,0x96,0x98,0x9a,0x9c,0x9e,
    0xa0,0xa2,0xa4,0xa6,0xa8,0xaa,0xac,0xae,0xb0,0xb2,0xb4,0xb6,0xb8,0xba,0xbc,0xbe,
    0xc0,0xc2,0xc4,0xc6,0xc8,0xca,0xcc,0xce,0xd0,0xd2,0xd4,0xd6,0xd8,0xda,0xdc,0xde,
    0xe0,0xe2,0xe4,0xe6,0xe8,0xea,0xec,0xee,0xf0,0xf2,0xf4,0xf6,0xf8,0xfa,0xfc,0xfe,
    0x1b,0x19,0x1f,0x1d,0x13,0x11,0x17,0x15,0x0b,0x09,0x0f,0x0d,0x03,0x01,0x07,0x05,
    0x3b,0x39,0x3f,0x3d,0x33,0x31,0x37,0x35,0x2b,0x29,0x2f,0x2d,0x23,0x21,0x27,0x25,
    0x5b,0x59,0x5f,0x5d,0x53,0x51,0x57,0x55,0x4b,0x49,0x4f,0x4d,0x43,0x41,0x47,0x45,
    0x7b,0x79,0x7f,0x7d,0x73,0x71,0x77,0x75,0x6b,0x69,0x6f,0x6d,0x63,0x61,0x67,0x65,
    0x9b,0x99,0x9f,0x9d,0x93,0x91,0x97,0x95,0x8b,0x89,0x8f,0x8d,0x83,0x81,0x87,0x85,
    0xbb,0xb9,0xbf,0xbd,0xb3,0xb1,0xb7,0xb5,0xab,0xa9,0xaf,0xad,0xa3,0xa1,0xa7,0xa5,
    0xdb,0xd9,0xdf,0xdd,0xd3,0xd1,0xd7,0xd5,0xcb,0xc9,0xcf,0xcd,0xc3,0xc1,0xc7,0xc5,
    0xfb,0xf9,0xff,0xfd,0xf3,0xf1,0xf7,0xf5,0xeb,0xe9,0xef,0xed,0xe3,0xe1,0xe7,0xe5
];

const multiply_3 = [
    0x00,0x03,0x06,0x05,0x0c,0x0f,0x0a,0x09,0x18,0x1b,0x1e,0x1d,0x14,0x17,0x12,0x11,
    0x30,0x33,0x36,0x35,0x3c,0x3f,0x3a,0x39,0x28,0x2b,0x2e,0x2d,0x24,0x27,0x22,0x21,
    0x60,0x63,0x66,0x65,0x6c,0x6f,0x6a,0x69,0x78,0x7b,0x7e,0x7d,0x74,0x77,0x72,0x71,
    0x50,0x53,0x56,0x55,0x5c,0x5f,0x5a,0x59,0x48,0x4b,0x4e,0x4d,0x44,0x47,0x42,0x41,
    0xc0,0xc3,0xc6,0xc5,0xcc,0xcf,0xca,0xc9,0xd8,0xdb,0xde,0xdd,0xd4,0xd7,0xd2,0xd1,
    0xf0,0xf3,0xf6,0xf5,0xfc,0xff,0xfa,0xf9,0xe8,0xeb,0xee,0xed,0xe4,0xe7,0xe2,0xe1,
    0xa0,0xa3,0xa6,0xa5,0xac,0xaf,0xaa,0xa9,0xb8,0xbb,0xbe,0xbd,0xb4,0xb7,0xb2,0xb1,
    0x90,0x93,0x96,0x95,0x9c,0x9f,0x9a,0x99,0x88,0x8b,0x8e,0x8d,0x84,0x87,0x82,0x81,
    0x9b,0x98,0x9d,0x9e,0x97,0x94,0x91,0x92,0x83,0x80,0x85,0x86,0x8f,0x8c,0x89,0x8a,
    0xab,0xa8,0xad,0xae,0xa7,0xa4,0xa1,0xa2,0xb3,0xb0,0xb5,0xb6,0xbf,0xbc,0xb9,0xba,
    0xfb,0xf8,0xfd,0xfe,0xf7,0xf4,0xf1,0xf2,0xe3,0xe0,0xe5,0xe6,0xef,0xec,0xe9,0xea,
    0xcb,0xc8,0xcd,0xce,0xc7,0xc4,0xc1,0xc2,0xd3,0xd0,0xd5,0xd6,0xdf,0xdc,0xd9,0xda,
    0x5b,0x58,0x5d,0x5e,0x57,0x54,0x51,0x52,0x43,0x40,0x45,0x46,0x4f,0x4c,0x49,0x4a,
    0x6b,0x68,0x6d,0x6e,0x67,0x64,0x61,0x62,0x73,0x70,0x75,0x76,0x7f,0x7c,0x79,0x7a,
    0x3b,0x38,0x3d,0x3e,0x37,0x34,0x31,0x32,0x23,0x20,0x25,0x26,0x2f,0x2c,0x29,0x2a,
    0x0b,0x08,0x0d,0x0e,0x07,0x04,0x01,0x02,0x13,0x10,0x15,0x16,0x1f,0x1c,0x19,0x1a
];

const multiply_9 = [
    0x00,0x09,0x12,0x1b,0x24,0x2d,0x36,0x3f,0x48,0x41,0x5a,0x53,0x6c,0x65,0x7e,0x77,
    0x90,0x99,0x82,0x8b,0xb4,0xbd,0xa6,0xaf,0xd8,0xd1,0xca,0xc3,0xfc,0xf5,0xee,0xe7,
    0x3b,0x32,0x29,0x20,0x1f,0x16,0x0d,0x04,0x73,0x7a,0x61,0x68,0x57,0x5e,0x45,0x4c,
    0xab,0xa2,0xb9,0xb0,0x8f,0x86,0x9d,0x94,0xe3,0xea,0xf1,0xf8,0xc7,0xce,0xd5,0xdc,
    0x76,0x7f,0x64,0x6d,0x52,0x5b,0x40,0x49,0x3e,0x37,0x2c,0x25,0x1a,0x13,0x08,0x01,
    0xe6,0xef,0xf4,0xfd,0xc2,0xcb,0xd0,0xd9,0xae,0xa7,0xbc,0xb5,0x8a,0x83,0x98,0x91,
    0x4d,0x44,0x5f,0x56,0x69,0x60,0x7b,0x72,0x05,0x0c,0x17,0x1e,0x21,0x28,0x33,0x3a,
    0xdd,0xd4,0xcf,0xc6,0xf9,0xf0,0xeb,0xe2,0x95,0x9c,0x87,0x8e,0xb1,0xb8,0xa3,0xaa,
    0xec,0xe5,0xfe,0xf7,0xc8,0xc1,0xda,0xd3,0xa4,0xad,0xb6,0xbf,0x80,0x89,0x92,0x9b,
    0x7c,0x75,0x6e,0x67,0x58,0x51,0x4a,0x43,0x34,0x3d,0x26,0x2f,0x10,0x19,0x02,0x0b,
    0xd7,0xde,0xc5,0xcc,0xf3,0xfa,0xe1,0xe8,0x9f,0x96,0x8d,0x84,0xbb,0xb2,0xa9,0xa0,
    0x47,0x4e,0x55,0x5c,0x63,0x6a,0x71,0x78,0x0f,0x06,0x1d,0x14,0x2b,0x22,0x39,0x30,
    0x9a,0x93,0x88,0x81,0xbe,0xb7,0xac,0xa5,0xd2,0xdb,0xc0,0xc9,0xf6,0xff,0xe4,0xed,
    0x0a,0x03,0x18,0x11,0x2e,0x27,0x3c,0x35,0x42,0x4b,0x50,0x59,0x66,0x6f,0x74,0x7d,
    0xa1,0xa8,0xb3,0xba,0x85,0x8c,0x97,0x9e,0xe9,0xe0,0xfb,0xf2,0xcd,0xc4,0xdf,0xd6,
    0x31,0x38,0x23,0x2a,0x15,0x1c,0x07,0x0e,0x79,0x70,0x6b,0x62,0x5d,0x54,0x4f,0x46
];

const multiply_11 = [
    0x00,0x0b,0x16,0x1d,0x2c,0x27,0x3a,0x31,0x58,0x53,0x4e,0x45,0x74,0x7f,0x62,0x69,
    0xb0,0xbb,0xa6,0xad,0x9c,0x97,0x8a,0x81,0xe8,0xe3,0xfe,0xf5,0xc4,0xcf,0xd2,0xd9,
    0x7b,0x70,0x6d,0x66,0x57,0x5c,0x41,0x4a,0x23,0x28,0x35,0x3e,0x0f,0x04,0x19,0x12,
    0xcb,0xc0,0xdd,0xd6,0xe7,0xec,0xf1,0xfa,0x93,0x98,0x85,0x8e,0xbf,0xb4,0xa9,0xa2,
    0xf6,0xfd,0xe0,0xeb,0xda,0xd1,0xcc,0xc7,0xae,0xa5,0xb8,0xb3,0x82,0x89,0x94,0x9f,
    0x46,0x4d,0x50,0x5b,0x6a,0x61,0x7c,0x77,0x1e,0x15,0x08,0x03,0x32,0x39,0x24,0x2f,
    0x8d,0x86,0x9b,0x90,0xa1,0xaa,0xb7,0xbc,0xd5,0xde,0xc3,0xc8,0xf9,0xf2,0xef,0xe4,
    0x3d,0x36,0x2b,0x20,0x11,0x1a,0x07,0x0c,0x65,0x6e,0x73,0x78,0x49,0x42,0x5f,0x54,
    0xf7,0xfc,0xe1,0xea,0xdb,0xd0,0xcd,0xc6,0xaf,0xa4,0xb9,0xb2,0x83,0x88,0x95,0x9e,
    0x47,0x4c,0x51,0x5a,0x6b,0x60,0x7d,0x76,0x1f,0x14,0x09,0x02,0x33,0x38,0x25,0x2e,
    0x8c,0x87,0x9a,0x91,0xa0,0xab,0xb6,0xbd,0xd4,0xdf,0xc2,0xc9,0xf8,0xf3,0xee,0xe5,
    0x3c,0x37,0x2a,0x21,0x10,0x1b,0x06,0x0d,0x64,0x6f,0x72,0x79,0x48,0x43,0x5e,0x55,
    0x01,0x0a,0x17,0x1c,0x2d,0x26,0x3b,0x30,0x59,0x52,0x4f,0x44,0x75,0x7e,0x63,0x68,
    0xb1,0xba,0xa7,0xac,0x9d,0x96,0x8b,0x80,0xe9,0xe2,0xff,0xf4,0xc5,0xce,0xd3,0xd8,
    0x7a,0x71,0x6c,0x67,0x56,0x5d,0x40,0x4b,0x22,0x29,0x34,0x3f,0x0e,0x05,0x18,0x13,
    0xca,0xc1,0xdc,0xd7,0xe6,0xed,0xf0,0xfb,0x92,0x99,0x84,0x8f,0xbe,0xb5,0xa8,0xa3
];

const multiply_13 = [
    0x00,0x0d,0x1a,0x17,0x34,0x39,0x2e,0x23,0x68,0x65,0x72,0x7f,0x5c,0x51,0x46,0x4b,
    0xd0,0xdd,0xca,0xc7,0xe4,0xe9,0xfe,0xf3,0xb8,0xb5,0xa2,0xaf,0x8c,0x81,0x96,0x9b,
    0xbb,0xb6,0xa1,0xac,0x8f,0x82,0x95,0x98,0xd3,0xde,0xc9,0xc4,0xe7,0xea,0xfd,0xf0,
    0x6b,0x66,0x71,0x7c,0x5f,0x52,0x45,0x48,0x03,0x0e,0x19,0x14,0x37,0x3a,0x2d,0x20,
    0x6d,0x60,0x77,0x7a,0x59,0x54,0x43,0x4e,0x05,0x08,0x1f,0x12,0x31,0x3c,0x2b,0x26,
    0xbd,0xb0,0xa7,0xaa,0x89,0x84,0x93,0x9e,0xd5,0xd8,0xcf,0xc2,0xe1,0xec,0xfb,0xf6,
    0xd6,0xdb,0xcc,0xc1,0xe2,0xef,0xf8,0xf5,0xbe,0xb3,0xa4,0xa9,0x8a,0x87,0x90,0x9d,
    0x06,0x0b,0x1c,0x11,0x32,0x3f,0x28,0x25,0x6e,0x63,0x74,0x79,0x5a,0x57,0x40,0x4d,
    0xda,0xd7,0xc0,0xcd,0xee,0xe3,0xf4,0xf9,0xb2,0xbf,0xa8,0xa5,0x86,0x8b,0x9c,0x91,
    0x0a,0x07,0x10,0x1d,0x3e,0x33,0x24,0x29,0x62,0x6f,0x78,0x75,0x56,0x5b,0x4c,0x41,
    0x61,0x6c,0x7b,0x76,0x55,0x58,0x4f,0x42,0x09,0x04,0x13,0x1e,0x3d,0x30,0x27,0x2a,
    0xb1,0xbc,0xab,0xa6,0x85,0x88,0x9f,0x92,0xd9,0xd4,0xc3,0xce,0xed,0xe0,0xf7,0xfa,
    0xb7,0xba,0xad,0xa0,0x83,0x8e,0x99,0x94,0xdf,0xd2,0xc5,0xc8,0xeb,0xe6,0xf1,0xfc,
    0x67,0x6a,0x7d,0x70,0x53,0x5e,0x49,0x44,0x0f,0x02,0x15,0x18,0x3b,0x36,0x21,0x2c,
    0x0c,0x01,0x16,0x1b,0x38,0x35,0x22,0x2f,0x64,0x69,0x7e,0x73,0x50,0x5d,0x4a,0x47,
    0xdc,0xd1,0xc6,0xcb,0xe8,0xe5,0xf2,0xff,0xb4,0xb9,0xae,0xa3,0x80,0x8d,0x9a,0x97
];

const multiply_14 = [
    0x00,0x0e,0x1c,0x12,0x38,0x36,0x24,0x2a,0x70,0x7e,0x6c,0x62,0x48,0x46,0x54,0x5a,
    0xe0,0xee,0xfc,0xf2,0xd8,0xd6,0xc4,0xca,0x90,0x9e,0x8c,0x82,0xa8,0xa6,0xb4,0xba,
    0xdb,0xd5,0xc7,0xc9,0xe3,0xed,0xff,0xf1,0xab,0xa5,0xb7,0xb9,0x93,0x9d,0x8f,0x81,
    0x3b,0x35,0x27,0x29,0x03,0x0d,0x1f,0x11,0x4b,0x45,0x57,0x59,0x73,0x7d,0x6f,0x61,
    0xad,0xa3,0xb1,0xbf,0x95,0x9b,0x89,0x87,0xdd,0xd3,0xc1,0xcf,0xe5,0xeb,0xf9,0xf7,
    0x4d,0x43,0x51,0x5f,0x75,0x7b,0x69,0x67,0x3d,0x33,0x21,0x2f,0x05,0x0b,0x19,0x17,
    0x76,0x78,0x6a,0x64,0x4e,0x40,0x52,0x5c,0x06,0x08,0x1a,0x14,0x3e,0x30,0x22,0x2c,
    0x96,0x98,0x8a,0x84,0xae,0xa0,0xb2,0xbc,0xe6,0xe8,0xfa,0xf4,0xde,0xd0,0xc2,0xcc,
    0x41,0x4f,0x5d,0x53,0x79,0x77,0x65,0x6b,0x31,0x3f,0x2d,0x23,0x09,0x07,0x15,0x1b,
    0xa1,0xaf,0xbd,0xb3,0x99,0x97,0x85,0x8b,0xd1,0xdf,0xcd,0xc3,0xe9,0xe7,0xf5,0xfb,
    0x9a,0x94,0x86,0x88,0xa2,0xac,0xbe,0xb0,0xea,0xe4,0xf6,0xf8,0xd2,0xdc,0xce,0xc0,
    0x7a,0x74,0x66,0x68,0x42,0x4c,0x5e,0x50,0x0a,0x04,0x16,0x18,0x32,0x3c,0x2e,0x20,
    0xec,0xe2,0xf0,0xfe,0xd4,0xda,0xc8,0xc6,0x9c,0x92,0x80,0x8e,0xa4,0xaa,0xb8,0xb6,
    0x0c,0x02,0x10,0x1e,0x34,0x3a,0x28,0x26,0x7c,0x72,0x60,0x6e,0x44,0x4a,0x58,0x56,
    0x37,0x39,0x2b,0x25,0x0f,0x01,0x13,0x1d,0x47,0x49,0x5b,0x55,0x7f,0x71,0x63,0x6d,
    0xd7,0xd9,0xcb,0xc5,0xef,0xe1,0xf3,0xfd,0xa7,0xa9,0xbb,0xb5,0x9f,0x91,0x83,0x8d
];

async function KeyScheduleToElement(parent, key_hex) {
    let rkey = new Array(11);
    rkey[0] = key_hex;

    let round_0 = drawListText(parent, "Round 0");
    round_0.scrollIntoView();

    await timer(delay_time);

    let rkey_round0 = drawcenterArray(parent, hex_to_array(rkey[0]), "Key Schedule Round 0");
    rkey_round0.scrollIntoView();

    await timer(delay_time);

    for (let round = 1; round <= 10; round++) {
        let rkey_before = rkey[round - 1];

        let round_i = drawListText(parent, "Round " + round);
        round_i.scrollIntoView();

        let last_col = rkey_before.substring(26, 32) + rkey_before.substring(24, 26);

        arrayWithTwoColumns(
            parent,
            "Ambil kolom terakhir Round " + (round - 1).toString(),
            "Pindahkan blok paling atas ke bawah",
            hex_to_array(rkey_before.substring(24, 32)),
            hex_to_array(last_col)
        );

        await timer(delay_time);

        let null_matrix = new Array(4);
        for (let i = 0; i < 4; i++) {
            null_matrix[i] = new Array(1);
            null_matrix[i][0] = 0;
        }

        let rkey_sbox = drawcenterArray(parent, null_matrix, "Substitusi S-Box");
        rkey_sbox.scrollIntoView();

        let rkey_sbox_result = drawCenterText(parent, "");
        
        let s_bytes = "";
        for (let i = 0; i < last_col.length; i += 2) {
            let row = hex_to_decimal(last_col[i]);
            let col = hex_to_decimal(last_col[i + 1]);

            let col_matrix = rkey_sbox.rows[Math.floor((i + 1 )/ 2)].cells;
            col_matrix[0].innerHTML = s_box[row][col];
            rkey_sbox_result.innerHTML = "Baris ke-" + row + " dan " + "Kolom ke-" + col + " = " + s_box[row][col];

            s_bytes += s_box[row][col];

            await timer(loop_delay);
        }

        let first_col = rkey_before.substring(0, 8);
        let current_rcon = rcon[round - 1];

        arrayWithThreeColumns(
            parent,
            "Sub Bytes",
            "Kolom Pertama Round " + (round - 1).toString(),
            "Rcon",
            hex_to_array(s_bytes),
            hex_to_array(first_col),
            hex_to_array(current_rcon)
        );

        drawCenterText(parent, "XOR hasil Sub Bytes dengan kolom pertama dan matriks rcon");

        await timer(delay_time);

        for (let i = 0; i < 4; i++) {
            null_matrix[i][0] = 0;
        }

        let xor_matrix = drawcenterArray(parent, null_matrix, "Hasil XOR");
        xor_matrix.scrollIntoView();

        let xor_matrix_result = drawCenterText(parent, "");

        let first_col_newround = "";
        for (let i = 0; i < 8; i += 2) {
            let xor_result = XOR(first_col[i] + first_col[i + 1], s_bytes[i] + s_bytes[i + 1]);
            xor_result = XOR(xor_result, current_rcon[i] + current_rcon[i + 1]);

            first_col_newround += xor_result;

            let col_matrix = xor_matrix.rows[Math.floor((i + 1 )/ 2)].cells;
            col_matrix[0].innerHTML = xor_result;
            xor_matrix_result.innerHTML = 
                "XOR dari " + s_bytes[i] + s_bytes[i + 1] +
                " dengan " + first_col[i] + first_col[i + 1] +
                " dan " + current_rcon[i] + current_rcon[i + 1] +
                " = " + xor_result;

            await timer(loop_delay);
        }

        drawCenterText(parent, "Hasil XOR digunakan sebagai kolom pertama Key Schedule baru");

        await timer(delay_time);

        drawcenterArray(parent, hex_to_array(rkey[round - 1]), "Key Schedule Round " + (round - 1).toString());

        let new_keyschedule = drawcenterArray(parent, generateNullMatrix(), "Key Schedule Baru");
        new_keyschedule.scrollIntoView();
        let col1_keyschedule = hex_to_array(first_col_newround);
        new_keyschedule.rows[0].cells[0].innerHTML = col1_keyschedule[0][0];
        new_keyschedule.rows[1].cells[0].innerHTML = col1_keyschedule[1][0];
        new_keyschedule.rows[2].cells[0].innerHTML = col1_keyschedule[2][0];
        new_keyschedule.rows[3].cells[0].innerHTML = col1_keyschedule[3][0];

        let second_col = rkey_before.substring(8, 16);
        let third_col = rkey_before.substring(16, 24);
        let fourth_col = rkey_before.substring(24, 32);
        let second_col_newround = "";
        let third_col_newround = "";
        let fourth_col_newround = "";

        let second_col_text = drawCenterText(parent, "");
        second_col_text.innerHTML = "XOR Col-1 Key Schedule dengan Col-2 Round " + (round - 1).toString() + " = Col-2 Key Schedule";
        let second_col_result = drawCenterText(parent, "");

        let third_col_text = drawCenterText(parent, "");
        third_col_text.innerHTML = "XOR Col-2 Key Schedule dengan Col-3 Round " + (round - 1).toString()  + " = Col-3 Key Schedule";
        let third_col_result = drawCenterText(parent, "");

        let fourth_col_text = drawCenterText(parent, "");
        fourth_col_text.innerHTML = "XOR Col-3 Key Schedule dengan Col-4 Round " + (round - 1).toString() + " = Col-4 Key Schedule";
        let fourth_col_result = drawCenterText(parent, "");

        for (let i = 0; i < 8; i += 2) {
            second_col_newround += XOR(first_col_newround[i] + first_col_newround[i + 1], second_col[i] + second_col[i + 1]);

            let col_matrix = new_keyschedule.rows[Math.floor((i + 1 )/ 2)].cells;
            col_matrix[1].innerHTML = XOR(first_col_newround[i] + first_col_newround[i + 1], second_col[i] + second_col[i + 1]);
            second_col_result.innerHTML = first_col_newround[i] + first_col_newround[i + 1] +
                                            " XOR " + second_col[i] + second_col[i + 1] +
                                            " = " + col_matrix[1].innerHTML;

            await timer(loop_delay);

            third_col_newround += XOR(second_col_newround[i] + second_col_newround[i + 1], third_col[i] + third_col[i + 1]);

            col_matrix = new_keyschedule.rows[Math.floor((i + 1 )/ 2)].cells;
            col_matrix[2].innerHTML = XOR(second_col_newround[i] + second_col_newround[i + 1], third_col[i] + third_col[i + 1]);
            third_col_result.innerHTML = second_col_newround[i] + second_col_newround[i + 1] +
                                            " XOR " + third_col[i] + third_col[i + 1] +
                                            " = " + col_matrix[2].innerHTML;

            await timer(loop_delay);

            fourth_col_newround += XOR(third_col_newround[i] + third_col_newround[i + 1], fourth_col[i] + fourth_col[i + 1]);

            col_matrix = new_keyschedule.rows[Math.floor((i + 1 )/ 2)].cells;
            col_matrix[3].innerHTML = XOR(third_col_newround[i] + third_col_newround[i + 1], fourth_col[i] + fourth_col[i + 1]);
            fourth_col_result.innerHTML = third_col_newround[i] + third_col_newround[i + 1] +
                                            " XOR " + fourth_col[i] + fourth_col[i + 1] +
                                            " = " + col_matrix[3].innerHTML;

            await timer(loop_delay);
        }

        rkey[round] = first_col_newround + second_col_newround + third_col_newround + fourth_col_newround;
    }

    for (let i = 0; i <= 10; i++) {
        rkey[i] = hex_to_array(rkey[i]);
    }

    return rkey;
}

async function SubBytesWithContext(parent, arr) {
    let s_bytes = new Array(4);
    for (let i = 0; i < 4; i++) {
        s_bytes[i] = new Array(4);
    }

    let sbox = drawcenterArray(parent, generateNullMatrix(), "Substitusi S-Box");
    sbox.scrollIntoView();

    let sbox_result = drawCenterText(parent, "");

    for (let i = 0; i < 4; i++) {
        let col_matrix = sbox.rows[i].cells;
        for (let j = 0; j < 4; j++) {
            let curr = arr[i][j];
            if (curr.length === 1) curr = "0" + curr;
            let row = hex_to_decimal(curr[0]);
            let col = hex_to_decimal(curr[1]);
            s_bytes[i][j] = s_box[row][col];

            col_matrix[j].innerHTML = s_box[row][col];
            sbox_result.innerHTML = "Baris ke-" + curr[0] + " dan " + "Kolom ke-" + curr[1] + " = " + s_box[row][col];

            await timer(loop_delay);
        }
    }

    return s_bytes;
}

async function InvSubBytesWithContext(parent, arr) {
    let s_bytes = new Array(4);
    for (let i = 0; i < 4; i++) {
        s_bytes[i] = new Array(4);
    }

    let sbox = drawcenterArray(parent, generateNullMatrix(), "Substitusi S-Box");
    sbox.scrollIntoView();

    let sbox_result = drawCenterText(parent, "");

    for (let i = 0; i < 4; i++) {
        let col_matrix = sbox.rows[i].cells;
        for (let j = 0; j < 4; j++) {
            let curr = arr[i][j];
            if (curr.length === 1) curr = "0" + curr;
            let row = hex_to_decimal(curr[0]);
            let col = hex_to_decimal(curr[1]);
            s_bytes[i][j] = inv_s_box[row][col];

            col_matrix[j].innerHTML = inv_s_box[row][col];
            sbox_result.innerHTML = "Baris ke-" + curr[0] + " dan " + "Kolom ke-" + curr[1] + " = " + inv_s_box[row][col];

            await timer(loop_delay);
        }
    }

    return s_bytes;
}

function ShiftRows(arr) {
    let shifted = arr;

    for (let i = 0; i < 4; i++) {
        shifted[i] = shift_array(arr[i], i);
    }

    return shifted;
}

function InvShiftRows(arr) {
    let shifted = arr;

    for (let i = 0; i < 4; i++) {
        shifted[i] = shift_array(arr[i], 4 - i);
    }

    return shifted;
}

async function MixColumnWithContext(parent, arr) {
    let mc = new Array(4);
    for (let i = 0; i < mc.length; i++) {
        mc[i] = new Array(4);
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            arr[i][j] = hex_to_decimal(arr[i][j]);
        }
    }

    let mix_column = drawcenterArray(parent, generateNullMatrix(), "Mix Column");
    mix_column.scrollIntoView();

    let d0_result = drawCenterText(parent, "");
    let d1_result = drawCenterText(parent, "");
    let d2_result = drawCenterText(parent, "");
    let d3_result = drawCenterText(parent, "");

    for (let i = 0; i < 4; i++) {
        mc[0][i] = multiply_2[arr[0][i]] ^ multiply_3[arr[1][i]] ^ arr[2][i] ^ arr[3][i]; // 2 3 1 1

        let col_matrix = mix_column.rows[0].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[0][i]);
        d0_result.innerHTML = "2 * " + decimal_to_hex(arr[0][i]) + " + 3 * " + decimal_to_hex(arr[1][i]) +
                                " + 1 * " + decimal_to_hex(arr[2][i]) + " + 1 * " + decimal_to_hex(arr[3][i])  + " = " + col_matrix[i].innerHTML;
        
        await timer(loop_delay);

        mc[1][i] = arr[0][i] ^ multiply_2[arr[1][i]] ^ multiply_3[arr[2][i]] ^ arr[3][i]; // 1 2 3 1

        col_matrix = mix_column.rows[1].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[1][i]);
        d1_result.innerHTML = "1 * " + decimal_to_hex(arr[0][i]) + " + 2 * " + decimal_to_hex(arr[1][i]) +
                                " + 3 * " + decimal_to_hex(arr[2][i]) + " + 1 * " + decimal_to_hex(arr[3][i])  + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);

        mc[2][i] = arr[0][i] ^ arr[1][i] ^ multiply_2[arr[2][i]] ^ multiply_3[arr[3][i]]; // 1 1 2 3

        col_matrix = mix_column.rows[2].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[2][i]);
        d2_result.innerHTML = "1 * " + decimal_to_hex(arr[0][i]) + " + 1 * " + decimal_to_hex(arr[1][i]) +
                                " + 2 * " + decimal_to_hex(arr[2][i]) + " + 3 * " + decimal_to_hex(arr[3][i]) + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);

        mc[3][i] = multiply_3[arr[0][i]] ^ arr[1][i] ^ arr[2][i] ^ multiply_2[arr[3][i]]; // 3 1 1 2

        col_matrix = mix_column.rows[3].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[3][i]);
        d3_result.innerHTML = "3 * " + decimal_to_hex(arr[0][i]) + " + 1 * " + decimal_to_hex(arr[1][i]) +
                                " + 1 * " + decimal_to_hex(arr[2][i] + " + 2 * " + decimal_to_hex(arr[3][i])) + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);
    }

    for (let i = 0; i < 4; i++) {
        mc[0][i] = decimal_to_hex(mc[0][i]);
        mc[1][i] = decimal_to_hex(mc[1][i]);
        mc[2][i] = decimal_to_hex(mc[2][i]);
        mc[3][i] = decimal_to_hex(mc[3][i]);
    }

    return mc;
}

async function InvMixColumnWithContext(parent, arr) {
    let mc = new Array(4);
    for (let i = 0; i < mc.length; i++) {
        mc[i] = new Array(4);
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            arr[i][j] = hex_to_decimal(arr[i][j]);
        }
    }

    let mix_column = drawcenterArray(parent, generateNullMatrix(), "Mix Column");
    mix_column.scrollIntoView();

    let d0_result = drawCenterText(parent, "");
    let d1_result = drawCenterText(parent, "");
    let d2_result = drawCenterText(parent, "");
    let d3_result = drawCenterText(parent, "");

    for (let i = 0; i < 4; i++) {
        mc[0][i] = multiply_14[arr[0][i]] ^ multiply_11[arr[1][i]] ^ multiply_13[arr[2][i]] ^ multiply_9[arr[3][i]]; // 14 11 13 9

        let col_matrix = mix_column.rows[0].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[0][i]);
        d0_result.innerHTML = "14 * " + decimal_to_hex(arr[0][i]) + " + 11 * " + decimal_to_hex(arr[1][i]) +
                                " + 13 * " + decimal_to_hex(arr[2][i] + " + 9 * " + decimal_to_hex(arr[3][i]))  + " = " + col_matrix[i].innerHTML;
        
        await timer(loop_delay);

        mc[1][i] = multiply_9[arr[0][i]] ^ multiply_14[arr[1][i]] ^ multiply_11[arr[2][i]] ^ multiply_13[arr[3][i]]; // 9 14 11 13

        col_matrix = mix_column.rows[1].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[1][i]);
        d1_result.innerHTML = "9 * " + decimal_to_hex(arr[0][i]) + " + 14 * " + decimal_to_hex(arr[1][i]) +
                                " + 11 * " + decimal_to_hex(arr[2][i] + " + 13 * " + decimal_to_hex(arr[3][i]))  + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);

        mc[2][i] = multiply_13[arr[0][i]] ^ multiply_9[arr[1][i]] ^ multiply_14[arr[2][i]] ^ multiply_11[arr[3][i]]; // 13 9 14 11

        col_matrix = mix_column.rows[2].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[2][i]);
        d2_result.innerHTML = "13 * " + decimal_to_hex(arr[0][i]) + " + 9 * " + decimal_to_hex(arr[1][i]) +
                                " + 14 * " + decimal_to_hex(arr[2][i] + " + 11 * " + decimal_to_hex(arr[3][i])) + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);

        mc[3][i] = multiply_11[arr[0][i]] ^ multiply_13[arr[1][i]] ^ multiply_9[arr[2][i]] ^ multiply_14[arr[3][i]]; // 11 13 9 14

        col_matrix = mix_column.rows[3].cells;
        col_matrix[i].innerHTML = decimal_to_hex(mc[3][i]);
        d3_result.innerHTML = "11 * " + decimal_to_hex(arr[0][i]) + " + 13 * " + decimal_to_hex(arr[1][i]) +
                                " + 9 * " + decimal_to_hex(arr[2][i] + " + 14 * " + decimal_to_hex(arr[3][i])) + " = " + col_matrix[i].innerHTML;

        await timer(loop_delay);
    }

    for (let i = 0; i < 4; i++) {
        mc[0][i] = decimal_to_hex(mc[0][i]);
        mc[1][i] = decimal_to_hex(mc[1][i]);
        mc[2][i] = decimal_to_hex(mc[2][i]);
        mc[3][i] = decimal_to_hex(mc[3][i]);
    }

    return mc;
}

function AddRoundKey(plaintext_array, key_array) {
    let rc = plaintext_array;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            rc[i][j] = XOR(plaintext_array[i][j], key_array[i][j]);
        }
    }

    return rc;
}

async function AddRoundKeyWithContext(table, context, plaintext_array, key_array) {
    let rc = new Array(4);
    for (let i = 0; i < rc.length; i++) {
        rc[i] = new Array(4);
    }

    for (let i = 0; i < 4; i++) {
        let col = table.rows[i].cells;
        for (let j = 0; j < 4; j++) {
            rc[i][j] = XOR(plaintext_array[i][j], key_array[i][j]);

            col[j].innerHTML = rc[i][j];
            context.innerHTML = plaintext_array[i][j] + " XOR " + key_array[i][j] + " = " + rc[i][j];

            await timer(loop_delay);
        }
    }

    return rc;
}

function allTables() {
    let tables = newStep("List of Tables");
    tables.scrollIntoView();

    drawListText(tables.getAttribute("id"), "Tabel S-Box");
    drawImage("ListofTables", "img/s-box.png");

    drawListText(tables.getAttribute("id"), "Tabel Inverse S-Box");
    drawImage("ListofTables", "img/inverse_s-box.png");

    drawListText(tables.getAttribute("id"), "Multiply 2");
    drawImage("ListofTables", "img/multiply_2.png");

    drawListText(tables.getAttribute("id"), "Multiply 3");
    drawImage("ListofTables", "img/multiply_3.png");

    drawListText(tables.getAttribute("id"), "Multiply 9");
    drawImage("ListofTables", "img/multiply_9.png");

    drawListText(tables.getAttribute("id"), "Multiply 11");
    drawImage("ListofTables", "img/multiply_11.png");

    drawListText(tables.getAttribute("id"), "Multiply 13");
    drawImage("ListofTables", "img/multiply_13.png");

    drawListText(tables.getAttribute("id"), "Multiply 14");
    drawImage("ListofTables", "img/multiply_14.png");
    
}

async function AESEncryption(plaintext_id, key_id, error_id) {
    if (!validateForm(plaintext_id, key_id)) {
        document.getElementById("" + error_id).innerHTML = "Plain text atau key kurang dari 16 karakter";
        setTimeout(function() {
            clearError(error_id);
        }, 2000);
        return;
    }

    removeAllStep();

    allTables();

    delay_time = 2000;
    loop_delay = 1000;

    document.getElementById("footer_btn").style.display = "block";

    let plaintext = document.getElementById("" + plaintext_id).value;
    let key = document.getElementById("" + key_id).value;

    let plaintext_hex = string_to_hex(plaintext);
    let key_hex = string_to_hex(key);

    let plaintext_array = hex_to_array(plaintext_hex);
    let key_array = hex_to_array(key_hex);

    // Key Scheduling
    let rkey_step = newStep("Key Scheduling");
    rkey_step.scrollIntoView();

    let rkey = await KeyScheduleToElement("KeyScheduling", key_hex);

    // Round 0
    let round_0 = newStep("Round 0");
    round_0.scrollIntoView();

    drawText("Round0", "Plain Text");
    drawText("Round0", plaintext);
    drawText("Round0", "Key");
    drawText("Round0", key);

    await timer(delay_time);

    let konversihex_text = drawListText("Round0", "Lakukan konversi plain text dan key menjadi hexadecimal");
    konversihex_text.scrollIntoView();

    drawText("Round0", "Plain Text Hex");
    drawText("Round0", formatHexToString(plaintext_hex));
    drawText("Round0", "Key Hex");
    drawText("Round0", formatHexToString(key_hex));

    await timer(delay_time);

    let round0_addroundkey_text = drawListText("Round0", "Operasi AddRoundKey, lakukan XOR terhadap setiap blok matriks plain text dengan key");
    round0_addroundkey_text.scrollIntoView();
    
    arrayWithTwoColumnsXOR("Round0", "Plain Text Matrix", "Key Matrix", plaintext_array, key_array);

    await timer(delay_time);

    // Add Round Key
    let rc_result = drawcenterArray("Round0", generateNullMatrix(), "Hasil Operasi AddRoundKey");
    rc_result.scrollIntoView();

    let rc_context = drawCenterText("Round0", "");

    let rc = await AddRoundKeyWithContext(rc_result, rc_context, plaintext_array, key_array);
    
    // Round 1 - 9
    for (let i = 1; i < 10; i++) {
        // Round ke-i
        let round_i = newStep("Round " + i);
        round_i.scrollIntoView();

        let sbytes_text = drawListText("Round" + i.toString(), "Operasi Sub Bytes, Substitusi setiap blok matriks dengan tabel S-Box");
        sbytes_text.scrollIntoView();
        let sbytes = await SubBytesWithContext(round_i.getAttribute("id"), rc);

        await timer(delay_time);

        let shift_rows_text = drawListText("Round" + i.toString(), "Operasi Shift Rows, Geser baris pertama matriks sebanyak 0 kali, " +
                                            "Geser baris kedua matriks sebanyak 1 kali, " +
                                            "Geser baris ketiga matriks sebanyak 2 kali, " +
                                            "Geser baris keempat matriks sebanyak 3 kali, ");
        shift_rows_text.scrollIntoView();
        let shift_rows_before = drawcenterArray("Round" + i.toString(), sbytes, "Sebelum pergeseran");
        await timer(delay_time);
        shift_rows_before.scrollIntoView();
        let shift_rows = ShiftRows(sbytes);
        let shift_rows_after = drawcenterArray("Round" + i.toString(), sbytes, "Hasil Shift Rows");
        shift_rows_after.scrollIntoView();
        await timer(delay_time);

        let mix_column_text = drawListText("Round" + i.toString(), "Operasi Mix Column, Lakukan perkalian matriks dengan matriks rijndael dengan bantuan tabel pre-calculated multiply 2 dan 3");
        mix_column_text.scrollIntoView();
        await timer(delay_time);
        let rijndael = [
            [2, 3, 1, 1],
            [1, 2, 3, 1],
            [1, 1, 2, 3],
            [3, 1, 1, 2]
        ];
        arrayWithTwoColumns("Round" + i.toString(), "Hasil Shift Rows", "Matriks Rijndael", shift_rows, rijndael);
        let mix_column = await MixColumnWithContext("Round" + i.toString(), shift_rows);

        await timer(delay_time);

        let round_i_addroundkey_text = drawListText("Round" + i.toString(), "Operasi AddRoundKey, lakukan XOR terhadap setiap blok matriks hasil mix column dengan key schedule round " + i.toString());
        round_i_addroundkey_text.scrollIntoView();
        
        arrayWithTwoColumnsXOR("Round" + i.toString(), "Hasil Mix Column", "Key Schedule Round " + i.toString(), mix_column, rkey[i]);

        await timer(delay_time);

        let rc_result = drawcenterArray("Round" + i.toString(), generateNullMatrix(), "Hasil Operasi AddRoundKey");
        rc_result.scrollIntoView();
        let rc_context = drawCenterText("Round" + i.toString(), "");
        rc = await AddRoundKeyWithContext(rc_result, rc_context, mix_column, rkey[i]);
    }

    // Round 10
    let round10 = newStep("Round 10");
    round10.scrollIntoView();

    let sbytes_text = drawListText("Round10", "Operasi Sub Bytes, Substitusi setiap blok matriks dengan tabel S-Box");
    sbytes_text.scrollIntoView();
    let sbytes = await SubBytesWithContext("Round10", rc);

    await timer(delay_time);

    let shift_rows_text = drawListText("Round10", "Operasi Shift Rows, Geser baris pertama matriks sebanyak 0 kali, " +
                                            "Geser baris kedua matriks sebanyak 1 kali, " +
                                            "Geser baris ketiga matriks sebanyak 2 kali, " +
                                            "Geser baris keempat matriks sebanyak 3 kali, ");
    shift_rows_text.scrollIntoView();
    let shift_rows_before = drawcenterArray("Round10", sbytes, "Sebelum pergeseran");
    await timer(delay_time);
    shift_rows_before.scrollIntoView();
    let shift_rows = ShiftRows(sbytes);
    let shift_rows_after = drawcenterArray("Round10", sbytes, "Hasil Shift Rows");
    shift_rows_after.scrollIntoView();
    await timer(delay_time);

    let round10_addroundkey_text = drawListText("Round10", "Operasi AddRoundKey, lakukan XOR terhadap setiap blok matriks hasil shift row dengan key schedule round 10");
    round10_addroundkey_text.scrollIntoView();
    
    arrayWithTwoColumnsXOR("Round10", "Hasil Shift Row", "Key Schedule Round 10", shift_rows, rkey[10]);

    rc_result = drawcenterArray("Round10", generateNullMatrix(), "Hasil Operasi AddRoundKey");
    rc_result.scrollIntoView();
    rc_context = drawCenterText("Round10", "");
    rc = await AddRoundKeyWithContext(rc_result, rc_context, shift_rows, rkey[10]);

    let output = "";
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            output += rc[j][i];
        }
    }

    let final_result = drawListText("Round10", "Hasil akhir");
    final_result.scrollIntoView();
    drawcenterArray("Round10", hex_to_array(output), "Hasil Akhir");

    await timer(delay_time);

    let final_hex = drawText("Round10", "Hasil Akhir Hexadecimal :");
    final_hex.scrollIntoView();
    drawText("Round10", formatHexToString(output));

    await timer(delay_time);

    let encoding_final = drawText("Round10", "Hasil Encoding: ");
    encoding_final.scrollIntoView();
    drawText("Round10", encode_hex(output));

    document.getElementById("aes_encryption").value = encode_hex(output);
}

async function AESDecryption(encrypted_id, key_id, error_id) {
    if (!validateDecryptionForm(key_id)) {
        document.getElementById("" + error_id).innerHTML = "Decryption key kurang dari 16 karakter";
        setTimeout(function() {
            clearError(error_id);
        }, 2000);
        return;
    }

    removeAllStep();

    allTables();

    delay_time = 2000;
    loop_delay = 1000;

    document.getElementById("footer_btn").style.display = "block";

    let plaintext = document.getElementById("" + encrypted_id).value;
    let key = document.getElementById("" + key_id).value;

    let plaintext_hex = decode_hex(plaintext);
    let key_hex = string_to_hex(key);

    let plaintext_array = hex_to_array(plaintext_hex);
    let key_array = hex_to_array(key_hex);

    // Key Scheduling
    let rkey_step = newStep("Key Scheduling");
    rkey_step.scrollIntoView();

    let rkey = await KeyScheduleToElement("KeyScheduling", key_hex);

    // Round 10
    let round10 = newStep("Round 10");
    round10.scrollIntoView();

    drawText("Round10", "Encrypted Text");
    drawText("Round10", plaintext);
    drawText("Round10", "Key");
    drawText("Round10", key);

    await timer(delay_time);

    let konversihex_text = drawListText("Round10", "Lakukan decoding encrypted text, kemudian konversi hasil decoding encrypted text dan key menjadi hexadecimal");
    konversihex_text.scrollIntoView();

    drawText("Round10", "Encrypted Text Hex (Hasil Decoding)");
    drawText("Round10", formatHexToString(plaintext_hex));
    drawText("Round10", "Key Hex");
    drawText("Round10", formatHexToString(key_hex));

    await timer(delay_time);

    let round10_addroundkey_text = drawListText("Round10", "Operasi AddRoundKey, lakukan XOR terhadap setiap blok matriks encrypted text dengan key schedule round 10");
    round10_addroundkey_text.scrollIntoView();
    
    arrayWithTwoColumnsXOR("Round10", "Encrypted Text", "Key Schedule Round 10", plaintext_array, rkey[10]);

    let rc_result = drawcenterArray("Round10", generateNullMatrix(), "Hasil Operasi AddRoundKey");
    rc_result.scrollIntoView();
    let rc_context = drawCenterText("Round10", "");
    let rc = await AddRoundKeyWithContext(rc_result, rc_context, plaintext_array, rkey[10]);

    let shift_rows_text = drawListText("Round10", "Operasi Inverse Shift Rows, Geser baris pertama matriks sebanyak 4 kali, " +
                                            "Geser baris kedua matriks sebanyak 3 kali, " +
                                            "Geser baris ketiga matriks sebanyak 2 kali, " +
                                            "Geser baris keempat matriks sebanyak 1 kali, ");
    shift_rows_text.scrollIntoView();
    let shift_rows_before = drawcenterArray("Round10", rc, "Sebelum pergeseran");
    await timer(delay_time);
    shift_rows_before.scrollIntoView();
    let shift_rows = InvShiftRows(rc);
    let shift_rows_after = drawcenterArray("Round10", rc, "Hasil Shift Rows");
    shift_rows_after.scrollIntoView();
    await timer(delay_time);

    let sbytes_text = drawListText("Round10", "Operasi Sub Bytes, Substitusi setiap blok matriks dengan tabel S-Box");
    sbytes_text.scrollIntoView();
    let sbytes = await InvSubBytesWithContext("Round10", shift_rows);

    await timer(delay_time);

    // Round 9 - 1
    for (let i = 9; i > 0; i--) {
        // Round ke-i
        let round_i = newStep("Round " + i);
        round_i.scrollIntoView();

        arrayWithTwoColumnsXOR("Round" + i.toString(), "Hasil Sub Bytes", "Key Schedule Round " + i.toString(), sbytes, rkey[i]);
        let rc_result = drawcenterArray("Round" + i.toString(), generateNullMatrix(), "Hasil Operasi AddRoundKey");
        rc_result.scrollIntoView();
        let rc_context = drawCenterText("Round" + i.toString(), "");
        let rc = await AddRoundKeyWithContext(rc_result, rc_context, sbytes, rkey[i]);

        await timer(delay_time);

        let mix_column_text = drawListText("Round" + i.toString(), "Operasi Mix Column, Lakukan perkalian matriks dengan matriks rijndael dengan bantuan tabel pre-calculated multiply 2 dan 3");
        mix_column_text.scrollIntoView();
        await timer(delay_time);
        let rijndael = [
            [14, 11, 13, 9],
            [9, 14, 11, 13],
            [13, 9, 14, 11],
            [11, 13, 9, 14]
        ];
        arrayWithTwoColumns("Round" + i.toString(), "Hasil Add Round Key", "Matriks Rijndael", rc, rijndael);
        let mix_column = await InvMixColumnWithContext("Round" + i.toString(), rc);

        await timer(delay_time);

        let shift_rows_text = drawListText("Round" + i.toString(), "Operasi Shift Rows, Geser baris pertama matriks sebanyak 0 kali, " +
                                            "Geser baris kedua matriks sebanyak 1 kali, " +
                                            "Geser baris ketiga matriks sebanyak 2 kali, " +
                                            "Geser baris keempat matriks sebanyak 3 kali, ");
        shift_rows_text.scrollIntoView();
        let shift_rows_before = drawcenterArray("Round" + i.toString(), mix_column, "Sebelum pergeseran");
        await timer(delay_time);
        shift_rows_before.scrollIntoView();
        let shift_rows = InvShiftRows(mix_column);
        let shift_rows_after = drawcenterArray("Round" + i.toString(), shift_rows, "Hasil Shift Rows");
        shift_rows_after.scrollIntoView();

        await timer(delay_time);
        
        let sbytes_text = drawListText("Round" + i.toString(), "Operasi Sub Bytes, Substitusi setiap blok matriks dengan tabel S-Box");
        sbytes_text.scrollIntoView();
        sbytes = await InvSubBytesWithContext(round_i.getAttribute("id"), shift_rows);

        await timer(delay_time);
    }

    // Round 0
    let round_0 = newStep("Round 0");
    round_0.scrollIntoView();

    let round0_addroundkey_text = drawListText("Round0", "Operasi AddRoundKey, lakukan XOR terhadap setiap blok matriks hasil Sub Bytes dengan key");
    round0_addroundkey_text.scrollIntoView();
    
    arrayWithTwoColumnsXOR("Round0", "Sub Bytes Matrix", "Key Matrix", sbytes, key_array);

    await timer(delay_time);

    // Add Round Key
    rc_result = drawcenterArray("Round0", generateNullMatrix(), "Hasil Operasi AddRoundKey");
    rc_result.scrollIntoView();

    rc_context = drawCenterText("Round0", "");

    rc = await AddRoundKeyWithContext(rc_result, rc_context, sbytes, key_array);

    let output = "";
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            output += rc[j][i];
        }
    }

    let final_result = drawListText("Round0", "Hasil akhir");
    final_result.scrollIntoView();
    drawcenterArray("Round0", hex_to_array(output), "Hasil Akhir");

    await timer(delay_time);

    let final_hex = drawText("Round0", "Hasil Akhir Hexadecimal :");
    final_hex.scrollIntoView();
    drawText("Round0", formatHexToString(output));

    await timer(delay_time);

    let encoding_final = drawText("Round0", "Hasil Dekripsi: ");
    encoding_final.scrollIntoView();
    drawText("Round0", hex_to_string(output));

    document.getElementById("aes_decryption").value = hex_to_string(output);
}