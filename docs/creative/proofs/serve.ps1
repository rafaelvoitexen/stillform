param([int]$Port = 4179)
$studyRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$studyListener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$studyListener.Start()
Write-Output "Static Hero proofs: http://127.0.0.1:$Port/variant-a.html"
try {
  while ($true) {
    $studyClient = $studyListener.AcceptTcpClient()
    try {
      $studyStream = $studyClient.GetStream()
      $studyReader = [IO.StreamReader]::new($studyStream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $studyRequest = $studyReader.ReadLine()
      if (-not $studyRequest) { continue }
      while ($studyReader.ReadLine()) {}
      $studyParts = $studyRequest.Split(' ')
      $studyUrl = [Uri]::new("http://127.0.0.1" + $studyParts[1])
      $studyRelative = [Uri]::UnescapeDataString($studyUrl.AbsolutePath).TrimStart('/')
      if (-not $studyRelative) { $studyRelative = 'index.html' }
      $studyTarget = [IO.Path]::GetFullPath([IO.Path]::Combine($studyRoot,$studyRelative))
      $studyStatus = '200 OK'
      $studyMime = 'application/octet-stream'
      if ($studyParts[0] -ne 'GET' -or -not $studyTarget.StartsWith($studyRoot + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) {
        $studyStatus = '403 Forbidden'
        $studyData = [Text.Encoding]::UTF8.GetBytes('Forbidden')
      } elseif (-not [IO.File]::Exists($studyTarget)) {
        $studyStatus = '404 Not Found'
        $studyData = [Text.Encoding]::UTF8.GetBytes('Not found')
      } else {
        $studyData = [IO.File]::ReadAllBytes($studyTarget)
        $studyMime = switch ([IO.Path]::GetExtension($studyTarget)) {
          '.html' {'text/html; charset=utf-8'} '.css' {'text/css; charset=utf-8'}
          '.jpg' {'image/jpeg'} '.png' {'image/png'} '.ttf' {'font/ttf'}
          '.json' {'application/json'} '.md' {'text/plain; charset=utf-8'}
          default {'application/octet-stream'}
        }
      }
      $studyHeader = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $studyStatus`r`nContent-Type: $studyMime`r`nContent-Length: $($studyData.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n")
      $studyStream.Write($studyHeader,0,$studyHeader.Length)
      $studyStream.Write($studyData,0,$studyData.Length)
    } catch { Write-Warning $_.Exception.Message }
    finally { $studyClient.Dispose() }
  }
} finally { $studyListener.Stop() }

