param(
  [int]$Port = 3000,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path $Root).Path
Write-Host "Serving $Root on http://localhost:$Port"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".svg"  = "image/svg+xml"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2" = "font/woff2"
  ".ttf"  = "font/ttf"
  ".otf"  = "font/otf"
  ".txt"  = "text/plain; charset=utf-8"
  ".map"  = "application/json; charset=utf-8"
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    try {
      $relPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }

      $path = Join-Path $Root $relPath
      if ((Test-Path $path -PathType Container)) {
        $path = Join-Path $path "index.html"
      }

      if (Test-Path $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.StatusCode = 200
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "200 $relPath"
      } else {
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
        $res.StatusCode = 404
        $res.ContentType = "text/plain; charset=utf-8"
        $res.ContentLength64 = $msg.Length
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host "404 $relPath"
      }
    } catch {
      $err = [System.Text.Encoding]::UTF8.GetBytes("500 $($_.Exception.Message)")
      try {
        $res.StatusCode = 500
        $res.ContentType = "text/plain; charset=utf-8"
        $res.ContentLength64 = $err.Length
        $res.OutputStream.Write($err, 0, $err.Length)
      } catch {}
      Write-Host "500 $($_.Exception.Message)"
    } finally {
      try { $res.OutputStream.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
