"use strict";
let alarmTimeout = null;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "setAlarm") {
        const { alarmTime, alarmURL } = message;
        // 既存のアラームがあればキャンセル
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }
        // アラームの設定
        const now = new Date();
        const alarmDate = new Date(now.toDateString() + " " + alarmTime);
        const timeUntilAlarm = alarmDate.getTime() - now.getTime();
        if (timeUntilAlarm <= 0) {
            console.error("無効な時間です。");
            return;
        }
        // アラームをセットアップ
        alarmTimeout = setTimeout(() => {
            // アラームの音を鳴らす処理を実行
            playAlarmSound();
            // ポップアップにアラームが鳴ったことを通知
            chrome.runtime.sendMessage({ type: "alarmTriggered" });
        }, timeUntilAlarm);
    }
    if (message.type === "stopAlarm") {
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }
        // アラーム停止後にURLを開く
        const { alarmURL } = message;
        openAlarmURL(alarmURL);
    }
});
// アラームの音を鳴らす関数 (実際の音の再生処理を追加する必要があります)
function playAlarmSound() {
    // サウンドファイルのURLを指定
    const soundFileURL = chrome.runtime.getURL("alarm.mp3");
    // Web Audio APIを使用して音声を再生
    const audioContext = new AudioContext();
    // 音声を取得
    fetch(soundFileURL)
        .then(response => response.arrayBuffer())
        .then(buffer => {
        audioContext.decodeAudioData(buffer, audioData => {
            const source = audioContext.createBufferSource();
            source.buffer = audioData;
            source.connect(audioContext.destination);
            source.start();
        });
    })
        .catch(error => {
        console.error("音声の取得に失敗しました:", error);
    });
}
// アラーム時にURLを開く関数
function openAlarmURL(url) {
    // 新しいタブでURLを開く
    chrome.tabs.create({ url });
}
console.log("Background script is running.");
