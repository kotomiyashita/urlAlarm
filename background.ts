"use strict";

let alarmTimeout: NodeJS.Timeout | null = null;

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
chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === "myAlarm") {
    playAlarmSound();
  }
});

function playAlarmSound() {
  const audio = new Audio("alarm.mp3");
  audio.play()
    .then(() => {
      console.log("アラームが鳴りました！");
    })
    .catch((error: any) => {
      console.error("アラームの音声を再生できませんでした: " + error);
    });
}

// アラーム時にURLを開く関数
function openAlarmURL(url: string) {
    // 新しいタブでURLを開く
    chrome.tabs.create({ url });
}

console.log("Background script is running.");