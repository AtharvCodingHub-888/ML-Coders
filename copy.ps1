$source = "temp_clone\src\components\ui"
$dest = "src\components\ui"
$sidebar = "temp_clone\src\components\app_sidebar.tsx"
$toggle = "temp_clone\src\components\mode-toggle.tsx"

Copy-Item -Path $source -Destination $dest -Recurse -Force
Copy-Item -Path $sidebar -Destination "src\components" -Force
Copy-Item -Path $toggle -Destination "src\components" -Force
