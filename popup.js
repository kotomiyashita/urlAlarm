"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const alarmForm = document.getElementById("alarm-form");
    const setAlarmButton = document.getElementById("set-alarm");
    setAlarmButton.addEventListener("click", function (event) {
        event.preventDefault();
        // アラーム設定の処理を実装する
        // 入力値を取得
        const alarmTime = document.getElementById("alarm-time").value;
        const alarmURL = document.getElementById("alarm-url").value;
        // バックグラウンドスクリプトにアラームの設定を送信
        chrome.runtime.sendMessage({ type: "setAlarm", alarmTime, alarmURL });
    });
});
// background.jsからメッセージを待機
chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "alarmTriggered") {
        // アラームが鳴ると、ポップアップを表示
        const alarmMessage = document.getElementById("alarm-message");
        const stopAlarmButton = document.getElementById("stop-alarm");
        alarmMessage.style.display = "block";
        stopAlarmButton.style.display = "block";
        // アラーム停止ボタンがクリックされたら
        stopAlarmButton.addEventListener("click", function () {
            // バックグラウンドスクリプトにアラームを止めるメッセージを送信
            chrome.runtime.sendMessage({ type: "stopAlarm" });
        });
    }
});
