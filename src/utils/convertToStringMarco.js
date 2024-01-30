import moment from "moment";

const { MARCO_LOTTERY_TYPE, MARCO_PRICE, MARCO_BAO_TYPE, MARCO_BAO, MARCO_PERIOD, PERIOD_TIME, BAN_VE, XSDT_TYPE, XSDT_SERIES_NUMBER, TU_CHON, XSDT_NUMBER, HOAN_TAT, XSDT_PRICE, XSDT_PERIOD, BAN_VE_BOTTOM, GUI_DI, KENO_ODD_ID, KENO_ODD_SYMBOL } = require("../constants/marcoSymbol");

//vietlott
export const convertToStringMarco = (ticketDetail) => {
    var typeSymbol = MARCO_LOTTERY_TYPE.find(o => o.key == ticketDetail?.lotteryType)?.value;
    // var priceSymbol = MARCO_PRICE.find(o => o.key == ticketDetail.ticketPrice)?.value;
    var result = typeSymbol;
    switch (ticketDetail.lotteryType) {
        case 5: //Keno
            if (KENO_ODD_ID.includes(ticketDetail.subType)) {
                var priceSymbol = '!';
                ticketDetail.lotteries.forEach(lottery => {
                    priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value
                    var lastCha = '';
                    lottery.code.forEach(c => {
                        var charOdd = KENO_ODD_SYMBOL.find(x => x.key == c).value;
                        result += 'f' + charOdd;
                        lastCha = charOdd;
                    });
                    priceSymbol = priceSymbol == '' ? '!' : priceSymbol;
                    if (lastCha[lastCha.length - 1] == '1' && priceSymbol == "!") {
                        priceSymbol += '!';
                    }
                    else if (lastCha[lastCha.length - 1] == '2' && priceSymbol == "@") {
                        priceSymbol += '@';
                    }
                    else if (lastCha[lastCha.length - 1] == '3' && priceSymbol == "#") {
                        priceSymbol += '#';
                    }
                    else if (lastCha[lastCha.length - 1] == '4' && priceSymbol == "$") {
                        priceSymbol += '$';
                    }
                    else if (lastCha[lastCha.length - 1] == '5' && priceSymbol == "%") {
                        priceSymbol += '%';
                    }
                    else if (lastCha[lastCha.length - 1] == '6' && priceSymbol == "^") {
                        priceSymbol += '^';
                    }
                    else if (lastCha[lastCha.length - 1] == '7' && priceSymbol == "&") {
                        priceSymbol += '&';
                    }
                    else if (lastCha[lastCha.length - 1] == '8' && priceSymbol == "*") {
                        priceSymbol += '*';
                    }
                    else if (lastCha[lastCha.length - 1] == '9' && priceSymbol == "(") {
                        priceSymbol += '('; x
                    }
                    result += priceSymbol;
                    if (lottery != ticketDetail.lotteries[ticketDetail.lotteries.length - 1]) {
                        result += "[";
                    }
                });
                if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                    var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                    result += periodSymbol;
                }
                result += "x";
            } else {
                var priceSymbol = '!';
                ticketDetail.lotteries.forEach(lottery => {
                    priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value
                    var lastCha = '';
                    lottery.code.forEach(c => {
                        result += c;
                        lastCha = c;
                    });
                    priceSymbol = priceSymbol == '' ? '!' : priceSymbol;
                    if (lastCha[lastCha.length - 1] == '1' && priceSymbol == "!") {
                        priceSymbol += '!';
                    }
                    else if (lastCha[lastCha.length - 1] == '2' && priceSymbol == "@") {
                        priceSymbol += '@';
                    }
                    else if (lastCha[lastCha.length - 1] == '3' && priceSymbol == "#") {
                        priceSymbol += '#';
                    }
                    else if (lastCha[lastCha.length - 1] == '4' && priceSymbol == "$") {
                        priceSymbol += '$';
                    }
                    else if (lastCha[lastCha.length - 1] == '5' && priceSymbol == "%") {
                        priceSymbol += '%';
                    }
                    else if (lastCha[lastCha.length - 1] == '6' && priceSymbol == "^") {
                        priceSymbol += '^';
                    }
                    else if (lastCha[lastCha.length - 1] == '7' && priceSymbol == "&") {
                        priceSymbol += '&';
                    }
                    else if (lastCha[lastCha.length - 1] == '8' && priceSymbol == "*") {
                        priceSymbol += '*';
                    }
                    else if (lastCha[lastCha.length - 1] == '9' && priceSymbol == "(") {
                        priceSymbol += '('; x
                    }
                    result += priceSymbol;
                    if (lottery != ticketDetail.lotteries[ticketDetail.lotteries.length - 1]) {
                        result += "[";
                    }
                });
                if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                    var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                    result += periodSymbol;
                }
                result += "x";
            }
            break;
        case 6: //Mega 6/45
            // var priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value;
            if (MARCO_BAO_TYPE.find(o => o.key == ticketDetail.subType)) {
                var lotteryLength = ticketDetail.lotteries[0].code.length;
                console.log(lotteryLength);
                var baoSymbol = "";
                if (MARCO_BAO.find(o => o.key == lotteryLength).other == true) {
                    baoSymbol = "L";
                    baoSymbol += MARCO_BAO.find(o => o.key == lotteryLength).value;
                } else {
                    baoSymbol = MARCO_BAO.find(o => o.key == lotteryLength).value;
                }
                result += baoSymbol;
            }
            ticketDetail.lotteries.forEach(lottery => {
                lottery.code.forEach(c => {
                    if (c == 0) c = "45";

                    result += c;
                });

            });
            if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                result += periodSymbol;
            } else {
                if (ticketDetail.periodTimes.length > 0) {
                    var periodSymbol = '';
                    var index = ticketDetail.periodTimes.map(x => moment(x).format("YYYY-MM-DD")).indexOf(moment(ticketDetail.periodTime).format("YYYY-MM-DD"));
                    if (index > 0) {
                        periodSymbol = PERIOD_TIME.find(o => o.key == index)?.value;
                        if (periodSymbol) {
                            result += periodSymbol;
                        }
                    }
                }
            }
            result += "x";
            break;
        case 7: //Power 6/55
            if (MARCO_BAO_TYPE.find(o => o.key == ticketDetail.subType)) {
                var lotteryLength = ticketDetail.lotteries[0].code.length;
                console.log(lotteryLength);
                var baoSymbol = "";
                if (MARCO_BAO.find(o => o.key == lotteryLength).other == true) {
                    baoSymbol = "L";
                    baoSymbol += MARCO_BAO.find(o => o.key == lotteryLength).value;
                } else {
                    baoSymbol = MARCO_BAO.find(o => o.key == lotteryLength).value;
                }
                result += baoSymbol;
            }
            ticketDetail.lotteries.forEach(lottery => {
                lottery.code.forEach(c => {
                    if (c == 0) c = "45";

                    result += c;
                });

            });
            if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                result += periodSymbol;
            } else {
                if (ticketDetail.periodTimes.length > 0) {
                    var periodSymbol = '';
                    var index = ticketDetail.periodTimes.map(x => moment(x).format("YYYY-MM-DD")).indexOf(moment(ticketDetail.periodTime).format("YYYY-MM-DD"));
                    if (index > 0) {
                        periodSymbol = PERIOD_TIME.find(o => o.key == index)?.value;
                        if (periodSymbol) {
                            result += periodSymbol;
                        }
                    }
                }
            }
            result += "x";
            break;
        case 8: //MAX3D
            var priceSymbol = '!';
            ticketDetail.lotteries.forEach(lottery => {
                priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value
                var lastCha = '';
                lottery.code.forEach(c => {
                    result += c;
                    lastCha = c;
                });
                priceSymbol = priceSymbol == '' ? '!' : priceSymbol;
                console.log("P", priceSymbol);
                console.log("C", lastCha);
                if (lastCha[lastCha.length - 1] == '1' && priceSymbol == "!") {
                    priceSymbol += '!';
                }
                else if (lastCha[lastCha.length - 1] == '2' && priceSymbol == "@") {
                    priceSymbol += '@';
                }
                else if (lastCha[lastCha.length - 1] == '3' && priceSymbol == "#") {
                    priceSymbol += '#';
                }
                else if (lastCha[lastCha.length - 1] == '4' && priceSymbol == "$") {
                    priceSymbol += '$';
                }
                else if (lastCha[lastCha.length - 1] == '5' && priceSymbol == "%") {
                    priceSymbol += '%';
                }
                else if (lastCha[lastCha.length - 1] == '6' && priceSymbol == "^") {
                    priceSymbol += '^';
                }
                else if (lastCha[lastCha.length - 1] == '7' && priceSymbol == "&") {
                    priceSymbol += '&';
                }
                else if (lastCha[lastCha.length - 1] == '8' && priceSymbol == "*") {
                    priceSymbol += '*';
                }
                else if (lastCha[lastCha.length - 1] == '9' && priceSymbol == "(") {
                    priceSymbol += '('; x
                }
                result += priceSymbol;
                if (lottery != ticketDetail.lotteries[ticketDetail.lotteries.length - 1]) {
                    result += "[";
                }
            });
            if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                result += periodSymbol;
            } else {
                if (ticketDetail.periodTimes.length > 0) {
                    var periodSymbol = '';
                    var index = ticketDetail.periodTimes.map(x => moment(x).format("YYYY-MM-DD")).indexOf(moment(ticketDetail.periodTime).format("YYYY-MM-DD"));
                    if (index > 0) {
                        periodSymbol = PERIOD_TIME.find(o => o.key == index)?.value;
                        if (periodSymbol) {
                            result += periodSymbol;
                        }
                    }
                }
            }
            result += "x";
            break;
        case 9: //MAX3D PRO
            var priceSymbol = '!';
            ticketDetail.lotteries.forEach(lottery => {
                priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value;
                var lastCha = '';
                lottery.code.forEach(c => {
                    result += c;
                    lastCha = c;
                });
                priceSymbol = priceSymbol == '' ? '!' : priceSymbol;
                if (lastCha[lastCha.length - 1] == '1' && priceSymbol == "!") {
                    priceSymbol += '!';
                }
                else if (lastCha[lastCha.length - 1] == '2' && priceSymbol == "@") {
                    priceSymbol += '@';
                }
                else if (lastCha[lastCha.length - 1] == '3' && priceSymbol == "#") {
                    priceSymbol += '#';
                }
                else if (lastCha[lastCha.length - 1] == '4' && priceSymbol == "$") {
                    priceSymbol += '$';
                }
                else if (lastCha[lastCha.length - 1] == '5' && priceSymbol == "%") {
                    priceSymbol += '%';
                }
                else if (lastCha[lastCha.length - 1] == '6' && priceSymbol == "^") {
                    priceSymbol += '^';
                }
                else if (lastCha[lastCha.length - 1] == '7' && priceSymbol == "&") {
                    priceSymbol += '&';
                }
                else if (lastCha[lastCha.length - 1] == '8' && priceSymbol == "*") {
                    priceSymbol += '*';
                }
                else if (lastCha[lastCha.length - 1] == '9' && priceSymbol == "(") {
                    priceSymbol += '('; x
                }
                result += priceSymbol;
                if (lottery != ticketDetail.lotteries[ticketDetail.lotteries.length - 1]) {
                    result += "[";
                }
                console.log("PRICE", priceSymbol ? priceSymbol : '!');
            });
            if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                result += periodSymbol;
            } else {
                if (ticketDetail.periodTimes.length > 0) {
                    var periodSymbol = '';
                    var index = ticketDetail.periodTimes.map(x => moment(x).format("YYYY-MM-DD")).indexOf(moment(ticketDetail.periodTime).format("YYYY-MM-DD"));
                    if (index > 0) {
                        periodSymbol = PERIOD_TIME.find(o => o.key == index)?.value;
                        if (periodSymbol) {
                            result += periodSymbol;
                        }
                    }
                }
            }
            result += "x";
            break;
        case 14: //MAX3D+
            var priceSymbol = '!';
            ticketDetail.lotteries.forEach(lottery => {
                priceSymbol = MARCO_PRICE.find(o => o.key == lottery.price)?.value;
                var lastCha = '';
                lottery.code.forEach(c => {
                    result += c;
                    lastCha = c;
                });
                priceSymbol = priceSymbol == '' ? '!' : priceSymbol;
                if (lastCha[lastCha.length - 1] == '1' && priceSymbol == "!") {
                    priceSymbol += '!';
                }
                else if (lastCha[lastCha.length - 1] == '2' && priceSymbol == "@") {
                    priceSymbol += '@';
                }
                else if (lastCha[lastCha.length - 1] == '3' && priceSymbol == "#") {
                    priceSymbol += '#';
                }
                else if (lastCha[lastCha.length - 1] == '4' && priceSymbol == "$") {
                    priceSymbol += '$';
                }
                else if (lastCha[lastCha.length - 1] == '5' && priceSymbol == "%") {
                    priceSymbol += '%';
                }
                else if (lastCha[lastCha.length - 1] == '6' && priceSymbol == "^") {
                    priceSymbol += '^';
                }
                else if (lastCha[lastCha.length - 1] == '7' && priceSymbol == "&") {
                    priceSymbol += '&';
                }
                else if (lastCha[lastCha.length - 1] == '8' && priceSymbol == "*") {
                    priceSymbol += '*';
                }
                else if (lastCha[lastCha.length - 1] == '9' && priceSymbol == "(") {
                    priceSymbol += '('; x
                }
                result += priceSymbol;
                if (lottery != ticketDetail.lotteries[ticketDetail.lotteries.length - 1]) {
                    result += "[";
                }
                console.log("PRICE", priceSymbol ? priceSymbol : '!');
            });
            if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
                var periodSymbol = MARCO_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
                result += periodSymbol;
            } else {
                if (ticketDetail.periodTimes.length > 0) {
                    var periodSymbol = '';
                    var index = ticketDetail.periodTimes.map(x => moment(x).format("YYYY-MM-DD")).indexOf(moment(ticketDetail.periodTime).format("YYYY-MM-DD"));
                    if (index > 0) {
                        periodSymbol = PERIOD_TIME.find(o => o.key == index)?.value;
                        if (periodSymbol) {
                            result += periodSymbol;
                        }
                    }
                }
            }
            result += "x";
            break;
        default:

    }
    console.log("IN123", result);
    return result;
}

//xsdt

//TODO: chọn kỳ
export const convertToXSDTMacro = (ticketDetail) => {
    var result = '';
    result += XSDT_TYPE.find(o => o.key == ticketDetail.lotteryType)?.value;
    var price = ticketDetail.lotteries[0].price;
    //chọn giá vé
    result += XSDT_PRICE.find(o => o.key == price)?.value;
    //chọn kỳ
    if (ticketDetail?.period_batch && ticketDetail?.period_batch != "0") {
        var periodSymbol = XSDT_PERIOD.find(o => o.key == ticketDetail?.period_batch).value;
        result += periodSymbol;
    } else {
        result += XSDT_PERIOD.find(o => o.key == 1).value;
    }
    //chọn số chuỗi số - số vé
    // result += XSDT_SERIES_NUMBER.find(o => o.key == ticketDetail.lotteryType) ? XSDT_SERIES_NUMBER.find(o => o.key == ticketDetail.lotteryType)?.value : "";
    var numberTicket = ticketDetail.lotteries.length;
    result += XSDT_SERIES_NUMBER.find(o => o.key == numberTicket)?.value;

    //bấm tự chọn
    result += TU_CHON;

    //chọn số
    ticketDetail.lotteries.forEach(lottery => {
        lottery.code.forEach(c => {
            if (c.length == 1) {
                result += XSDT_NUMBER.find(o => o.key == c)?.value;
            } else if (c.length == 2) {
                result += XSDT_NUMBER.find(o => o.key == c[0])?.value;
                result += XSDT_NUMBER.find(o => o.key == c[1])?.value;
            } else if (c.length == 3) {
                result += XSDT_NUMBER.find(o => o.key == c[0])?.value;
                result += XSDT_NUMBER.find(o => o.key == c[1])?.value;
                result += XSDT_NUMBER.find(o => o.key == c[2])?.value;
            }
        })
    });

    //bấm hoàn tất
    result += HOAN_TAT;

    //gửi đi
    result += GUI_DI;

    result += BAN_VE_BOTTOM;
    console.log("IN XSDT", result);
    return result;
}