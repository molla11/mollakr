const exps = [ 
    150380155, 149778175, 149177815, 148579295, 147982095, 147207841, 146614241, 146021961, 145431301, 144842481, 144079121, 143493381, 142909481, 142327201, 141746241, 140691842, 140114482, 139538442, 138964022, 138391222, 137648974, 137079474, 136511594, 135945334, 135380614, 134648584, 134087244, 133527224, 132968824, 132412044, 131401107, 130847627, 130295767, 129745227, 129196307, 128484817, 127938977, 127394757, 126852157, 126310877, 125609319, 125071419, 124534839, 123999879, 123466539, 122014124, 121483864, 120955224, 120427904, 119902204, 119220900, 118698280, 118177280, 117657900, 117139840, 116468468, 115953788, 115440428, 114928688, 114418568, 113492152, 112984892, 112479252, 111974932, 111472232, 110820828, 110321208, 109822988, 109326388, 108831108, 108189350, 107696930, 107206130, 106716950, 106229090, 105343733, 104859033, 104375653, 103893893, 103413533, 102790781, 102313501, 101837321, 101362761, 100889821, 100276429, 99806349, 99337889, 98870529, 98404789, 97136322, 96673442, 96212182, 95752022, 95293482, 94699200, 94243520, 93789240, 93336280, 92884940, 92300018, 91851538, 91404458, 90958998, 90514638, 89708451, 89266951, 88826851, 88388371, 87950991, 87384503, 86949983, 86517083, 86085583, 85655183, 85097769, 84670229, 84244089, 83819569, 83396149, 82628073, 82207513, 81788353, 81370293, 80953853, 80414301, 80000501, 79588321, 79177241, 78767561, 78236797, 77829977, 77424557, 77020237, 76617317, 75520348, 75120288, 74721628, 74324068, 73927908, 73414330, 73021030, 72629130, 72238330, 71848930, 71344140, 70957380, 70571720, 70187460, 69804300, 69109497, 68729497, 68350597, 67973097, 67596697, 67109197, 66735437, 66363077, 65992117, 65622257, 65143259, 64776039, 64410219, 64045499, 63682179, 63022538, 62661638, 62301838, 61943438, 61586438, 61123768, 60769408, 60416148, 60064288, 59713528, 59259074, 58910734, 58563794, 58217954, 57873514, 56935595, 56593575, 56252955, 55913435, 55575315, 55136903, 54801203, 54466603, 54133403, 53801083, 53370887, 53041207, 52712707, 52385307, 52059307, 51467589, 51144009, 50821529, 50500229, 50180029, 49765589, 49447809, 49131429, 48816449, 48502349, 48095839, 47784159, 47473879, 47164479, 46856479, 46297521, 45991941, 45687461, 45384161, 45081961, 44690635, 44390855, 44092255, 43794535, 43498215, 43114143, 42820243, 42527223, 42235603, 41944863, 41153545, 40865225, 40577785, 40291745, 40006585, 39637411, 39354671, 39073111, 38792431, 38513151, 38151231, 37874151, 37598171, 37323371, 37049451, 36665577, 36455607, 36246557, 36038187, 35830737, 35562157, 35356577, 35151677, 34947457, 34744327, 34481142, 34279712, 34078962, 33879132, 33679982, 33319203, 33121923, 32925563, 32729883, 32535123, 32282819, 32089519, 31897139, 31705439, 31514659, 31267529, 31078449, 30890049, 30702569, 30515769, 30007661, 29822561, 29638141, 29454641, 29271821, 29035351, 28854231, 28674031, 28494511, 28315671, 28084375, 27907235, 27731015, 27555475, 27380855, 27063975, 26890645, 26718235, 26546505, 26375695, 26154526, 25985416, 25816816, 25648896, 25481896, 25265680, 25100210, 24935420, 24771550, 24608360, 24312282, 24150622, 23989642, 23829582, 23670032, 23463501, 23305651, 23148311, 22991891, 22836151, 22634352, 22480142, 22326612, 22173832, 22021732, 21607891, 21457321, 21307431, 21158291, 21009831, 20817496, 20670566, 20524146, 20378646, 20233826, 20046223, 19902933, 19760153, 19618293, 19476943, 19220614, 19080794, 18941484, 18803094, 18665214, 18486854, 18350504, 18214834, 18079674, 17945264, 17771415, 17638535, 17506165, 17374475, 17243535, 17006152, 16876502, 16747602, 16619212, 16491742, 16326694, 16200344, 16074914, 15949994, 15825584, 15664826, 15541946, 15419576, 15297956, 15176846, 14847608, 14728028, 14608958, 14490638, 14372828, 14220338, 14104058, 13988288, 13873028, 13758518, 13610318, 13496928, 13384288, 13272158, 13160538, 12958755, 12848665, 12739085, 12630255, 12521935, 12381782, 12274822, 12168372, 12062432, 11957242, 11821158, 11717088, 11613768, 11510958, 11408658, 11223528, 11122418, 11021818, 10921968, 10822628, 10694149, 10596169, 10498699, 10401739, 10305529, 10180898, 10085638, 9991128, 9897128, 9803638, 9549338, 9457038, 9365248, 9273968, 9183438, 9066191, 8976611, 8887781, 8799461, 8711481, 8598082, 8511462, 8425182, 8339412, 8254392, 8100274, 8016204, 7932884, 7849904, 7767434, 7661198, 7579918, 7499148, 7418888, 7339208, 7236287, 7157557, 7079577, 7001937, 6924807, 6785049, 6709109, 6633679, 6558589, 6484249, 6388049, 6314659, 6241609, 6169139, 6097179, 6004073, 5933063, 5862633, 5792713, 5723133, 5534108, 5465718, 5397668, 5330128, 5263168, 5176562, 5110552, 5044882, 4979792, 4915212, 4831700, 4767900, 4704850, 4642140, 4579770, 4466875, 4405695, 4344855, 4284355, 4224195, 4146962, 4087992, 4029362, 3971072, 3913532, 3839172, 3782412, 3725992, 3670152, 3614652, 3544109, 3505769, 3467849, 3430169, 3392729, 3344369, 3307469, 3270989, 3234749, 3198749, 3152261, 3116981, 3081941, 3047141, 3012581, 2918887, 2885047, 2851447, 2818087, 2784967, 2742457, 2710057, 2677897, 2645977, 2614297, 2573659, 2542699, 2511979, 2481499, 2451439, 2396948, 2367308, 2337908, 2308748, 2280008, 2242958, 2214758, 2186678, 2158838, 2131418, 2096084, 2069084, 2042324, 2015804, 1989704, 1942420, 1916740, 1891300, 1866100, 1841020, 1808962, 1784602, 1760362, 1736362, 1712602, 1682104, 1658944, 1636024, 1613224, 1590664, 1529403, 1507443, 1485723, 1464123, 1442763, 1415151, 1394391, 1373751, 1353351, 1333191, 1307139, 1287399, 1267959, 1248759, 1229679, 1195172, 1176512, 1157972, 1139852, 1121852, 1098764, 1081184, 1063844, 1046624, 1029524, 1007840, 991340, 974960, 958820, 942800, 913862, 898442, 883142, 867962, 853022, 833756, 819116, 804716, 790616, 776636, 758618, 745058, 731618, 718298, 705098, 669390, 656790, 644310, 631950, 619710, 603954, 592134, 580434, 569034, 557754, 543246, 532266, 521406, 510666, 500046, 480936, 470916, 461016, 451236, 441576, 429174, 419814, 410574, 401454, 392454, 381144, 372624, 364224, 355944, 347784, 332933, 324953, 317093, 309353, 301733, 292217, 285077, 278057, 271157, 264377, 255563, 248963, 242483, 236123, 229883, 212848, 206968, 201208, 195568, 190048, 182872, 177532, 172312, 167212, 162112, 155638, 150838, 146038, 141538, 137158, 129186, 124986, 120906, 116826, 112866, 107874, 104094, 100434, 96894, 93354, 88908, 85548, 82488, 79428, 76488, 71137, 68377, 65737, 63097, 60577, 57301, 54961, 52621, 50281, 48061, 45175, 43135, 41095, 39175, 37255, 32013, 30453, 28893, 27453, 26013, 24141, 22881, 21621, 20361, 19221, 17739, 16659, 15699, 14739, 13779, 12032, 11252, 10472, 9692, 8912, 8054, 7454, 6854, 6254, 5774, 5150, 4730, 4310, 3890, 3470, 2706, 2466, 2226, 1986, 1746, 1434, 1254, 1074, 894, 714, 480, 360, 240, 120, 0
];

const inputTargetExp = document.getElementById("input-target-exp");
const inputTargetIsLevel = document.getElementById("input-target-isLevel");
const inputNowExp = document.getElementById("input-now-exp");
const inputNJ = document.getElementById("input-NJ"); // NJ: 낱장.

inputTargetExp.addEventListener("input", f_calculate);
inputTargetIsLevel.addEventListener("click", handleBtnIsLevel);
inputTargetIsLevel.addEventListener("click", f_calculate);
inputNowExp.addEventListener("input", f_calculate);
inputNJ.addEventListener("input", f_calculate);

let isLevel = false;

function handleBtnIsLevel() {
    if (isLevel) {
        inputTargetExp.placeholder = "목표 경험치";
        inputTargetIsLevel.innerText = "레벨로 입력하기"
        inputTargetExp.value = "";
        isLevel = false;
        inputTargetExp.focus();
    } else {
        inputTargetExp.placeholder = "목표 레벨";
        inputTargetIsLevel.innerText = "경험치로 입력하기"
        inputTargetExp.value = "";
        isLevel = true;
        inputTargetExp.focus();
    }
}

function f_calculate() {
    let inputs = f_setInput();
    f_printInput(inputs);
    f_printResult(f_setOutput(inputs), inputs);
}

function f_setInput() {
    const inputList = {
        nowExp:f_checkInput(inputNowExp.value),
        targetExp:isLevel?
            inputTargetExp.value === ""?
                0
                :f_checkInput(exps[720-f_checkInput(inputTargetExp.value)])
            :f_checkInput(inputTargetExp.value),
        NJ:f_checkInput(inputNJ.value),
    }

    function f_checkInput(a_value) {
        if(a_value === "") {
            return 0;
        } else if (parseInt(a_value) > 9999999999 || parseInt(a_value) < 0) {
            return NaN;
        } else {
            return parseInt(a_value);
        }
    }

    return inputList;
}

function f_printInput(a_inputs) {
    const prtTargetExp = document.getElementById("target-exp");
    const prtNowExp = document.getElementById("now-exp");
    const prtNJ = document.getElementById("NJ");

    prtNowExp.innerText = f_checkStatus(a_inputs.nowExp);
    prtTargetExp.innerText = f_checkStatus(a_inputs.targetExp);
    prtNJ.innerText = f_checkStatus(a_inputs.NJ);

    function f_checkStatus(a_value) {
        if (isNaN(a_value)) {
            return "Strange number!";
        } else {
            return a_value;
        }
    }
}

function f_setOutput(a_inputs) {
    const outputList = {
        nowLevel:f_setLevel(a_inputs.nowExp),
        targetLevel:f_setLevel(a_inputs.targetExp),
        expPerNJ:Math.floor((Math.sqrt(a_inputs.nowExp*8+1)+1)/2),
        needExp:a_inputs.targetExp-a_inputs.nowExp,  
    };
    outputList.needNJ = Math.ceil((1 - 2 * outputList.expPerNJ + Math.sqrt(8 * outputList.needExp + 4 * (outputList.expPerNJ ** 2 - outputList.expPerNJ) + 1)) / 2) - a_inputs.NJ; 
    outputList.needPing = outputList.needNJ*10;

    function f_setLevel(a_exp) {
        if(isNaN(a_exp)) { return NaN; }

        exps.push(a_exp);
        exps.sort(function(a,b) { return a<b?1:a>b?-1:0; }); //descending order.
        index = exps.indexOf(a_exp);
        exps.splice(index, 1);
        return 720 - index;
    }

    return outputList;
}

function f_printResult(a_outputs, a_inputs) {
    const prtNowLevel = document.getElementById("now-level");
    const prtTargetLevel = document.getElementById("target-level");
    const prtexpPerNJ = document.getElementById("exp-per-NJ");
    const prtNeedExp = document.getElementById("need-exp");
    const prtNeedNJ = document.getElementById("need-NJ");
    const prtNeedPing = document.getElementById("need-ping");

    prtNowLevel.innerText = f_checkValueIsNaN(a_outputs.nowLevel);
    prtTargetLevel.innerText = f_checkValueIsNaN(a_outputs.targetLevel);
    prtexpPerNJ.innerText = f_checkValueIsNaN(a_outputs.expPerNJ);
    prtNeedExp.innerText = f_checkValueIsNaN(a_outputs.needExp);
    prtNeedNJ.innerText = f_checkValueIsNaN(a_outputs.needNJ);
    prtNeedPing.innerText = f_checkValueIsNaN(a_outputs.needPing);

    function f_checkValueIsNaN(a_value) {
        if (isNaN(a_inputs.nowExp) || isNaN(a_inputs.targetExp) || isNaN(a_inputs.NJ)) {
            return NaN;
        } else if(a_outputs.needExp < 0) {
            return ("Target "+(isLevel?"level":"exp")+" is too small.");
        } else {
            return a_value;
        }
    }
}

window.addEventListener("copy", (copy) => {
    copy.preventDefault();
    const isCopy = {
        targetExp:document.getElementById("target-exp-isCopy").checked,
        nowExp:document.getElementById("now-exp-isCopy").checked,
        NJ:document.getElementById("NJ-isCopy").checked,
        targetLevel:document.getElementById("target-level-isCopy").checked,
        nowLevel:document.getElementById("now-level-isCopy").checked,
        expPerNJ:document.getElementById("exp-per-NJ-isCopy").checked,
        needExp:document.getElementById("need-exp-isCopy").checked,
        needNJ:document.getElementById("need-NJ-isCopy").checked,
        needPing:document.getElementById("need-ping-isCopy").checked,
    };

    if (!isCopy.targetExp && !isCopy.nowExp && !isCopy.NJ && !isCopy.targetLevel && !isCopy.nowLevel && !isCopy.expPerNJ && !isCopy.needExp && !isCopy.needNJ && !isCopy.needPing) {
        copy.clipboardData.setData("text", "https://molla.kr/kkutu/");
        window.alert("복사할 대상이 없습니다!\n대신 이 계산기 링크를 복사했어요.");
        return;
    }

    const inputs = f_setInput();
    const outputs = f_setOutput(inputs);
    
    result = "낱장작 계산기 - https://molla.kr/r/calc/"
    + (isCopy.targetExp?    `\n목표 경험치:\t${inputs.targetExp}`:"")
    + (isCopy.nowExp?       `\n현재 경험치:\t${inputs.nowExp}`:"")
    + (isCopy.NJ?           `\n보유 낱장:  \t${inputs.NJ}`:"")
    + (isCopy.targetLevel?  `\n목표 레벨:  \t${outputs.targetLevel}`:"")
    + (isCopy.nowLevel?     `\n현재 레벨:  \t${outputs.nowLevel}`:"")
    + (isCopy.expPerNJ?     `\n경험치/낱장:\t${outputs.expPerNJ}`:"")
    + (isCopy.needExp?      `\n필요 경험치:\t${outputs.needExp}`:"")
    + (isCopy.needNJ?       `\n필요한 낱장:\t${outputs.needNJ}`:"")
    + (isCopy.needPing?     `\n필요한 핑:  \t${outputs.needPing}`:"");
    copy.clipboardData.setData("text", result);
    f_notice("복사 완료!");
});

function f_notice(msg) {
    noticeMsg = document.getElementById("noticeMsg");
    noticeMsg.innerText = msg;
    noticeMsg.style.opacity = 1;
    setTimeout(() => noticeMsg.style.opacity = 0, 1000);
}