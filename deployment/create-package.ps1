# Create Deployment Package - PowerShell
# ==========================================

Write-Host ""
Write-Host "========================================"
Write-Host "  Creating Deployment Package"
Write-Host "========================================"
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "paygate-optimizer-$timestamp.zip"

$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    ".env",
    ".env.local",
    "*.log",
    "logs",
    ".DS_Store",
    "Thumbs.db",
    "*.zip",
    ".cursor"
)

Write-Host "[1/3] Preparing files..."

$sourceDir = Get-Location
$tempDir = Join-Path $env:TEMP "paygate-package-temp"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "[2/3] Copying files..."

Get-ChildItem -Path $sourceDir -Recurse -Force | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourceDir.Path.Length + 1)
    $exclude = $false
    
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -like "*$pattern*") {
            $exclude = $true
            break
        }
    }
    
    if (-not $exclude) {
        $targetPath = Join-Path $tempDir $relativePath
        $targetDir = Split-Path $targetPath -Parent
        
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        if (-not $_.PSIsContainer) {
            Copy-Item $_.FullName $targetPath -Force
        }
    }
}

Write-Host "[3/3] Creating ZIP..."

$zipPath = Join-Path $sourceDir $packageName
Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force

Remove-Item -Recurse -Force $tempDir

$fileSize = (Get-Item $zipPath).Length / 1MB
$fileSizeFormatted = "{0:N2}" -f $fileSize

Write-Host ""
Write-Host "========================================"
Write-Host "  Package Created Successfully!"
Write-Host "========================================"
Write-Host ""
Write-Host "Package: $packageName"
Write-Host "Size: $fileSizeFormatted MB"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Upload $packageName to your hosting"
Write-Host "2. Extract the ZIP file"
Write-Host "3. Run: npm install"
Write-Host "4. Run: npm run build"
Write-Host "5. Run: npm start"
Write-Host ""
