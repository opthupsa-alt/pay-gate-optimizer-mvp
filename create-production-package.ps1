# Create Production Package
Write-Host "Creating production package..."

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "paygate-production-$timestamp.zip"
$tempDir = "$env:TEMP\paygate-prod-temp"

# Clean temp
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "Copying files..."

# Copy directories
$dirs = @(".next", "public", "production", "prisma", "lib", "components", "app")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination "$tempDir\$dir" -Recurse -Force
        Write-Host "  Copied: $dir"
    }
}

# Copy files
$files = @("package.json", "next.config.mjs", "server.js", "tsconfig.json", "tailwind.config.ts", "postcss.config.mjs", "pnpm-lock.yaml")
foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "$tempDir\$file" -Force
        Write-Host "  Copied: $file"
    }
}

Write-Host "Compressing..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $packageName -Force

Remove-Item -Recurse -Force $tempDir

$size = [math]::Round((Get-Item $packageName).Length / 1MB, 2)
Write-Host ""
Write-Host "SUCCESS: $packageName ($size MB)"

