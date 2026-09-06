chcp 65001
@echo off
set /p title="输入文件名/标题: "
hugo new content content/posts/%title%.md
echo 创建 %title%.md 成功!
pause
