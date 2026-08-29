import os
import re

files = [
    'StackBuilder.jsx', 'LabScanner.jsx', 'ScienceLibrary.jsx',
    'WellnessQuiz.jsx', 'AboutUs.jsx', 'StoreLocator.jsx',
    'PartnerWithUs.jsx', 'VerifyProduct.jsx', 'TrackOrder.jsx', 'ProductCatalog.jsx'
]
base = r'c:\Users\pratham\Desktop\KENWELL\src\components'

for f in files:
    path = os.path.join(base, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to change it to:
    # import React[REST_OF_LINE]
    # import BackButton from './BackButton'
    
    bad_pattern = r"import React\nimport BackButton from '\./BackButton'(.*)"
    
    if re.search(bad_pattern, content):
        content = re.sub(bad_pattern, r"import React\1\nimport BackButton from './BackButton'", content)
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed imports in {f}')
