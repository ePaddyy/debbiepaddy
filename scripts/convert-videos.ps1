param(
    [string]$FfmpegPath = "ffmpeg"
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$sourceDirectory = Join-Path $projectRoot "images\videos"
$outputDirectory = Join-Path $sourceDirectory "browser-ready"
$ffmpegCommand = Get-Command $FfmpegPath -ErrorAction SilentlyContinue

if ($ffmpegCommand) {
    $ffmpegPath = $ffmpegCommand.Source
} elseif (Test-Path -LiteralPath $FfmpegPath -PathType Leaf) {
    $ffmpegPath = (Resolve-Path -LiteralPath $FfmpegPath).Path
} else {
    $wingetPackageRoot = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
    $ffmpegPackage = Get-ChildItem -LiteralPath $wingetPackageRoot -Filter "ffmpeg.exe" -File -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -like "*\Gyan.FFmpeg_*\*" } |
        Select-Object -First 1

    if (-not $ffmpegPackage) {
        throw "FFmpeg was not found. Install it or pass its executable path to this script."
    }

    $ffmpegPath = $ffmpegPackage.FullName
}

$videoFiles = Get-ChildItem -LiteralPath $sourceDirectory -File |
    Where-Object { $_.Extension -in @(".mp4", ".mov") }

if ($videoFiles.Count -eq 0) {
    throw "No MP4 or MOV source videos were found in $sourceDirectory."
}

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

foreach ($video in $videoFiles) {
    $outputPath = Join-Path $outputDirectory ($video.BaseName + ".mp4")
    & $ffmpegPath `
        -hide_banner `
        -loglevel error `
        -y `
        -i $video.FullName `
        -map "0:v:0" `
        -map "0:a?" `
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" `
        -c:v libx264 `
        -preset medium `
        -crf 21 `
        -pix_fmt yuv420p `
        -c:a aac `
        -b:a 128k `
        -movflags +faststart `
        -sn `
        $outputPath

    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg failed to convert $($video.Name) (exit code $LASTEXITCODE)."
    }

    if (-not (Test-Path -LiteralPath $outputPath) -or (Get-Item -LiteralPath $outputPath).Length -eq 0) {
        throw "FFmpeg did not create a valid output for $($video.Name)."
    }

    Write-Output "Converted $($video.Name) to $outputPath"
}
