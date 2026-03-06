import os
import shutil

src_components_ui = os.path.join('temp_clone', 'src', 'components', 'ui')
dest_components_ui = os.path.join('src', 'components', 'ui')
src_app_sidebar = os.path.join('temp_clone', 'src', 'components', 'app_sidebar.tsx')
dest_app_sidebar = os.path.join('src', 'components', 'app_sidebar.tsx')
src_mode_toggle = os.path.join('temp_clone', 'src', 'components', 'mode-toggle.tsx')
dest_mode_toggle = os.path.join('src', 'components', 'mode-toggle.tsx')

try:
    if not os.path.exists(dest_components_ui):
        os.makedirs(dest_components_ui)
        
    for item in os.listdir(src_components_ui):
        s = os.path.join(src_components_ui, item)
        d = os.path.join(dest_components_ui, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, False, None)
        else:
            shutil.copy2(s, d)
            
    shutil.copy2(src_app_sidebar, dest_app_sidebar)
    shutil.copy2(src_mode_toggle, dest_mode_toggle)
    print("Files copied successfully.")
except Exception as e:
    print(f"Error: {e}")
