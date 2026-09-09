import os
from PIL import Image, ImageDraw, ImageFont

products = [
    {"slug": "ksm-66-ashwagandha", "name": "ASHWAGANDHA", "sub": "600mg KSM-66®", "b1": "• Stress & Anxiety Relief", "b2": "• Natural Energy Focus", "color": "blue"},
    {"slug": "chelated-magnesium-glycinate", "name": "MAGNESIUM", "sub": "400mg Chelated", "b1": "• Deep Sleep Support", "b2": "• Muscle Recovery", "color": "red"},
    {"slug": "nad", "name": "NAD+ COMPLEX", "sub": "Liposomal Delivery", "b1": "• Cellular Energy", "b2": "• Healthy Aging", "color": "blue"},
    {"slug": "glutathione-reduced", "name": "GLUTATHIONE", "sub": "500mg Reduced", "b1": "• Master Antioxidant", "b2": "• Liver Detoxification", "color": "red"},
    {"slug": "triple-strength-fish-oil", "name": "FISH OIL", "sub": "Triple Strength EPA/DHA", "b1": "• Heart Health", "b2": "• Joint Mobility", "color": "blue"},
    {"slug": "multivitamin-with-probiotics", "name": "MULTIVITAMIN", "sub": "With Probiotics", "b1": "• Daily Foundation", "b2": "• Gut & Immunity", "color": "red"},
]

def generate_bottles():
    print("Starting bottle generation...")
    
    # Paths to the generated template images
    blue_bottle_path = r"C:\Users\pratham\.gemini\antigravity-ide\brain\97f24004-2e8e-4182-a75e-c621e1bc4530\bottle_blue_v2_1788956456282.jpg"
    red_bottle_path = r"C:\Users\pratham\.gemini\antigravity-ide\brain\97f24004-2e8e-4182-a75e-c621e1bc4530\bottle_red_v2_1788956471465.jpg"
    
    logo_path = r"c:\Users\pratham\Desktop\KENWELL\public\kenwell-logo-full.png"
    
    # Try to load the logo
    logo = None
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo.thumbnail((200, 200))
        
    try:
        font = ImageFont.truetype("arial.ttf", 26)
        font_small = ImageFont.truetype("arial.ttf", 16)
        font_sub = ImageFont.truetype("arial.ttf", 18)
    except IOError:
        font = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    for p in products:
        template_path = blue_bottle_path if p["color"] == "blue" else red_bottle_path
        if not os.path.exists(template_path):
            print(f"Skipping {p['name']}, missing template")
            continue
            
        img = Image.open(template_path)
        draw = ImageDraw.Draw(img)
        
        # Cover dummy text with white block
        draw.rectangle([360, 440, 670, 780], fill="white")
        
        # Paste logo
        if logo:
            img.paste(logo, (412, 450), logo)
            
        # Draw brush stroke
        stroke_color = "#1C355E" if p["color"] == "blue" else "#D47A3B"
        draw.rounded_rectangle([380, 560, 640, 620], radius=10, fill=stroke_color)
        
        # Product name
        draw.text((400, 575), p["name"], fill="white", font=font)
        
        # Details
        draw.text((410, 640), p["sub"], fill="#1A1A1A", font=font_sub)
        draw.text((390, 680), p["b1"], fill="#1A1A1A", font=font_small)
        draw.text((390, 710), p["b2"], fill="#1A1A1A", font=font_small)
        draw.text((430, 750), "60 Vegetarian Capsules", fill="#1A1A1A", font=font_small)

        out_path = f"c:\\Users\\pratham\\Desktop\\KENWELL\\public\\bottle_{p['slug']}_new.png"
        img.save(out_path)
        print(f"Saved {out_path}")

if __name__ == "__main__":
    generate_bottles()
