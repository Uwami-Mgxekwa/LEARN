$badSeq = [byte[]]@(0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0xE2, 0x80, 0x9C)
$hyphen = [byte[]]@(0x2D)

# Also fix the arrow: â†' (C3 A2 E2 86 92) -> ->
$badArrow = [byte[]]@(0xC3, 0xA2, 0xE2, 0x86, 0x92)
$arrow = [System.Text.Encoding]::UTF8.GetBytes('->')

# Also fix Â· (C2 B7) -> middle dot or just a dot
$badMiddleDot = [byte[]]@(0xC3, 0x82, 0xC2, 0xB7)
$dot = [byte[]]@(0xC2, 0xB7)  # keep as proper middle dot

function Replace-ByteSeq($bytes, $find, $replace) {
    $result = [System.Collections.Generic.List[byte]]::new()
    $i = 0
    while ($i -lt $bytes.Length) {
        $match = $false
        if ($i + $find.Length -le $bytes.Length) {
            $match = $true
            for ($j = 0; $j -lt $find.Length; $j++) {
                if ($bytes[$i+$j] -ne $find[$j]) { $match = $false; break }
            }
        }
        if ($match) { $result.AddRange($replace); $i += $find.Length }
        else { $result.Add($bytes[$i]); $i++ }
    }
    return $result.ToArray()
}

Get-ChildItem -Path . -Include "*.html","*.js" -Recurse | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $original = $bytes.Clone()
    $bytes = Replace-ByteSeq $bytes $badSeq $hyphen
    $bytes = Replace-ByteSeq $bytes $badArrow $arrow
    if ([System.Linq.Enumerable]::SequenceEqual([byte[]]$bytes, [byte[]]$original) -eq $false) {
        [System.IO.File]::WriteAllBytes($_.FullName, $bytes)
        Write-Host "Fixed: $($_.Name)"
    }
}
Write-Host "All done"
