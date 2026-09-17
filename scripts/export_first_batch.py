import os
import csv
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

def export_batch():
    print("Fetching first batch codes...")
    
    # Get the "First Batch — Sept 2026"
    from urllib.parse import quote
    label_encoded = quote("First Batch — Sept 2026")
    batch_res = supabase_request(f"auth_code_batches?label=eq.{label_encoded}&select=id,label")
    
    if not batch_res:
        print("Could not find the batch in the database.")
        return
        
    batch_id = batch_res[0]['id']
    
    # Get all products for mapping names
    products_res = supabase_request("products?select=id,name")
    product_map = {p['id']: p['name'] for p in products_res}
    
    # Fetch all codes for this batch
    all_codes = []
    page_size = 1000
    offset = 0
    
    while True:
        # Note: Range header is the proper way to paginate in PostgREST, but for simplicity we can use offset/limit query params
        codes_res = supabase_request(f"product_auth_codes?batch_id=eq.{batch_id}&select=code,product_id,created_at&limit={page_size}&offset={offset}")
        if not codes_res:
            break
        all_codes.extend(codes_res)
        offset += page_size
        if len(codes_res) < page_size:
            break
        
    if not all_codes:
        print("No codes found for this batch.")
        return
        
    print(f"Found {len(all_codes)} codes. Exporting to CSV...")
    
    # Write to CSV
    csv_file = "first_batch_codes.csv"
    with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["Code", "Product", "Generated At"])
        
        for row in all_codes:
            product_name = product_map.get(row['product_id'], "Unknown Product")
            writer.writerow([row['code'], product_name, row['created_at']])
            
    print(f"Successfully exported {len(all_codes)} codes to {csv_file}")

if __name__ == "__main__":
    export_batch()
