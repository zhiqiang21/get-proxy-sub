#!/bin/bash

# 更新v2ray配置文件
new_address=$1

if [[ -z "$new_address" ]]; then
    echo "please input your <new_address> !!!"
    return 1
fi
jq --arg address "$new_address" '.outbounds[0].settings.vnext[0].address = $address' "$HOME/backup/v2ray-macos-arm64-v8a/config.json" > "$HOME/backup/v2ray-macos-arm64-v8a/config.new.json"

mv "$HOME/backup/v2ray-macos-arm64-v8a/config.new.json" "$HOME/backup/v2ray-macos-arm64-v8a/config.json"

