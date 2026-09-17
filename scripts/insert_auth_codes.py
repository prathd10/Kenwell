import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing Supabase credentials in .env")
    exit(1)

def supabase_request(endpoint, method="GET", data=None):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read()
            if res_body:
                return json.loads(res_body)
            return None
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} {e.reason}")
        print(e.read().decode("utf-8"))
        raise

# 1. Fetch all products
print("Fetching products...")
products = supabase_request("products?select=id,name")
product_map = {p["name"]: p["id"] for p in products}

# Mapping based on the provided image
PRODUCT_MAPPINGS = [
    {"image_name": "3X Strength Fish Oil Caps", "db_name": "Triple Strength Fish Oil", "prefix": "SF", "qty": 410},
    {"image_name": "Ashwagandha Capsule", "db_name": "KSM-66 Ashwagandha", "prefix": "AS", "qty": 400},
    {"image_name": "Catalyst Tablet", "db_name": "Fat Burner", "prefix": "CT", "qty": 405},
    {"image_name": "Fish Oil Softgel Capsule", "db_name": "Single Strength Fish Oil", "prefix": "FO", "qty": 410},
    {"image_name": "Haddjod Tablet", "db_name": "Joint Support", "prefix": "HJ", "qty": 410},
    {"image_name": "Hair Health Tablet", "db_name": "DHT Blocker", "prefix": "HH", "qty": 303},
    {"image_name": "Hepavit Tablet", "db_name": "Liver Support Blend", "prefix": "HP", "qty": 303},
    {"image_name": "Integra Tablet", "db_name": "Prebiotics + Probiotics", "prefix": "IN", "qty": 300},
    {"image_name": "Liposomal Berberine Caps", "db_name": "Berberine HCL", "prefix": "LB", "qty": 203},
    {"image_name": "Liposomal CoQ10 Capsule", "db_name": "CoQ10 Ubiquinone", "prefix": "CQ", "qty": 225},
    {"image_name": "Liposomal Glutathione Tabs", "db_name": "Glutathione Reduced", "prefix": "LG", "qty": 318},
    {"image_name": "Liposomal NAC Tablet", "db_name": "NAC (N-Acetyl Cysteine)", "prefix": "NA", "qty": 300},
    {"image_name": "Liposomal Vitamin B12 Caps", "db_name": "Vitamin B12 (Methylcobalamin)", "prefix": "VB", "qty": 295},
    {"image_name": "Liposomal Vitamin C Tablet", "db_name": "Vitamin C", "prefix": "VC", "qty": 307},
    {"image_name": "Magnesium Glycinate Caps", "db_name": "Chelated Magnesium Glycinate", "prefix": "MG", "qty": 408},
    {"image_name": "Melatonin Tablet", "db_name": "Melatonin Sleep Support", "prefix": "ME", "qty": 317},
    {"image_name": "Milk Thistle Capsule", "db_name": "Milk Thistle", "prefix": "MT", "qty": 308},
    {"image_name": "Multivitamins Tablet", "db_name": "Multivitamin with Probiotics", "prefix": "MV", "qty": 508},
    {"image_name": "Revive Capsule", "db_name": "NAD+", "prefix": "RV", "qty": 222},
    {"image_name": "Salt Tabs Tablet", "db_name": "Vitamin D3 + K2 + Calcium", "prefix": "ST", "qty": 310},
    {"image_name": "TUDCA Tablet", "db_name": "TUDCA", "prefix": "TU", "qty": 308},
    {"image_name": "Vasopump Tablet", "db_name": "Vegetarian Omega", "prefix": "VP", "qty": 306},
    {"image_name": "ZMA Capsule", "db_name": "Zinc Picolonate + Magnesium", "prefix": "ZM", "qty": 298},
]

# Build the sku_plan for the batch
sku_plan = []
for item in PRODUCT_MAPPINGS:
    if item["db_name"] not in product_map:
        print(f"Warning: Product '{item['db_name']}' not found in database. Skipping.")
        continue
    sku_plan.append({
        "product_id": product_map[item["db_name"]],
        "quantity": item["qty"]
    })

# 2. Create the Batch
print("Creating auth_code_batches record...")
batch_data = {
    "label": "First Batch — Sept 2026",
    "sku_plan": sku_plan,
    "status": "completed"
}
batch_res = supabase_request("auth_code_batches", method="POST", data=[batch_data])
batch_id = batch_res[0]["id"]
print(f"Created batch with ID: {batch_id}")

# 3. Generate Codes
all_codes = []
for item in PRODUCT_MAPPINGS:
    if item["db_name"] not in product_map:
        continue
    
    product_id = product_map[item["db_name"]]
    prefix = item["prefix"]
    qty = item["qty"]
    
    for i in range(1, qty + 1):
        code = f"KW-{prefix}-{str(i).zfill(5)}"
        all_codes.append({
            "code": code,
            "product_id": product_id,
            "batch_id": batch_id
        })

print(f"Generated {len(all_codes)} codes to insert.")

# 4. Chunk and Insert Codes
CHUNK_SIZE = 1000
for i in range(0, len(all_codes), CHUNK_SIZE):
    chunk = all_codes[i:i + CHUNK_SIZE]
    print(f"Inserting chunk {i//CHUNK_SIZE + 1} ({len(chunk)} rows)...")
    # we don't need the return representation for large inserts, but supabase_request sets it. It's fine.
    supabase_request("product_auth_codes", method="POST", data=chunk)

print("Successfully inserted all product authentication codes!")
