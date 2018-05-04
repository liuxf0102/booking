let sendSysInfo= function() {
    let dayReview = new Map();
    let msg = {};
    msg.tip = "test";
    dayReview.set("xianfeng", msg);
    if (dayReview.get("xianfeng")) {
        msg.tip = "test1";
        dayReview.set("xianfeng", msg);
    }

    if (dayReview.get("xianfeng1")) {
        msg.tip = "test2";
        dayReview.set("xianfeng1", msg);
    }
    console.log(JSON.stringify([...dayReview]));
}
sendSysInfo();