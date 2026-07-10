-- ============================================================
-- Kenwell — Rich Product Content Migration
-- Run in: Supabase Dashboard → SQL Editor
-- 
-- Populates series, form, servings, tagline, health_goals,
-- benefits, accent_color, how_to_use, nutritional_facts, and
-- science_text for every product so that /products/:slug
-- renders fully.
--
-- IMPORTANT: Adjust WHERE slug = '...' values to match what
-- is actually stored in your products table.
-- ============================================================


-- 1. KSM-66 Ashwagandha
UPDATE products SET
  series          = 'Core Series',
  form            = 'Capsules',
  servings        = 60,
  tagline         = 'Stress Resilience, Backed by Clinical Science',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Stress', 'Sleep', 'Energy', 'Immunity'],
  benefits        = ARRAY[
    'Reduces serum cortisol by up to 27% (KSM-66 clinical trials)',
    'Improves sleep quality and time to fall asleep',
    'Enhances VO2 max and muscular endurance',
    'Supports healthy thyroid function',
    'Modulates HPA axis for long-term stress resilience'
  ],
  how_to_use      = '{"dosage":"2 capsules (600 mg KSM-66) daily","timing":"Take with food — morning or evening. Consistent daily use for 4–8 weeks yields optimal results.","stacking":"Pairs well with Magnesium Glycinate (sleep synergy) and L-Theanine for daytime calm without sedation.","warnings":"Consult a physician if pregnant, nursing, or taking thyroid medications."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Capsules","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"KSM-66® Ashwagandha Root Extract","amount":"600 mg","dv":"**"},{"name":"  (Withania somnifera, 5% Withanolides)","amount":"","dv":""},{"name":"Black Pepper Extract (Piperine 95%)","amount":"5 mg","dv":"**"}]}'::jsonb,
  science_text    = 'KSM-66 is the world''s most clinically studied ashwagandha extract, produced without alcohol or chemical solvents. Standardized to ≥5% withanolides from root only.

Mechanism: Withanolides are steroidal lactones that modulate the Hypothalamic-Pituitary-Adrenal (HPA) axis. They suppress CRH production, reducing downstream cortisol secretion. Withanolides also demonstrate partial agonism at GABA-A receptors, producing anxiolytic effects without sedation.

Citations:
1. Chandrasekhar K, et al. (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of Ashwagandha root. Indian J Psychol Med. 34(3):255–262.
2. Wankhede S, et al. (2015). Examining the effect of Withania somnifera supplementation on muscle strength. J Int Soc Sports Nutr. 12:43.'
WHERE slug = 'ksm-66-ashwagandha';


-- 2. Magnesium Glycinate
UPDATE products SET
  series          = 'Core Series',
  form            = 'Tablets',
  servings        = 60,
  tagline         = 'Deep Sleep & Muscle Recovery, Fully Chelated',
  accent_color    = '#4A8B8C',
  health_goals    = ARRAY['Sleep', 'Stress', 'Heart', 'Joints'],
  benefits        = ARRAY[
    'Promotes deep, restorative REM sleep without next-day grogginess',
    'Reduces chronic muscle cramps and nighttime leg spasms',
    'Supports over 300 enzymatic reactions in the body',
    'Calms overactive neural firing via glycine neurotransmission',
    'Superior absorption vs. oxide/citrate — zero digestive distress'
  ],
  how_to_use      = '{"dosage":"2 tablets (400 mg elemental Magnesium) daily","timing":"Best taken 30–60 minutes before bed. Can be split: 200 mg morning + 200 mg evening.","stacking":"Synergizes with Vitamin D3 (magnesium activates D3 conversion) and Ashwagandha for sleep depth.","warnings":"High doses (>500 mg elemental) may cause loose stools. Start with 1 tablet and increase gradually."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Tablets","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Magnesium (as Bisglycinate Chelate)","amount":"400 mg","dv":"95%"},{"name":"  (TRAACS® Albion form)","amount":"","dv":""}]}'::jsonb,
  science_text    = 'Magnesium Bisglycinate is fully chelated — the magnesium ion is covalently bonded to two glycine molecules. This chelation shields the mineral from phytate interference and allows absorption via dipeptide channels (PepT1/PepT2) rather than standard mineral transporters.

Glycine itself is a major inhibitory neurotransmitter in the CNS, binding glycine receptors and NMDA-R co-agonist sites. Combined with magnesium''s role as a calcium channel blocker at NMDA receptors, this formula acts as a dual neurological calming agent.

Citations:
1. Abbasi B, et al. (2012). The effect of magnesium supplementation on primary insomnia in elderly. J Res Med Sci. 17(12):1161–1169.
2. Boyle NB, et al. (2017). The effects of magnesium supplementation on subjective anxiety and stress. Nutrients. 9(5):429.'
WHERE slug = 'magnesium-glycinate';


-- 3. Vitamin D3 + K2
UPDATE products SET
  series          = 'Core Series',
  form            = 'Softgels',
  servings        = 60,
  tagline         = 'Bone Density, Immune Power & Calcium Navigation',
  accent_color    = '#C9B99A',
  health_goals    = ARRAY['Immunity', 'Heart', 'Joints', 'Energy'],
  benefits        = ARRAY[
    'Optimises calcium absorption from the gut into the bloodstream',
    'K2 (MK-7) directs calcium to bones and teeth — not arteries',
    'Supports immune cell (T-cell & macrophage) activation via VDR',
    'Reduces risk of arterial calcification when combined with K2',
    'Improves mood and reduces seasonal affective symptoms'
  ],
  how_to_use      = '{"dosage":"1 softgel (5000 IU D3 + 100 mcg MK-7 K2) daily","timing":"Take with your fattiest meal of the day — D3 is fat-soluble and requires dietary fat for absorption.","stacking":"Essential with Magnesium (activates D3 hydroxylation) and Fish Oil (fat matrix improves D3 bioavailability).","warnings":"Do not exceed 10,000 IU D3 daily without physician guidance. Get serum 25(OH)D tested every 6 months."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Softgel","servingsPerContainer":"60","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Vitamin D3 (as Cholecalciferol)","amount":"5000 IU (125 mcg)","dv":"625%"},{"name":"Vitamin K2 (as Menaquinone-7, MK-7)","amount":"100 mcg","dv":"**"}]}'::jsonb,
  science_text    = 'Vitamin D3 (cholecalciferol) is hydroxylated in the liver to 25(OH)D, then again in the kidneys to the active 1,25(OH)2D (calcitriol). Calcitriol binds to the Vitamin D Receptor (VDR) — a nuclear transcription factor present in virtually every cell — upregulating over 200 genes involved in calcium transport and immune function.

Without K2 (long-chain MK-7), calcium mobilised by D3 can deposit in arterial walls. K2 activates osteocalcin (bones) and Matrix Gla Protein (arterial protection) via carboxylation, physically routing calcium to where it belongs.

Citations:
1. Holick MF. (2007). Vitamin D deficiency. N Engl J Med. 357:266–281.
2. Geleijnse JM, et al. (2004). Dietary intake of menaquinone is associated with a reduced risk of coronary heart disease. J Nutr. 134(11):3100–3105.'
WHERE slug = 'vitamin-d3-k2';


-- 4. Liposomal Glutathione
UPDATE products SET
  series          = 'Liposomal Series',
  form            = 'Softgels',
  servings        = 30,
  tagline         = 'Master Antioxidant — Direct Cellular Delivery',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Longevity', 'Immunity', 'Energy'],
  benefits        = ARRAY[
    'Neutralises reactive oxygen species (free radicals) directly',
    'Recycles Vitamin C and Vitamin E back to their active forms',
    'Principal Phase II liver detoxification agent — binds heavy metals',
    'Liposomal encapsulation protects against stomach acid degradation',
    'Supports skin clarity, even tone, and cellular anti-aging'
  ],
  how_to_use      = '{"dosage":"1 softgel (500 mg Reduced L-Glutathione) daily","timing":"Take on an empty stomach or 30 minutes before meals for maximum lymphatic absorption.","stacking":"Combine with Liposomal Vitamin C (regenerates oxidised glutathione) and NAC (supports endogenous glutathione synthesis).","warnings":"Generally very well tolerated. Rarely, some individuals experience mild bloating in the first week."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Softgel","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Reduced L-Glutathione (Liposomal)","amount":"500 mg","dv":"**"},{"name":"Phosphatidylcholine (from Non-GMO Sunflower)","amount":"200 mg","dv":"**"}]}'::jsonb,
  science_text    = 'Glutathione is a tripeptide (Glu-Cys-Gly) and the most abundant intracellular antioxidant. Standard oral supplementation fails because the enzyme gamma-glutamyltransferase (GGT) in the gut lumen rapidly hydrolyses the peptide bond.

Liposomal encapsulation solves this. Phospholipid vesicles protect glutathione through the GI tract and enable absorption via endocytosis, bypassing first-pass liver metabolism. Intracellular delivery increases plasma GSH by 3–5x versus standard oral forms.

Citations:
1. Sinha R, et al. (2018). Oral supplementation with liposomal glutathione elevates body stores of glutathione. Eur J Clin Nutr. 72:105–111.
2. Forman HJ, et al. (2009). Glutathione: Overview of its protective roles. Mol Aspects Med. 30(1–2):1–12.'
WHERE slug = 'liposomal-glutathione';


-- 5. Liposomal Vitamin C
UPDATE products SET
  series          = 'Liposomal Series',
  form            = 'Softgels',
  servings        = 30,
  tagline         = '5x Higher Bioavailability, Zero GI Distress',
  accent_color    = '#B89F70',
  health_goals    = ARRAY['Immunity', 'Longevity', 'Energy'],
  benefits        = ARRAY[
    'Up to 5x higher plasma concentration vs standard ascorbic acid',
    'Zero gastrointestinal upset — no osmotic laxative effect',
    'Regenerates glutathione and Vitamin E to their active forms',
    'Essential cofactor for collagen synthesis (Type I and III)',
    'Powerful immune modulator — enhances neutrophil and NK cell activity'
  ],
  how_to_use      = '{"dosage":"1–2 softgels (500–1000 mg Vitamin C) daily","timing":"Can be taken with or without food. Unlike ascorbic acid, liposomal C does not require food to buffer GI effects.","stacking":"Stack with Glutathione (C regenerates GSH), Zinc (synergistic immune support), and Collagen for skin and connective tissue.","warnings":"At very high doses (>2g), monitor oxalate levels if prone to kidney stones."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Softgel","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Vitamin C (as Sodium Ascorbate, Liposomal)","amount":"500 mg","dv":"556%"},{"name":"Phosphatidylcholine (from Non-GMO Sunflower)","amount":"200 mg","dv":"**"}]}'::jsonb,
  science_text    = 'Standard Vitamin C relies on Sodium-Dependent Vitamin C Transporters (SVCT-1) in the small intestine. These saturate at ~200 mg per dose and are bypassed entirely by liposomal encapsulation. The phospholipid vesicle is absorbed through the intestinal wall via endocytosis and enters the lymphatic system directly, bypassing first-pass liver metabolism.

Citations:
1. Hickey S, et al. (2008). Pharmacokinetics of oral vitamin C. J Nutr Environ Med. 17(3):169–177.
2. Carr AC & Maggini S. (2017). Vitamin C and Immune Function. Nutrients. 9(11):1211.'
WHERE slug = 'liposomal-vitamin-c';


-- 6. NAD+
UPDATE products SET
  series          = 'Liposomal Series',
  form            = 'Capsules',
  servings        = 30,
  tagline         = 'Cellular Energy Restoration & Longevity Activation',
  accent_color    = '#4A8B8C',
  health_goals    = ARRAY['Longevity', 'Energy'],
  benefits        = ARRAY[
    'Replenishes NAD+ pools that decline ~50% by age 40',
    'Activates SIRT1/SIRT3 longevity sirtuins for DNA repair',
    'Boosts mitochondrial biogenesis and ATP production',
    'Supports healthy circadian rhythm and metabolic efficiency',
    'Reduces neurological fatigue and supports cognitive clarity'
  ],
  how_to_use      = '{"dosage":"1 capsule (500 mg NMN) daily","timing":"Take in the morning on an empty stomach. NAD+ metabolism is tightly linked to circadian rhythms — morning dosing aligns with peak NAD+ biosynthesis.","stacking":"Pairs powerfully with Resveratrol (activates SIRT1 synergistically) and CoQ10 for mitochondrial support.","warnings":"Generally very well tolerated. A small subset may experience mild flushing. Not recommended during pregnancy."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Nicotinamide Mononucleotide (NMN)","amount":"500 mg","dv":"**"},{"name":"Resveratrol (Trans-Resveratrol 98%)","amount":"50 mg","dv":"**"}]}'::jsonb,
  science_text    = 'NAD+ (Nicotinamide Adenine Dinucleotide) is the central redox coenzyme of cellular respiration and a substrate for longevity enzymes called sirtuins (SIRT1–7). NAD+ levels decline ~1–2% per year after age 30 due to increased CD38 enzyme activity driven by chronic inflammation.

NMN is a direct precursor that enters the NAD+ salvage pathway via the enzyme NRK1. Studies in aged mice have shown dramatic restoration of vascular function, mitochondrial density, and metabolic capacity upon NMN supplementation.

Citations:
1. Mills KF, et al. (2016). Long-term administration of NMN mitigates age-associated physiological decline in mice. Cell Metab. 24(6):795–806.
2. Yoshino J, et al. (2021). NMN increases muscle insulin sensitivity in prediabetic women. Science. 372(6547):1224–1229.'
WHERE slug = 'nad-plus';


-- 7. Fish Oil (Omega-3)
UPDATE products SET
  series          = 'Core Series',
  form            = 'Softgels',
  servings        = 60,
  tagline         = 'Clinically Dosed EPA & DHA for Heart & Brain',
  accent_color    = '#4A8B8C',
  health_goals    = ARRAY['Heart', 'Joints', 'Energy', 'Immunity'],
  benefits        = ARRAY[
    'Reduces triglyceride levels by up to 30% at clinical doses',
    'Systemic anti-inflammatory via prostaglandin E3 and resolvin pathways',
    'DHA supports neuronal membrane fluidity and cognitive function',
    'Reduces joint stiffness and morning pain in inflammatory arthritis',
    'Molecularly distilled — verified below 0.1 ppm mercury'
  ],
  how_to_use      = '{"dosage":"2 softgels (1500 mg EPA + 1000 mg DHA) daily","timing":"Take with the largest meal of the day to minimise fishy aftertaste and maximise fat-soluble absorption.","stacking":"Combines with Vitamin D3 (fat matrix improves D3 absorption), CoQ10, and Curcumin for a complete anti-inflammatory protocol.","warnings":"High-dose omega-3 (>3g/day) may modestly prolong bleeding time. Inform your physician if on blood thinners."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Softgels","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Fish Oil Concentrate (Triglyceride form)","amount":"2800 mg","dv":"**"},{"name":"  EPA (Eicosapentaenoic Acid)","amount":"1500 mg","dv":"**"},{"name":"  DHA (Docosahexaenoic Acid)","amount":"1000 mg","dv":"**"},{"name":"Vitamin E (as d-alpha-Tocopherol)","amount":"10 IU","dv":"67%"}]}'::jsonb,
  science_text    = 'EPA and DHA are incorporated into cell membrane phospholipids, competing with arachidonic acid (AA) for COX and LOX enzymes. This shifts eicosanoid production from pro-inflammatory Series 2 prostaglandins to anti-inflammatory Series 3 prostaglandins. DHA is additionally converted to resolvins and protectins, which actively resolve inflammation.

The triglyceride (TG) form has ~70% better absorption than the cheaper ethyl ester form. Molecular distillation ensures PCBs, dioxins, and heavy metals are removed to pharmaceutical-grade purity.

Citations:
1. Skulas-Ray AC, et al. (2019). Omega-3 Fatty Acids for the Management of Hypertriglyceridemia. Circulation. 140(12):e673–e691.
2. Calder PC. (2015). Marine omega-3 fatty acids and inflammatory processes. Biochim Biophys Acta. 1851(4):469–484.'
WHERE slug = 'fish-oil-omega-3';


-- 8. Berberine HCL
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Capsules',
  servings        = 60,
  tagline         = 'Nature''s Metabolic Switch — AMPK Activation',
  accent_color    = '#B89F70',
  health_goals    = ARRAY['Longevity', 'Energy', 'Gut Health'],
  benefits        = ARRAY[
    'Activates AMPK — the metabolic master switch in every cell',
    'Clinically shown to lower fasting blood glucose and HbA1c',
    'Inhibits hepatic gluconeogenesis (reduces liver glucose output)',
    'Improves insulin sensitivity comparable to Metformin in trials',
    'Positive modulation of the gut microbiome composition'
  ],
  how_to_use      = '{"dosage":"1 capsule (500 mg Berberine HCL) 2–3x daily","timing":"Take 15–30 minutes before main meals. This blunts post-meal glucose spikes most effectively.","stacking":"Combine with Milk Thistle (berberine is hepatically metabolised — liver support is wise) and Probiotics for microbiome synergy.","warnings":"Berberine can interact with CYP3A4-metabolised medications. Consult a physician if on prescription drugs. Not for use during pregnancy."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"60","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Berberine HCL (from Berberis aristata root)","amount":"500 mg","dv":"**"},{"name":"Black Pepper Extract (Piperine 95%)","amount":"5 mg","dv":"**"}]}'::jsonb,
  science_text    = 'Berberine is a benzylisoquinoline alkaloid whose primary mechanism is activation of AMP-Activated Protein Kinase (AMPK). AMPK activation triggers: (1) increased GLUT4 translocation to muscle membranes (glucose uptake), (2) inhibition of mTOR (reduces hepatic lipogenesis), and (3) suppression of PEPCK and G6Pase enzymes (lowers hepatic glucose output).

A landmark 2008 meta-analysis showed berberine performed comparably to Metformin (500 mg TID) for HbA1c reduction in T2D patients, without the GI side effects.

Citations:
1. Yin J, et al. (2008). Efficacy of berberine in patients with type 2 diabetes mellitus. Metabolism. 57(5):712–717.
2. Pirillo A & Catapano AL. (2015). Berberine, a plant alkaloid with lipid and glucose lowering properties. Atherosclerosis. 243(2):449–461.'
WHERE slug = 'berberine-hcl';


-- 9. CoQ10 (Ubiquinol)
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Softgels',
  servings        = 30,
  tagline         = 'Mitochondrial Fuel for Heart, Brain & Muscle',
  accent_color    = '#C9B99A',
  health_goals    = ARRAY['Energy', 'Heart', 'Longevity'],
  benefits        = ARRAY[
    'Fuels ATP production in the mitochondrial electron transport chain',
    'Potent lipid-soluble antioxidant — protects cell membranes from peroxidation',
    'Replenishes CoQ10 depleted by statin medications',
    'Reduces markers of oxidative stress in cardiovascular disease',
    'Ubiquinol form (active) — 3x more bioavailable than ubiquinone'
  ],
  how_to_use      = '{"dosage":"1 softgel (200 mg Ubiquinol CoQ10) daily","timing":"Take with your fattiest meal — CoQ10 is highly lipophilic and requires dietary fat for absorption.","stacking":"Essential pairing with Omega-3 Fish Oil (fat matrix) and PQQ for mitochondrial biogenesis. Statin users should prioritise this supplement.","warnings":"May modestly lower blood pressure. Monitor if on antihypertensive medications."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Softgel","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Ubiquinol (Active CoQ10, Kaneka QH™)","amount":"200 mg","dv":"**"},{"name":"Medium Chain Triglyceride Oil (carrier)","amount":"300 mg","dv":"**"}]}'::jsonb,
  science_text    = 'CoQ10 shuttles electrons between Complex I/II and Complex III of the mitochondrial electron transport chain (ETC), enabling the proton gradient that drives ATP synthase. Ubiquinol is 3x more bioavailable than ubiquinone in clinical pharmacokinetic studies.

Statins (HMG-CoA reductase inhibitors) block the mevalonate pathway — the same pathway used to synthesise both cholesterol and CoQ10 — making statin users especially prone to CoQ10 depletion and resulting myopathy.

Citations:
1. Langsjoen PH & Langsjoen AM. (2014). Comparison study of plasma CoQ10 levels: ubiquinol versus ubiquinone. Clin Pharmacol Drug Dev. 3(1):13–17.
2. Mortensen SA, et al. (2014). The effect of CoQ10 on morbidity and mortality in chronic heart failure. JACC Heart Fail. 2(6):641–649.'
WHERE slug = 'coq10-ubiquinol';


-- 10. NAC
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Capsules',
  servings        = 60,
  tagline         = 'Glutathione Precursor & Respiratory Support',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Longevity', 'Immunity', 'Gut Health'],
  benefits        = ARRAY[
    'Rate-limiting precursor for endogenous glutathione synthesis',
    'Breaks down mucus disulfide bonds — supports lung and airway health',
    'Powerfully attenuates acetaminophen-induced hepatotoxicity',
    'Reduces inflammatory cytokine expression (IL-6, TNF-α)',
    'Supports OCD symptom management via glutamate modulation'
  ],
  how_to_use      = '{"dosage":"1–2 capsules (600–1200 mg NAC) daily","timing":"Take with food to reduce nausea. Can be taken in the morning or split morning/evening.","stacking":"Combine with Liposomal Glutathione (direct + precursor synergy), Vitamin C (recycles GSH), and Selenium (GSH peroxidase cofactor).","warnings":"High doses may interfere with nitric oxide signalling. Not recommended with nitroglycerin medications. Consult a physician if asthmatic."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"60","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"N-Acetyl-L-Cysteine (NAC)","amount":"600 mg","dv":"**"}]}'::jsonb,
  science_text    = 'N-Acetyl Cysteine is the acetylated, stable form of L-Cysteine. Cysteine is the rate-limiting amino acid in the biosynthesis of glutathione. By reliably elevating intracellular cysteine availability, NAC increases the activity of Glutamate-Cysteine Ligase (GCL) — the first and rate-limiting step in GSH synthesis.

Beyond glutathione, NAC directly reduces disulfide bonds in mucus glycoproteins, making it a standard mucolytic agent. Its anti-inflammatory effects are mediated via NF-κB pathway inhibition.

Citations:
1. Mokhtari V, et al. (2017). A Review on Various Uses of N-Acetyl Cysteine. Cell J. 19(1):11–17.
2. Kerksick C & Willoughby D. (2005). The Antioxidant Role of Glutathione and N-Acetyl-Cysteine. J Int Soc Sports Nutr. 2(2):38–44.'
WHERE slug = 'nac';


-- 11. TUDCA
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Capsules',
  servings        = 30,
  tagline         = 'Advanced Liver & Bile Acid Protection',
  accent_color    = '#B89F70',
  health_goals    = ARRAY['Gut Health', 'Longevity'],
  benefits        = ARRAY[
    'Dilutes toxic hydrophobic bile acid pool, protecting hepatocytes',
    'Prevents endoplasmic reticulum (ER) stress-induced apoptosis in liver cells',
    'Promotes healthy bile flow and gallbladder motility',
    'Neuroprotective — reduces ER stress in dopaminergic neurons',
    'Clinically used in primary biliary cholangitis treatment'
  ],
  how_to_use      = '{"dosage":"1 capsule (500 mg TUDCA) daily","timing":"Take 30 minutes before a meal containing fat, as this stimulates bile secretion and TUDCA can work in synergy.","stacking":"Combine with Milk Thistle (complementary liver support) and NAC for a comprehensive liver protocol.","warnings":"Use cautiously if you have complete bile duct obstruction. Consult a hepatologist before use if diagnosed with liver disease."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Tauroursodeoxycholic Acid (TUDCA)","amount":"500 mg","dv":"**"}]}'::jsonb,
  science_text    = 'TUDCA (Tauroursodeoxycholic Acid) is a hydrophilic bile acid — the taurine conjugate of ursodeoxycholic acid (UDCA). Unlike primary bile acids which are cytotoxic at high concentrations, TUDCA inserts into bile acid micelles, reducing their detergent-like toxicity to hepatocyte membranes.

TUDCA''s primary cytoprotective mechanism is inhibition of the intrinsic mitochondrial apoptosis pathway triggered by toxic bile acid accumulation. It also inhibits Unfolded Protein Response (UPR) signalling in the ER — relevant in both liver and neurodegenerative disease contexts.

Citations:
1. Beuers U. (2006). Drug insight: mechanisms and sites of action of ursodeoxycholic acid in cholestasis. Nat Clin Pract Gastroenterol Hepatol. 3(6):318–328.
2. Amaral JD, et al. (2009). The role of p53 in apoptosis. Discov Med. 9(45):145–152.'
WHERE slug = 'tudca';


-- 12. Milk Thistle
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Capsules',
  servings        = 60,
  tagline         = 'Liver Regeneration & Detox Pathway Support',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Gut Health', 'Longevity', 'Immunity'],
  benefits        = ARRAY[
    'Silymarin acts as a direct antioxidant in hepatic tissue',
    'Stimulates hepatocyte regeneration via ribosomal RNA synthesis',
    'Blocks toxin entry into liver cells by competing for membrane receptors',
    'Anti-fibrotic — reduces stellate cell activation and collagen deposition',
    'Supports Phase I & II liver detoxification enzyme activity'
  ],
  how_to_use      = '{"dosage":"1–2 capsules (175–350 mg Silymarin 80%) daily","timing":"Take with meals. Silymarin absorption is enhanced with food and modestly improved with lipids.","stacking":"Best combined with TUDCA (complementary mechanisms), NAC, and Alpha Lipoic Acid for a complete liver defence protocol.","warnings":"May modestly lower blood sugar levels — monitor if diabetic. Rarely causes mild GI upset."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"60","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Milk Thistle Extract (Silybum marianum)","amount":"350 mg","dv":"**"},{"name":"  Standardised to 80% Silymarin","amount":"280 mg","dv":"**"}]}'::jsonb,
  science_text    = 'Silymarin is a flavonolignan complex extracted from Silybum marianum seeds, composed primarily of silybin A, silybin B, silydianin, and silychristin. Its hepatoprotective mechanisms are multi-modal: (1) direct free radical scavenging, (2) stimulation of hepatocyte protein synthesis via RNA polymerase I, (3) blocking membrane receptors used by hepatotoxins, and (4) reducing hepatic stellate cell (HSC) activation to prevent fibrosis.

Citations:
1. Abenavoli L, et al. (2010). Milk thistle in liver diseases. Phytother Res. 24(10):1423–1432.
2. Federico A, et al. (2017). Silymarin/Silybin and chronic liver disease. Molecules. 22(2):191.'
WHERE slug = 'milk-thistle';


-- 13. Zinc + Magnesium (ZMA)
UPDATE products SET
  series          = 'Core Series',
  form            = 'Capsules',
  servings        = 60,
  tagline         = 'Anabolic Mineral Stack for Recovery & Testosterone',
  accent_color    = '#4A8B8C',
  health_goals    = ARRAY['Energy', 'Sleep', 'Immunity', 'Joints'],
  benefits        = ARRAY[
    'Zinc is essential for testosterone biosynthesis and spermatogenesis',
    'Magnesium supports deep sleep and overnight muscle protein synthesis',
    'Boosts immune cell (T-lymphocyte) proliferation and function',
    'Zinc is a cofactor for >300 enzymatic reactions',
    'Replenishes minerals heavily depleted by sweat in athletes'
  ],
  how_to_use      = '{"dosage":"2 capsules (Zinc 30 mg + Magnesium 450 mg) nightly","timing":"Take 30–60 minutes before bed on an empty stomach. Food (especially calcium-rich) significantly reduces zinc absorption.","stacking":"Classic stack with Vitamin D3 (zinc supports VDR signalling) and Ashwagandha for testosterone and sleep depth synergy.","warnings":"Long-term zinc supplementation above 40 mg/day can deplete copper. Supplement with 1 mg copper per 10 mg zinc if using long-term."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Capsules","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Zinc (as Zinc Picolinate)","amount":"30 mg","dv":"273%"},{"name":"Magnesium (as Magnesium Aspartate)","amount":"450 mg","dv":"107%"},{"name":"Vitamin B6 (as Pyridoxine HCL)","amount":"10.5 mg","dv":"613%"}]}'::jsonb,
  science_text    = 'Zinc picolinate is the most bioavailable organic zinc form, with picolinic acid acting as a potent chelating ligand that facilitates zinc transport across the intestinal epithelium. Zinc''s role in testosterone synthesis is well-documented: it is a cofactor for 17β-hydroxysteroid dehydrogenase, the enzyme that converts androstenedione to testosterone.

Magnesium (as aspartate) supports the deep sleep stages critical for overnight GH pulse secretion and protein synthesis.

Citations:
1. Brilla LR & Conte V. (2000). Effects of a Novel ZMA Formulation on Hormones and Strength. J Exerc Physiol Online. 3(4).
2. Prasad AS. (2008). Zinc in Human Health: Effect of Zinc on Immune Cells. Mol Med. 14(5–6):353–357.'
WHERE slug = 'zinc-magnesium';


-- 14. Multivitamin
UPDATE products SET
  series          = 'Core Series',
  form            = 'Tablets',
  servings        = 30,
  tagline         = 'Complete Daily Micronutrient Foundation',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Immunity', 'Energy', 'Longevity'],
  benefits        = ARRAY[
    'Complete A-Z micronutrient coverage in bioavailable forms',
    'Uses chelated minerals — glycinate, picolinate — not inorganic oxides',
    'Activated B-vitamins (methylfolate, methylcobalamin) — MTHFR-safe',
    'Zero artificial colours, sweeteners, or proprietary blends',
    'Full label disclosure of every ingredient and its exact dose'
  ],
  how_to_use      = '{"dosage":"2 tablets daily","timing":"Take with breakfast. B-vitamins (especially B6 and niacin) can cause mild nausea on an empty stomach.","stacking":"Use as the foundation of any stack. Does not replace high-dose therapeutic supplements like D3, Omega-3, or Magnesium — those require separate, targeted dosing.","warnings":"Contains iron — do not take alongside calcium supplements. Take 2+ hours apart."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Tablets","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Vitamin A (as beta-Carotene)","amount":"900 mcg RAE","dv":"100%"},{"name":"Vitamin C (as Ascorbic Acid)","amount":"90 mg","dv":"100%"},{"name":"Vitamin D3 (as Cholecalciferol)","amount":"2000 IU","dv":"250%"},{"name":"Vitamin E (as d-alpha-Tocopherol)","amount":"15 mg","dv":"100%"},{"name":"Vitamin K2 (as MK-7)","amount":"80 mcg","dv":"**"},{"name":"Folate (as 5-MTHF)","amount":"400 mcg DFE","dv":"100%"},{"name":"Vitamin B12 (as Methylcobalamin)","amount":"2.4 mcg","dv":"100%"},{"name":"Zinc (as Zinc Picolinate)","amount":"11 mg","dv":"100%"},{"name":"Magnesium (as Bisglycinate)","amount":"100 mg","dv":"24%"}]}'::jsonb,
  science_text    = 'Most multivitamins use cheap inorganic mineral salts and synthetic folic acid (which requires MTHFR enzyme conversion — dysfunctional in ~40% of the population). Kenwell''s multivitamin uses: (1) methylfolate (5-MTHF) — the active form, bypassing MTHFR, (2) methylcobalamin — the active B12 form with better CNS penetration, and (3) organic mineral chelates for all zinc and magnesium.

Citations:
1. Bailey RL, et al. (2015). Dietary supplement use in the United States. J Nutr. 141(2):261–266.
2. Scaglione F & Panzavolta G. (2014). Folate, folic acid and 5-methyltetrahydrofolate. Xenobiotica. 44(5):480–488.'
WHERE slug = 'multivitamin';


-- 15. Probiotics
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Capsules',
  servings        = 30,
  tagline         = '50 Billion CFU — Gut Microbiome Restoration',
  accent_color    = '#7A8C5A',
  health_goals    = ARRAY['Gut Health', 'Immunity', 'Energy'],
  benefits        = ARRAY[
    '50 Billion CFU across 10 clinically validated strains',
    'Acid-resistant delayed-release capsule — survives stomach passage',
    'Restores microbiome diversity after antibiotics or dysbiosis',
    'Reduces bloating, IBS symptoms, and intestinal permeability',
    'Supports serotonin production via the gut-brain axis'
  ],
  how_to_use      = '{"dosage":"1 capsule (50 Billion CFU) daily","timing":"Take on an empty stomach 15–30 minutes before breakfast. Stomach acid is lowest before eating, maximising live bacterial survival.","stacking":"Use with a Prebiotic fibre supplement (inulin, FOS) to feed the probiotics. Berberine users should separate probiotic dose by 3+ hours.","warnings":"Store in a cool, dry place (refrigeration extends shelf life). Immunocompromised individuals should consult a physician before using high-CFU probiotics."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Capsule","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Probiotic Blend (50 Billion CFU)","amount":"500 mg","dv":"**"},{"name":"  L. acidophilus NCFM","amount":"","dv":""},{"name":"  L. rhamnosus GG","amount":"","dv":""},{"name":"  B. longum BB536","amount":"","dv":""},{"name":"  L. plantarum 299v","amount":"","dv":""},{"name":"  + 6 additional strains","amount":"","dv":""},{"name":"FOS Prebiotic (Fructooligosaccharides)","amount":"100 mg","dv":"**"}]}'::jsonb,
  science_text    = 'The gut microbiome contains ~38 trillion microbial cells. These microbes produce short-chain fatty acids (SCFAs: butyrate, propionate, acetate) which are the primary energy source for colonocytes and exert systemic anti-inflammatory effects via GPR41/43 receptor activation.

L. rhamnosus GG is among the most extensively studied probiotic strains for antibiotic-associated diarrhoea and IBS. The FOS prebiotic included in this formula selectively feeds Bifidobacterium species.

Citations:
1. Hill C, et al. (2014). The International Scientific Association for Probiotics and Prebiotics consensus. Nat Rev Gastroenterol Hepatol. 11:506–514.
2. Cryan JF, et al. (2019). The Microbiota-Gut-Brain Axis. Physiol Rev. 99(4):1877–2013.'
WHERE slug = 'probiotics';


-- 16. Melatonin
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Tablets',
  servings        = 60,
  tagline         = 'Circadian Reset — Non-Habit-Forming Sleep Onset',
  accent_color    = '#4A8B8C',
  health_goals    = ARRAY['Sleep', 'Longevity'],
  benefits        = ARRAY[
    'Signals the suprachiasmatic nucleus (SCN) to initiate sleep onset',
    'Non-habit-forming — does not suppress endogenous melatonin production',
    'Resets circadian rhythm disrupted by shift work or jet lag',
    'Powerful antioxidant — protects mitochondrial DNA from oxidative damage',
    'Low 0.5 mg dose matches physiological nocturnal levels — more effective than 10 mg'
  ],
  how_to_use      = '{"dosage":"1 tablet (0.5 mg) 30–60 minutes before target sleep time","timing":"Dim lights 1 hour before bed for maximum effect. Blue light exposure after melatonin supplementation blunts its efficacy.","stacking":"Combine with Magnesium Glycinate (deep sleep architecture) and Ashwagandha (reduced cortisol) for a comprehensive sleep protocol.","warnings":"Do not use while driving or operating machinery. Avoid combining with sedative medications or alcohol without physician guidance."}'::jsonb,
  nutritional_facts = '{"servingSize":"1 Tablet","servingsPerContainer":"60","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Melatonin (N-acetyl-5-methoxytryptamine)","amount":"0.5 mg","dv":"**"}]}'::jsonb,
  science_text    = 'Melatonin is produced by the pineal gland from serotonin and its secretion is driven by darkness — specifically the absence of ipRGC (intrinsically photosensitive retinal ganglion cell) activation. It binds MT1 and MT2 receptors in the suprachiasmatic nucleus (SCN), suppressing the wake signal and enabling physiological sleep onset.

Research from MIT (Wurtman, 2001) showed 0.3–0.5 mg is as effective as 3 mg for sleep onset and significantly more effective than 10 mg, with far fewer morning-after sequelae.

Citations:
1. Brzezinski A. (1997). Melatonin in humans. N Engl J Med. 336(3):186–195.
2. Zhdanova IV, et al. (2001). Melatonin treatment for age-related insomnia. J Clin Endocrinol Metab. 86(10):4727–4730.'
WHERE slug = 'melatonin';


-- 17. Joint Support Complex
UPDATE products SET
  series          = 'Wellness Series',
  form            = 'Tablets',
  servings        = 30,
  tagline         = 'Clinical Cartilage Repair & Inflammation Control',
  accent_color    = '#B89F70',
  health_goals    = ARRAY['Joints', 'Heart', 'Immunity'],
  benefits        = ARRAY[
    'Glucosamine stimulates chondrocyte synthesis of cartilage matrix',
    'Chondroitin inhibits enzymes that degrade cartilage (aggrecanase)',
    'UC-II® (undenatured collagen type II) modulates joint immune response',
    'Boswellia (AKBA fraction) inhibits 5-LOX inflammatory enzyme',
    'Clinically shown to reduce WOMAC joint pain scores in OA patients'
  ],
  how_to_use      = '{"dosage":"2 tablets (Glucosamine 1500 mg + Chondroitin 1200 mg) daily","timing":"Take with food to reduce GI upset. Allow 6–12 weeks of consistent use — cartilage metabolism is slow.","stacking":"Combine with Omega-3 Fish Oil (reduces joint inflammation at the prostaglandin level) and Vitamin D3 (supports chondrocyte function).","warnings":"Glucosamine is derived from shellfish chitin — do not use if you have a shellfish allergy."}'::jsonb,
  nutritional_facts = '{"servingSize":"2 Tablets","servingsPerContainer":"30","headers":["Amount Per Serving","% RDA"],"ingredients":[{"name":"Glucosamine Sulphate (from shellfish)","amount":"1500 mg","dv":"**"},{"name":"Chondroitin Sulphate (bovine)","amount":"1200 mg","dv":"**"},{"name":"UC-II® Undenatured Collagen Type II","amount":"40 mg","dv":"**"},{"name":"Boswellia Serrata Extract (65% AKBA)","amount":"200 mg","dv":"**"},{"name":"Manganese (as Manganese Sulphate)","amount":"2 mg","dv":"87%"}]}'::jsonb,
  science_text    = 'Cartilage has no blood supply — its chondrocytes rely on diffusion for nutrients. Glucosamine sulphate is a direct substrate for glycosaminoglycan (GAG) synthesis — the structural polymer that gives cartilage its shock-absorbing and lubricating properties. Chondroitin sulphate inhibits aggrecanase and matrix metalloproteinase (MMP) activity, preventing enzymatic cartilage breakdown.

UC-II (undenatured Type II collagen) works via oral tolerisation — gut-associated lymphoid tissue (GALT) recognises the undenatured collagen and redirects the immune response away from self-attack on cartilage collagen, reducing autoimmune-mediated joint inflammation.

Citations:
1. Clegg DO, et al. (2006). Glucosamine, chondroitin sulfate, and the two in combination for painful knee osteoarthritis. N Engl J Med. 354(8):795–808.
2. Crowley DC, et al. (2009). Safety and efficacy of undenatured type II collagen in OA. Int J Med Sci. 6(6):312–321.'
WHERE slug = 'joint-support';
