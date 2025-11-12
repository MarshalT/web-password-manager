@echo off
chcp 65001 >nul

echo 🔄 链上密码本管理器 - 功能更新部署
echo ====================================

REM 检查是否在 Git 仓库中
if not exist ".git" (
    echo ❌ 错误：当前目录不是 Git 仓库
    echo 请先初始化 Git 仓库
    pause
    exit /b 1
)

REM 检查当前分支
git branch --show-current >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 状态异常，请检查 Git 配置
    pause
    exit /b 1
)

echo 📝 当前修改状态：
git status --short

echo.
echo 📦 提交更新到主分支...

REM 切换到主分支
git checkout main

REM 添加所有更新文件
git add .

REM 提交更新
echo 💾 提交更新...
git commit -m "功能更新 - %date% %time%"

REM 推送到主分支
echo 🚀 推送到主分支...
git push origin main

echo.
echo 📦 部署到 GitHub Pages...

REM 切换到 gh-pages 分支
git checkout gh-pages

REM 合并主分支的更新
echo 🔄 合并主分支更新...
git merge main --no-edit

REM 推送到 gh-pages 分支
echo 🚀 推送到 gh-pages 分支...
git push origin gh-pages

REM 切换回主分支
git checkout main

echo.
echo ✅ 更新部署完成！
echo 📱 请访问：https://MarshalT.github.io/web-password-manager

echo.
echo 💡 提示：
echo - GitHub Pages 部署可能需要 1-5 分钟生效
pause