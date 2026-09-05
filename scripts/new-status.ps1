# new-status.ps1
# 新建一条微博（status）：文件自动以"日期+时间"命名，存放在 content/statuses/ 下。
# 用法：在仓库根目录执行  .\scripts\new-status.ps1
#   等价于用户期望的 `hugo new status`，但 Hugo 原生不支持自动日期命名，故用此脚本包装。

$ErrorActionPreference = "Stop"

# 仓库根目录（脚本所在目录的上一级）
$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
Push-Location $repoRoot

try {
    # 文件名：2026-09-05-213700.md
    $stamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
    $relPath = "statuses/$stamp.md"

    Write-Host ">>> hugo new $relPath"
    hugo new $relPath

    if ($LASTEXITCODE -ne 0) {
        throw "hugo new 执行失败（exit code $LASTEXITCODE）"
    }

    Write-Host ""
    Write-Host "已创建: content/$relPath"
    Write-Host "访问地址: /statuses/$stamp/"
    Write-Host "（编辑完成后把 draft 改为 false 即可发布）"
}
finally {
    Pop-Location
}
