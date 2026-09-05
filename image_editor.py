"""
================================================================================
AI IMAGE EDITOR & ENHANCER — MASTER AUTOMATION PIPELINE (PYTHON + FFMPEG)
================================================================================
Feature Capabilities:
1. Deep C2PA / EXIF / AI Prompt & Metadata Stripper (FFmpeg + Raw Pixel Reconstruction)
2. Watermark & Logo Overlay Engine (Precision Alignment & Aspect Ratio Protection)
3. Photoshop-Grade HD Enhancer (Unsharp Masking, Vibrant Color Boost & Contrast Curve)
4. Batch Folder Processing with 3-Digit Sequential Renaming (001.png - N.png) into outputs/
================================================================================
"""

import os
import sys
import shutil
import subprocess
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

# ==============================================================================
# 1. DEEP METADATA & C2PA STRIPPER ENGINE
# ==============================================================================

def strip_metadata_pillow(image: Image.Image) -> Image.Image:
    """
    Reconstructs pure raw pixel buffer in memory.
    Drops EXIF, IPTC, XMP, C2PA manifests, PNG chunks (prompt/workflow/parameters),
    and ICC profiles completely.
    """
    mode = image.mode
    if mode not in ["RGB", "RGBA"]:
        mode = "RGBA" if "A" in mode or "transparency" in image.info else "RGB"
        image = image.convert(mode)
        
    # Create clean brand new image without copying image.info dictionary or EXIF
    clean_img = Image.new(mode, image.size)
    clean_img.paste(image)
    return clean_img

def strip_metadata_ffmpeg(input_path: str, output_path: str) -> bool:
    """
    FFmpeg Rebuild Engine:
    Re-encodes pixel stream with zero metadata, zero chapters, and bitexact flags.
    Strips container-level C2PA manifests, JUMB boxes, and EXIF headers.
    """
    ffmpeg_cmd = shutil.which("ffmpeg")
    if not ffmpeg_cmd:
        return False
        
    ext = os.path.splitext(output_path)[1].lower()
    vcodec = "png" if ext == ".png" else "mjpeg"
    
    cmd = [
        ffmpeg_cmd,
        "-y",
        "-i", input_path,
        "-map_metadata", "-1",
        "-map_chapters", "-1",
        "-fflags", "+bitexact",
        "-flags:v", "+bitexact",
        "-vcodec", vcodec,
    ]
    
    if vcodec == "mjpeg":
        cmd.extend(["-q:v", "2"])
        
    cmd.append(output_path)
    
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return os.path.exists(output_path) and os.path.getsize(output_path) > 0
    except Exception as e:
        print(f"[FFmpeg Strip Warning] FFmpeg fallback error: {e}")
        return False

# ==============================================================================
# 2. PHOTOSHOP-GRADE FILTERS & HD PROCESSING
# ==============================================================================

def apply_hd_enhancements(img: Image.Image, filter_preset: str = "vibrant") -> Image.Image:
    """
    Applies Unsharp Masking for HD sharpness and color grading presets.
    """
    # 1. High Definition Detail Sharpening
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=160, threshold=3))
    
    # 2. Color & Tone Grading
    if filter_preset == "vibrant":
        color_enhancer = ImageEnhance.Color(img)
        img = color_enhancer.enhance(1.20)  # Saturation +20%
        contrast_enhancer = ImageEnhance.Contrast(img)
        img = contrast_enhancer.enhance(1.10)  # Contrast +10%
    elif filter_preset == "cinematic":
        contrast_enhancer = ImageEnhance.Contrast(img)
        img = contrast_enhancer.enhance(1.25)
        color_enhancer = ImageEnhance.Color(img)
        img = color_enhancer.enhance(0.88)
        brightness_enhancer = ImageEnhance.Brightness(img)
        img = brightness_enhancer.enhance(0.95)
    elif filter_preset == "bright":
        brightness_enhancer = ImageEnhance.Brightness(img)
        img = brightness_enhancer.enhance(1.10)
        contrast_enhancer = ImageEnhance.Contrast(img)
        img = contrast_enhancer.enhance(1.05)
    elif filter_preset == "hdr_boost":
        color_enhancer = ImageEnhance.Color(img)
        img = color_enhancer.enhance(1.25)
        contrast_enhancer = ImageEnhance.Contrast(img)
        img = contrast_enhancer.enhance(1.20)
        img = img.filter(ImageFilter.Detail())
        
    return img

# ==============================================================================
# 3. WATERMARK & LOGO OVERLAY ENGINE
# ==============================================================================

def apply_logo_overlay(
    img: Image.Image,
    logo_path: str,
    position="top-right-placeholder",
    scale_ratio: float = 0.15,
    opacity: float = 1.00,
    margin: int = 20
) -> Image.Image:
    """
    Overlays transparent PNG logo preserving exact aspect ratio and alignment.
    """
    if not logo_path or not os.path.exists(logo_path):
        return img
        
    with Image.open(logo_path) as logo:
        logo = logo.convert("RGBA")
        
        # Determine placement position & target size
        if position == "top-right-placeholder":
            # 9:16 Golden Circle Template default (Center 830, 126, Size 292px)
            target_w = 292
            target_h = int(logo.height * (target_w / logo.width))
            logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            pos = (830 - target_w // 2, 126 - target_h // 2)
        elif position == "top-right-45":
            # 4:5 Vertical Template default (Center 960, 140, Size 240px)
            target_w = 240
            target_h = int(logo.height * (target_w / logo.width))
            logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            pos = (960 - target_w // 2, 140 - target_h // 2)
        elif isinstance(position, (tuple, list)) and len(position) == 2:
            target_w = max(10, int(img.width * scale_ratio))
            target_h = int(logo.height * (target_w / logo.width))
            logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            pos = (int(position[0]) - target_w // 2, int(position[1]) - target_h // 2)
        else:
            target_w = max(10, int(img.width * scale_ratio))
            target_h = int(logo.height * (target_w / logo.width))
            logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            if position == "bottom-right":
                pos = (img.width - target_w - margin, img.height - target_h - margin)
            elif position == "top-right":
                pos = (img.width - target_w - margin, margin)
            elif position == "top-left":
                pos = (margin, margin)
            elif position == "bottom-left":
                pos = (margin, img.height - target_h - margin)
            elif position == "center":
                pos = ((img.width - target_w) // 2, (img.height - target_h) // 2)
            else:
                pos = (img.width - target_w - margin, img.height - target_h - margin)
                
        # Opacity adjustment
        if opacity < 1.0:
            r, g, b, alpha = logo.split()
            alpha = alpha.point(lambda p: int(p * opacity))
            logo.putalpha(alpha)
            
        img.paste(logo, pos, logo)
        
    return img

# ==============================================================================
# 4. SINGLE & BATCH PIPELINE EXECUTOR
# ==============================================================================

def process_image(
    input_path: str,
    output_path: str,
    logo_path: str = None,
    scale_ratio: float = 0.15,
    opacity: float = 1.00,
    position = "top-right-placeholder",
    margin: int = 20,
    apply_hd: bool = True,
    filter_preset: str = "vibrant",
    strip_metadata: bool = True,
    use_ffmpeg_rebuild: bool = True
) -> str:
    """
    Executes complete image enhancement, logo overlay, and C2PA metadata stripping.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
        
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    # Step 1: Open Image & Perform Enhancements + Overlay in Pillow
    with Image.open(input_path) as img:
        img = img.convert("RGBA")
        
        # Apply HD Sharpening & Color Polish
        if apply_hd:
            img = apply_hd_enhancements(img, filter_preset=filter_preset)
            
        # Apply Watermark Logo
        if logo_path and os.path.exists(logo_path):
            img = apply_logo_overlay(
                img=img,
                logo_path=logo_path,
                position=position,
                scale_ratio=scale_ratio,
                opacity=opacity,
                margin=margin
            )
            
        # Step 2: Strip Metadata & Save Clean Pixels
        if strip_metadata:
            clean_img = strip_metadata_pillow(img)
            ext = os.path.splitext(output_path)[1].lower()
            if ext in [".jpg", ".jpeg"]:
                clean_img = clean_img.convert("RGB")
                clean_img.save(output_path, "JPEG", quality=95, optimize=True)
            else:
                clean_img.save(output_path, "PNG", optimize=True)
        else:
            img.save(output_path)
            
    # Step 3: FFmpeg Double-Pass Rebuild (If FFmpeg available)
    if strip_metadata and use_ffmpeg_rebuild:
        temp_ffmpeg_out = output_path + ".tmp.png"
        if strip_metadata_ffmpeg(output_path, temp_ffmpeg_out):
            shutil.move(temp_ffmpeg_out, output_path)
            
    print(f"[SUCCESS] Clean Processed: {input_path} -> {output_path}")
    return output_path

def process_batch_folder(
    input_dir: str,
    output_dir: str = None,
    logo_path: str = None,
    **kwargs
) -> list:
    """
    Batch processes an entire folder, creating separate outputs/ directory with 001.png - N.png sequential naming.
    """
    if not os.path.exists(input_dir):
        raise FileNotFoundError(f"Input directory not found: {input_dir}")
        
    if output_dir is None:
        output_dir = os.path.join(input_dir, "outputs")
        
    os.makedirs(output_dir, exist_ok=True)
    
    supported_exts = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
    files = [f for f in os.listdir(input_dir) if os.path.splitext(f)[1].lower() in supported_exts]
    
    def sort_key(filename):
        base = os.path.splitext(filename)[0]
        try:
            return (0, int(base))
        except ValueError:
            return (1, filename)
            
    sorted_files = sorted(files, key=sort_key)
    processed_files = []
    
    print(f"================================================================================")
    print(f"STARTING BATCH PROCESSING: {len(sorted_files)} Files")
    print(f"Source Folder: {input_dir}")
    print(f"Output Folder: {output_dir}")
    print(f"================================================================================")
    
    for idx, file_name in enumerate(sorted_files, start=1):
        in_path = os.path.join(input_dir, file_name)
        out_filename = f"{idx:03d}.png"
        out_path = os.path.join(output_dir, out_filename)
        
        res = process_image(
            input_path=in_path,
            output_path=out_path,
            logo_path=logo_path,
            **kwargs
        )
        processed_files.append(res)
        
    print(f"================================================================================")
    print(f"COMPLETED: All {len(processed_files)} images processed and saved into {output_dir}")
    print(f"================================================================================")
    return processed_files

if __name__ == "__main__":
    # Test batch execution for Modul 1 / Folder 3
    input_directory = r"C:\Users\NCN0C\Music\images_editor\brevet-ab\modul 1\3"
    output_directory = r"C:\Users\NCN0C\Music\images_editor\brevet-ab\modul 1\3\outputs"
    logo_image = r"C:\Users\NCN0C\Music\images_editor\brevet-ab\logo\logo.png"
    
    process_batch_folder(
        input_dir=input_directory,
        output_dir=output_directory,
        logo_path=logo_image,
        position=(890, 110),
        scale_ratio=0.214,
        apply_hd=True,
        filter_preset="vibrant",
        strip_metadata=True,
        use_ffmpeg_rebuild=True
    )
