import os
import shutil
from pathlib import Path
from PIL import Image

# 1. Define the directory containing your images
folder_path = Path("./")

# 2. Create the "old" directory path
old_dir = folder_path / "old"

# 3. Iterate over each image type (*.jpeg, *.png, *.jpg)
patterns = ["*.jpeg", "*.png", "*.jpg"]
for pattern in patterns:
    for img_path in folder_path.glob(pattern):
        try:
            should_compress = False
            # Open the image to check dimensions
            with Image.open(img_path) as img:
                width, height = img.size
                print(f"File: {img_path.name} | Width: {width}, Height: {height}")
                if width > 1500 or height > 1500:
                    should_compress = True

            if should_compress:
                webp_name = f"{img_path.stem}.webp"
                # Run the compression
                res = os.system(f"cwebp -resize 1920 0 \"{img_path.name}\" -o \"{webp_name}\"")
                
                # Check if the webp file was successfully generated
                if res == 0 and Path(webp_name).exists():
                    old_dir.mkdir(exist_ok=True)
                    target_path = old_dir / img_path.name
                    if target_path.exists():
                        target_path.unlink()
                    shutil.move(str(img_path), str(target_path))
                    print(f"Moved original {img_path.name} to old/")
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")
