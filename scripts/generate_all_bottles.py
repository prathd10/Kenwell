import os
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# All 23 products with their exact authentic labeling
PRODUCTS_DATA = [
    {
        "slug": "ksm-66-ashwagandha",
        "title": "ASHWAGANDHA",
        "sub": "600mg KSM-66® Extract",
        "bullets": ["Cortisol & Stress Resilience", "Supports Energy & Focus", "Restful Natural Sleep"],
        "series": "Core Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "chelated-magnesium-glycinate",
        "title": "MAGNESIUM GLYCINATE",
        "sub": "400mg Chelated Pure Form",
        "bullets": ["Neurological Calming Agent", "Relieves Muscle Tension", "Deep REM Sleep Induction"],
        "series": "Core Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "multivitamin-with-probiotics",
        "title": "MULTIVITAMIN",
        "sub": "With Probiotics & Minerals",
        "bullets": ["Complete Daily Bio-Nutrients", "Gut Microbiome Balance", "Cellular Immunity Defense"],
        "series": "Core Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "triple-strength-fish-oil",
        "title": "TRIPLE FISH OIL",
        "sub": "Ultra-Pure EPA & DHA",
        "bullets": ["70% Higher Bioavailability", "Cardiovascular & Arterial Care", "Neural Membrane Health"],
        "series": "Core Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "single-strength-fish-oil",
        "title": "OMEGA-3 FISH OIL",
        "sub": "1000mg Purified Triglyceride",
        "bullets": ["Daily Heart & Brain Support", "Joint Lubrication & Ease", "Zero Heavy Metal Contaminants"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "nad",
        "title": "NAD+ COMPLEX",
        "sub": "Liposomal Rejuvenation",
        "bullets": ["Mitochondrial ATP Fuel", "Sirtuin Longevity Activation", "Deep Cellular DNA Repair"],
        "series": "Liposomal Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "glutathione-reduced",
        "title": "GLUTATHIONE",
        "sub": "500mg Reduced L-Form",
        "bullets": ["Master Cellular Antioxidant", "Phase II Liver Detoxification", "Brightens & Evens Skin Tone"],
        "series": "Liposomal Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "vitamin-c",
        "title": "LIPOSOMAL VITAMIN C",
        "sub": "1000mg Phospholipid Pure",
        "bullets": ["5x Higher Cellular Uptake", "Gentle on Stomach Lining", "Natural Collagen Synthesis"],
        "series": "Liposomal Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "coq10-ubiquinone",
        "title": "COQ10 UBIQUINONE",
        "sub": "200mg Bio-Enhanced",
        "bullets": ["Cardiovascular Energy Engine", "Potent Cellular Antioxidant", "Replenishes Vital CoQ10 Pools"],
        "series": "Liposomal Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "vitamin-d3-k2-calcium",
        "title": "VITAMIN D3 + K2",
        "sub": "With Calcium Citrate",
        "bullets": ["Directs Calcium to Bones", "Prevents Arterial Calcification", "Immune System Activation"],
        "series": "Wellness Series",
        "color": (74, 107, 74) # Herbal Green
    },
    {
        "slug": "zinc-picolonate-magnesium",
        "title": "ZINC + MAGNESIUM",
        "sub": "High-Absorption Chelates",
        "bullets": ["Cellular Immune Barrier", "Enzyme & Hormonal Balance", "Muscle Recovery & Repair"],
        "series": "Wellness Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "vegetarian-omega",
        "title": "VEGAN OMEGA-3",
        "sub": "Algal DHA & EPA Direct",
        "bullets": ["100% Plant Cultivated", "Zero Fish Burps or Scent", "Brain, Eye & Nerve Health"],
        "series": "Wellness Series",
        "color": (74, 107, 74) # Herbal Green
    },
    {
        "slug": "dht-blocker",
        "title": "DHT BLOCKER",
        "sub": "Saw Palmetto & Biotin",
        "bullets": ["Inhibits 5-Alpha Reductase", "Nourishes Hair Follicle Roots", "Promotes Hormone Balance"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "prebiotics-probiotics",
        "title": "PRE & PROBIOTICS",
        "sub": "50 Billion Multi-Strain CFU",
        "bullets": ["Restores Digestive Harmony", "Relieves Bloating & Gas", "Gut-Brain Neuro-Support"],
        "series": "Wellness Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "tudca",
        "title": "TUDCA",
        "sub": "500mg Pure Bile Acid",
        "bullets": ["Hepatocyte Membrane Defense", "Prevents Liver ER Stress", "Optimizes Bile Flow & Motility"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "fat-burner",
        "title": "THERMOGENIC",
        "sub": "Metabolic Energy Formula",
        "bullets": ["Accelerates Calorie Expenditure", "Clean Non-Jitter Stamina", "Lipolysis Exercise Catalyst"],
        "series": "Performance Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "liver-support-blend",
        "title": "LIVER SUPPORT",
        "sub": "Synergistic Detox Matrix",
        "bullets": ["Dual Phase Detox Clearance", "Balances Transaminase Enzymes", "Supports Healthy Digestion"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "berberine-hcl",
        "title": "BERBERINE HCL",
        "sub": "500mg Standardized AMPK",
        "bullets": ["Activates Metabolic Master Switch", "Maintains Healthy Glucose", "Supports Insulin Sensitivity"],
        "series": "Wellness Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "vitamin-b12",
        "title": "VITAMIN B12",
        "sub": "Active Methylcobalamin",
        "bullets": ["Nerve Myelin Protection", "Energy & Red Blood Cells", "Optimal Neuro-Transmitter Flow"],
        "series": "Wellness Series",
        "color": (212, 122, 59) # Rust Orange
    },
    {
        "slug": "melatonin-sleep-support",
        "title": "MELATONIN SLEEP",
        "sub": "Circadian Rest Complex",
        "bullets": ["Reduces Sleep Latency", "Restores Natural REM Cycles", "Wake Refreshed & Clear"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "nac",
        "title": "NAC (N-ACETYL)",
        "sub": "600mg Pure Precursor",
        "bullets": ["Glutathione Synthesis Fuel", "Respiratory Airway Defense", "Hepatoprotective Support"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "milk-thistle",
        "title": "MILK THISTLE",
        "sub": "80% Silymarin Extract",
        "bullets": ["Stimulates Liver Cell Renewal", "Potent Free Radical Shield", "Promotes Healthy Skin"],
        "series": "Wellness Series",
        "color": (28, 53, 94) # Navy Blue
    },
    {
        "slug": "joint-support",
        "title": "JOINT SUPPORT",
        "sub": "Glucosamine + UC-II®",
        "bullets": ["Cartilage Matrix Protection", "Eases Joint Inflammation", "Flexibility & Mobility Ease"],
        "series": "Wellness Series",
        "color": (74, 107, 74) # Herbal Green
    },
]

def generate_all():
    print("Generating all 23 genuine Kenwell branded bottles...")
    base_img = Image.open(r"public\test_bottle_cropped.png").convert("RGB")
    arr_base = np.array(base_img)

    # Clean row reference at y=325
    clean_row = np.mean(arr_base[323:328, 232:446], axis=0, keepdims=True) # shape (1, 214, 3)

    # Try loading high quality fonts
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 15)
        font_med = ImageFont.truetype("arialbd.ttf", 13)
        font_small_title = ImageFont.truetype("arialbd.ttf", 11)
        font_sub = ImageFont.truetype("arialbd.ttf", 11)
        font_bullet = ImageFont.truetype("arial.ttf", 11)
    except:
        font_large = font_med = font_small_title = font_sub = font_bullet = ImageFont.load_default()

    for p in PRODUCTS_DATA:
        arr = arr_base.copy()

        # Seamless vertical inpaint for y: 332 to 522
        tiled = np.tile(clean_row, (190, 1, 1))
        for y_idx in range(190):
            # Subtle gradient matching natural light
            factor = 1.0 - (y_idx / 190.0) * 0.02
            tiled[y_idx] = np.clip(tiled[y_idx] * factor, 0, 255)
            
        # Feather smoothly into the bottom rows (515 to 522)
        arr[332:522, 232:446] = tiled.astype(np.uint8)

        # Reconvert to PIL Image
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)

        # Draw Series Brush / Rounded Badge
        badge_color = p["color"]
        draw.rounded_rectangle([236, 334, 436, 368], radius=6, fill=badge_color)

        # Choose font size for title
        title_font = font_large
        bbox = draw.textbbox((0, 0), p["title"], font=title_font)
        if (bbox[2] - bbox[0]) > 185:
            title_font = font_med
            bbox = draw.textbbox((0, 0), p["title"], font=title_font)
        if (bbox[2] - bbox[0]) > 185:
            title_font = font_small_title
            bbox = draw.textbbox((0, 0), p["title"], font=title_font)

        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((336 - tw / 2, 351 - th / 2), p["title"], fill="white", font=title_font)

        # Subtitle
        sub_bbox = draw.textbbox((0, 0), p["sub"], font=font_sub)
        sub_w = sub_bbox[2] - sub_bbox[0]
        draw.text((336 - sub_w / 2, 380), p["sub"], fill=(40, 40, 40), font=font_sub)

        # 3 Bullet points
        y_pos = 410
        for b in p["bullets"]:
            # Bullet dot with brand badge color
            draw.ellipse([240, y_pos + 3, 246, y_pos + 9], fill=badge_color)
            draw.text((254, y_pos), b, fill=(42, 42, 42), font=font_bullet)
            y_pos += 26

        # Save both as bottle_{slug}.png and bottle_{slug}_new.png so all paths match!
        out1 = f"public/bottle_{p['slug']}.png"
        out2 = f"public/bottle_{p['slug']}_new.png"
        img.save(out1)
        img.save(out2)
        print(f"Generated {out1}")

    print("All 23 genuine bottles generated successfully!")

if __name__ == "__main__":
    generate_all()
