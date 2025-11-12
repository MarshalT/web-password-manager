@echo off
chcp 65001 >nul

echo 🔐 链上密码本管理器 - GitHub Pages 部署
echo =====================================

REM 检查是否在 Git 仓库中
if not exist ".git" (
    echo ❌ 错误：当前目录不是 Git 仓库
    echo 请先初始化 Git 仓库：git init
    pause
    exit /b 1
)

echo 📦 创建 gh-pages 分支并部署...

REM 切换到 gh-pages 分支
git checkout -b gh-pages 2>nul || git checkout gh-pages

REM 添加所有文件
git add .

REM 提交更改
echo 💾 提交更改...
git commit -m "部署到 GitHub Pages - %date% %time%"

REM 推送到 gh-pages 分支
echo 🚀 推送到 gh-pages 分支...
git push origin gh-pages

echo.
echo ✅ 部署完成！
echo 📱 请访问：https://MarshalT.github.io/web-password-manager

echo.
echo 💡 配置步骤：
echo 1. 在 GitHub 仓库设置中进入 "Pages"
echo 2. 选择 "Deploy from a branch"
echo 3. 选择 "gh-pages" 分支和 "/ (root)" 文件夹
echo 4. 保存设置，等待几分钟后即可访问

pause