@echo off
chcp 65001 >nul
cls
echo ============================================
echo    链上密码本管理器 - HTTPS 服务器
echo ============================================
echo.
echo [提示] 正在启动 HTTPS 服务器...
echo.

python start-https-server.py

if %errorlevel% neq 0 (
    echo.
    echo [错误] 启动失败
    echo.
    echo 可能的原因:
    echo 1. Python 未安装
    echo 2. 缺少必要的库
    echo.
    echo 解决方案:
    echo 安装 pyOpenSSL: pip install pyOpenSSL
    echo.
    pause
)

