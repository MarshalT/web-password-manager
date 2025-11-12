@echo off
chcp 65001 >nul

echo 🔐 链上密码本管理器 - 部署准备
echo ================================

REM 检查是否在 Git 仓库中
if not exist ".git" (
    echo ❌ 错误：当前目录不是 Git 仓库
    echo 请先初始化 Git 仓库：git init
    pause
    exit /b 1
)

REM 添加所有文件到 Git
echo 📦 添加文件到 Git...
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "部署到 GitHub Pages - %date% %time%"

REM 推送到远程仓库
echo 🚀 推送到远程仓库...
git push origin main

echo.
echo ✅ 部署完成！
echo 📱 请访问：https://^<username^>.github.io/^<repository-name^>
echo.
echo 💡 提示：
echo 1. 确保在 GitHub 仓库设置中启用了 GitHub Pages
echo 2. 选择 "GitHub Actions" 作为部署源
echo 3. 部署可能需要几分钟时间

pause