// Kenwell Nutraceutical Wellness Brand - Product & Article Database

export const PRODUCTS = [
  {
    id: 1,
    name: "Multivitamin with Probiotics",
    slug: "multivitamin-with-probiotics",
    series: "Core Series",
    form: "Tablets",
    price: 799,
    servings: 30,
    tagline: "Daily wellness for mind and body.",
    description: "A premium daily multivitamin featuring 24 essential vitamins and minerals combined with a 5-billion CFU clinically-studied probiotic blend to support gut health, immunity, and overall vitality.",
    healthGoals: ["Immunity", "Energy", "Gut Health", "Longevity"],
    benefits: ["Complete micronutrient profile", "Enhances digestion & nutrient absorption", "Boosts daily cellular energy"],
    image: "https://ik.imagekit.io/kenwell/products/multivitamin-with-probiotics.jpg",
    accentColor: "#7A8C5A",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "In the morning, preferably with breakfast or a fat-containing meal to maximize absorption.",
      stacking: "Combine with Single or Triple Strength Fish Oil for a foundation core stack.",
      warnings: "Keep out of reach of children. Consult your doctor if pregnant or nursing."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Vitamin A (as Beta-Carotene)", amount: "3000 mcg", dv: "100%" },
        { name: "Vitamin C (as Ascorbic Acid)", amount: "120 mg", dv: "133%" },
        { name: "Vitamin D3 (as Cholecalciferol)", amount: "20 mcg (800 IU)", dv: "100%" },
        { name: "Vitamin E (as d-alpha tocopherol)", amount: "15 mg", dv: "100%" },
        { name: "Vitamin B1 (Thiamine)", amount: "1.4 mg", dv: "100%" },
        { name: "Vitamin B2 (Riboflavin)", amount: "1.6 mg", dv: "100%" },
        { name: "Vitamin B6 (Pyridoxine HCl)", amount: "2.0 mg", dv: "100%" },
        { name: "Vitamin B12 (Methylcobalamin)", amount: "2.2 mcg", dv: "100%" },
        { name: "Zinc (as Zinc Picolinate)", amount: "12 mg", dv: "100%" },
        { name: "L. acidophilus & B. lactis Blend", amount: "5 Billion CFU", dv: "**" }
      ]
    },
    scienceText: `Daily multivitamin supplementation provides a baseline level of essential micronutrients to support biological processes that may be deficient in modern diets. Our formula integrates probiotics to optimize gut flora, which is directly linked to the immune system. Studies show that a healthy microbiome enhances the absorption of vitamins and minerals in the small intestine.

Citations:
1. Marra, M. V., et al. (2018). Multi-vitamin and mineral supplementation in wellness optimization. Journal of Dietary Supplements, 15(4), 482-491.
2. Kechagia, M., et al. (2013). Health benefits of probiotics: a review. International Journal of Molecular Sciences, 14(1), 1952-1974.`
  },
  {
    id: 2,
    name: "Chelated Magnesium Glycinate",
    slug: "chelated-magnesium-glycinate",
    series: "Core Series",
    form: "Tablets",
    price: 699,
    servings: 30,
    tagline: "Muscle, nerve, and relaxation support.",
    description: "Highly bioavailable, fully chelated magnesium glycinate designed for optimal cellular absorption without digestive discomfort. Supports muscle recovery, sleep, and stress response.",
    healthGoals: ["Sleep", "Stress", "Joints", "Energy"],
    benefits: ["Gentle on the stomach with zero laxative effect", "Supports deep REM sleep and muscle relaxation", "Promotes nervous system recovery"],
    image: "https://ik.imagekit.io/kenwell/products/chelated-magnesium-glycinate.jpg",
    accentColor: "#7A8C5A",
    howToUse: {
      dosage: "Take 2 tablets daily",
      timing: "Best taken 30-60 minutes before bed to promote relaxation and sleep quality.",
      stacking: "Stack with L-Theanine and Melatonin for ultimate sleep support.",
      warnings: "Consult a healthcare provider if you have kidney disease."
    },
    nutritionalFacts: {
      servingSize: "2 Tablets",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Magnesium (as fully chelated Magnesium Glycinate)", amount: "400 mg", dv: "95%" },
        { name: "Glycine (amino acid bound to magnesium)", amount: "2000 mg", dv: "**" },
        { name: "Black Pepper Extract (BioPerine)", amount: "5 mg", dv: "**" }
      ]
    },
    scienceText: `Magnesium glycinate is a highly bioavailable organic salt of magnesium. Unlike inorganic forms (such as magnesium oxide or magnesium sulfate) which exhibit absorption rates of less than 4% and often cause osmotic diarrhea, magnesium glycinate is absorbed as a dipeptide in the intestinal mucosa.

This bypasses competitive mineral transport pathways, resulting in significantly higher tissue levels. Clinically, magnesium functions as a cofactor in over 300 enzymatic reactions, including those governing ATP production, DNA repair, and neuromuscular transmission. Glycine, the amino acid ligand, act as an inhibitory neurotransmitter in the central nervous system, binding to NMDA receptors and promoting anxiolytic and sedative effects that promote sleep latency and architecture.

Citations:
1. Abbasi, B., et al. (2012). The effect of magnesium supplementation on primary insomnia in elderly. Journal of Research in Medical Sciences, 17(12), 1161-1169.
2. Coudray, C., et al. (2005). Study of magnesium bioavailability from ten organic and inorganic magnesium salts. Magnesium Research, 18(4), 215-223.`
  },
  {
    id: 3,
    name: "Vitamin D3 + K2 + Calcium",
    slug: "vitamin-d3-k2-calcium",
    series: "Wellness Series",
    form: "Tablets",
    price: 649,
    servings: 30,
    tagline: "Synergistic bone and cardiovascular support.",
    description: "A synergistic combination of high-potency Vitamin D3, trans-MK7 Vitamin K2, and Calcium. Ensures calcium is absorbed efficiently and directed to the bones, rather than arterial walls.",
    healthGoals: ["Immunity", "Joints", "Heart", "Longevity"],
    benefits: ["Directs calcium to bones and teeth", "Supports arterial flexibility and blood flow", "Enhances innate and adaptive immune health"],
    image: "https://ik.imagekit.io/kenwell/products/vitamin-d3-k2-calcium.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Take with a fat-rich meal to maximize the absorption of fat-soluble D3 and K2.",
      stacking: "Pairs perfectly with Kenwell's Magnesium Glycinate for complete bone density support.",
      warnings: "If taking blood-thinning medications (like warfarin), consult your doctor before using."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Vitamin D3 (as Cholecalciferol)", amount: "125 mcg (5000 IU)", dv: "625%" },
        { name: "Vitamin K2 (as trans-Menaquinone-7)", amount: "100 mcg", dv: "83%" },
        { name: "Calcium (as Calcium Citrate Malate)", amount: "500 mg", dv: "38%" }
      ]
    },
    scienceText: `Vitamin D3 and Vitamin K2 work in tandem to regulate calcium metabolism. Vitamin D3 stimulates the synthesis of osteocalcin and matrix Gla protein (MGP), which are proteins responsible for binding calcium. However, these proteins are synthesized in an inactive state. Vitamin K2 acts as an essential cofactor for the enzyme gamma-glutamyl carboxylase, which activates osteocalcin and MGP.

Once carboxylated (activated), osteocalcin binds calcium to the hydroxyapatite crystal matrix of bone, while active MGP prevents calcium from depositing in vascular elastic fibers, thereby inhibiting arterial calcification. Supplying calcium without D3 and K2 increases the risk of vascular calcification and cardiovascular events.

Citations:
1. Vermeer, C., et al. (2012). Vitamin K2: the missing link to cardiovascular and bone health. Clinical Calcium, 22(5), 661-668.
2. van Ballegooijen, A. J., et al. (2017). The synergistic interplay between vitamins D and K for cardiovascular health: a narrative review. International Journal of Endocrinology, 2017.`
  },
  {
    id: 4,
    name: "Zinc Picolonate + Magnesium",
    slug: "zinc-picolonate-magnesium",
    series: "Wellness Series",
    form: "Tablets",
    price: 599,
    servings: 30,
    tagline: "Essential minerals for hormonal and immune health.",
    description: "Highly absorbable Zinc Picolinate combined with mineral-balancing Magnesium to support protein synthesis, testosterone production, and cellular immune response.",
    healthGoals: ["Immunity", "Stress", "Performance"],
    benefits: ["Optimizes natural testosterone production", "Strengthens cellular defense and recovery", "Reduces duration and severity of seasonal cold bugs"],
    image: "https://ik.imagekit.io/kenwell/products/zinc-picolonate-magnesium.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Best taken on an empty stomach 30-60 minutes before bedtime.",
      stacking: "Stack with Ashwagandha for a natural testosterone and recovery protocol.",
      warnings: "Avoid taking at the exact same time as high-calcium supplements, as calcium can compete for zinc absorption."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Zinc (as Zinc Picolinate)", amount: "30 mg", dv: "272%" },
        { name: "Magnesium (as Magnesium Aspartate)", amount: "200 mg", dv: "48%" },
        { name: "Vitamin B6 (as Pyridoxine HCl)", amount: "10 mg", dv: "588%" }
      ]
    },
    scienceText: `Zinc Picolinate is zinc bound to picolinic acid, a natural chelator that significantly enhances transit across the intestinal membrane. Zinc is an essential trace element required for the catalytic activity of more than 100 enzymes, including those involved in DNA and RNA synthesis, cell signaling, and apoptosis. In immune health, zinc regulates T-cell function and protects membrane integrity from oxidative damage. 

When combined with magnesium, it supports neuromuscular recovery, prevents cramps, and balances stress hormones in high-intensity athletes.

Citations:
1. Prasad, A. S. (2008). Zinc in human health: effect of zinc on immune cells. Molecular Medicine, 14(5-6), 353-357.
2. Wessels, I., et al. (2017). Zinc as a gatekeeper of immune function. Nutrients, 9(12), 1286.`
  },
  {
    id: 5,
    name: "Single Strength Fish Oil",
    slug: "single-strength-fish-oil",
    series: "Wellness Series",
    form: "Softgels",
    price: 499,
    servings: 30,
    tagline: "Essential Omega-3 for daily health.",
    description: "Pure, molecularly distilled ocean fish oil providing essential EPA and DHA to support daily joint mobility, brain function, and cardiovascular health.",
    healthGoals: ["Heart", "Brain", "Joints"],
    benefits: ["Supports joint flexibility and comfort", "Promotes focus and cognitive clarity", "Maintains healthy cholesterol levels"],
    image: "https://ik.imagekit.io/kenwell/products/single-strength-fish-oil.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1-2 softgels daily",
      timing: "With meals, preferably lunch or dinner.",
      stacking: "Stack with Multivitamin for baseline daily support.",
      warnings: "Contains fish. Consult a physician if taking anticoagulants."
    },
    nutritionalFacts: {
      servingSize: "1 Softgel",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Molecularly Distilled Fish Oil", amount: "1000 mg", dv: "**" },
        { name: "EPA (Eicosapentaenoic Acid)", amount: "180 mg", dv: "**" },
        { name: "DHA (Docosahexaenoic Acid)", amount: "120 mg", dv: "**" }
      ]
    },
    scienceText: `Omega-3 polyunsaturated fatty acids are essential lipids that must be consumed via diet. Molecular distillation removes heavy metals, PCBs, and oxidation products to yield a clean concentrate. EPA and DHA integrate into cell membranes, ensuring proper fluid dynamics and cellular communication.

Citations:
1. Simopoulos, A. P. (2002). The importance of the ratio of omega-6/omega-3 essential fatty acids. Biomedicine & Pharmacotherapy, 56(8), 365-379.`
  },
  {
    id: 6,
    name: "Triple Strength Fish Oil",
    slug: "triple-strength-fish-oil",
    series: "Core Series",
    form: "Softgels",
    price: 999,
    servings: 30,
    tagline: "High-potency clinical dose Omega-3.",
    description: "Highly concentrated, premium molecularly distilled fish oil providing 3x the active EPA and DHA per serving compared to standard fish oils. Promotes structural joint repair and cognitive performance.",
    healthGoals: ["Heart", "Brain", "Joints", "Performance"],
    benefits: ["Ultra-pure triglyceride form for 70% better absorption", "Clinical strength joint inflammation relief", "Optimizes neural tissue and brain membrane health"],
    image: "https://ik.imagekit.io/kenwell/products/triple-strength-fish-oil.jpg",
    accentColor: "#7A8C5A",
    howToUse: {
      dosage: "Take 1 softgel daily",
      timing: "With your largest, fat-containing meal of the day.",
      stacking: "Combine with CoQ10 Ubiquinone for advanced heart and longevity support.",
      warnings: "Store in a cool, dry place. Keep out of direct sunlight."
    },
    nutritionalFacts: {
      servingSize: "1 Softgel",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Concentrated Triglyceride Fish Oil", amount: "1250 mg", dv: "**" },
        { name: "EPA (Eicosapentaenoic Acid)", amount: "550 mg", dv: "**" },
        { name: "DHA (Docosahexaenoic Acid)", amount: "330 mg", dv: "**" },
        { name: "Other Omega-3 Fatty Acids", amount: "120 mg", dv: "**" }
      ]
    },
    scienceText: `Omega-3 fatty acids EPA and DHA are integrated directly into the phospholipid bilayer of cellular membranes. At high clinical concentrations (Triple Strength), EPA competes with arachidonic acid (an omega-6 fatty acid) for metabolism by cyclooxygenase (COX) and lipoxygenase (LOX) pathways. 

This results in a decrease in the production of pro-inflammatory eicosanoids (like PGE2 and LTB4) and an increase in the synthesis of resolvins and protectins, which actively resolve chronic system-wide inflammation. In the central nervous system, DHA is a primary structural component of cerebral gray matter and retinal membranes, maintaining membrane fluidity, ion channel transport, and neurotransmitter signaling.

Citations:
1. Calder, P. C. (2013). Omega-3 fatty acids and inflammatory processes. Nutrients, 5(3), 791-804.
2. Yurko-Mauro, K., et al. (2010). Beneficial effects of docosahexaenoic acid on cognition in age-associated memory impairment. Alzheimer's & Dementia, 6(6), 456-464.`
  },
  {
    id: 7,
    name: "Vegetarian Omega",
    slug: "vegetarian-omega",
    series: "Wellness Series",
    form: "Softgels",
    price: 899,
    servings: 30,
    tagline: "Plant-based algal oil Omega-3.",
    description: "Premium plant-derived algal oil offering a clean, sustainable source of high-quality DHA and EPA, completely free of fish oil, ocean toxins, or heavy metals.",
    healthGoals: ["Brain", "Heart", "Longevity"],
    benefits: ["100% vegan, sourced directly from cultivated marine algae", "Zero fishy burps or aftertaste", "Supports retinal and brain development"],
    image: "https://ik.imagekit.io/kenwell/products/vegetarian-omega.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 softgel daily",
      timing: "With dinner.",
      stacking: "Stack with Prebiotics + Probiotics for complete vegan wellness.",
      warnings: "Store in a cool place to maintain oil stability."
    },
    nutritionalFacts: {
      servingSize: "1 Softgel",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Marine Algal Oil (Schizochytrium sp.)", amount: "1000 mg", dv: "**" },
        { name: "DHA (Docosahexaenoic Acid)", amount: "300 mg", dv: "**" },
        { name: "EPA (Eicosapentaenoic Acid)", amount: "100 mg", dv: "**" }
      ]
    },
    scienceText: `Algal oil is the primary ecological source of Omega-3 fatty acids; fish accumulate EPA/DHA by consuming microalgae. Sourcing directly from cultivated microalgae provides a pristine triglyceride form of these essential lipids, avoiding heavy metals, microplastics, and environmental impacts associated with commercial overfishing.

Citations:
1. Arterburn, L. M., et al. (2008). Algal-oil capsules and cooked salmon for DHA delivery. Journal of the American Dietetic Association, 108(7), 1204-1209.`
  },
  {
    id: 8,
    name: "Joint Support",
    slug: "joint-support",
    series: "Wellness Series",
    form: "Tablets",
    price: 799,
    servings: 30,
    tagline: "Advanced mobility and cartilage repair.",
    description: "A comprehensive formulation of Glucosamine Sulfate, MSM, and Calcium designed to restore joint lubrication, protect cartilage matrix, and ease daily joint soreness.",
    healthGoals: ["Joints", "Longevity"],
    benefits: ["Restores joint fluid viscosity and comfort", "Slows cartilage degradation due to aging or wear", "Boosts cellular sulfur for connective tissues"],
    image: "https://ik.imagekit.io/kenwell/products/joint-support.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 2 tablets daily",
      timing: "Spread throughout the day: 1 with breakfast, 1 with dinner.",
      stacking: "Best stacked with Triple Strength Fish Oil to tackle inflammatory joint issues.",
      warnings: "Contains ingredients derived from shellfish (glucosamine). Do not use if allergic to shellfish."
    },
    nutritionalFacts: {
      servingSize: "2 Tablets",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Glucosamine Sulfate 2KCl", amount: "1500 mg", dv: "**" },
        { name: "MSM (Methylsulfonylmethane)", amount: "1000 mg", dv: "**" },
        { name: "Calcium (as Calcium Carbonate)", amount: "250 mg", dv: "20%" },
        { name: "Cissus Quadrangularis Extract", amount: "200 mg", dv: "**" }
      ]
    },
    scienceText: `Glucosamine is a precursor for glycosaminoglycans, the key structural component of joint cartilage and synovial fluid. MSM acts as an organic sulfur donor, supplying the sulfur needed to synthesize cross-linked collagen fibers within the extracellular matrix of cartilage, preventing structural thinning.

Citations:
1. Towheed, T. E., et al. (2005). Glucosamine therapy for treating osteoarthritis. Cochrane Database of Systematic Reviews, (2).`
  },
  {
    id: 9,
    name: "Milk Thistle",
    slug: "milk-thistle",
    series: "Wellness Series",
    form: "Capsules",
    price: 549,
    servings: 30,
    tagline: "Natural liver defense and detox support.",
    description: "Standardized Milk Thistle Seed Extract containing 80% Silymarin. Supports hepatocyte membrane integrity, natural detoxification pathways, and glutathione synthesis.",
    healthGoals: ["Detox", "Longevity"],
    benefits: ["Protects liver cells from toxins", "Enhances natural glutathione production", "Supports healthy skin by facilitating liver clearing"],
    image: "https://ik.imagekit.io/kenwell/products/milk-thistle.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "With a meal, ideally before your largest meal of the day.",
      stacking: "Stack with NAC (N-Acetyl Cysteine) for complete phase II liver detox support.",
      warnings: "Consult your doctor if you have a history of ragweed allergies."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Milk Thistle Extract (Silybum marianum) (Seed)", amount: "300 mg", dv: "**" },
        { name: "  (Standardized to 80% Silymarin flavonoids)", amount: "240 mg", dv: "**" },
        { name: "Dandelion Root Powder", amount: "100 mg", dv: "**" }
      ]
    },
    scienceText: `Silymarin, the active complex of milk thistle, acts as a membrane stabilizer and antioxidant. It prevents toxin entry by altering the outer structure of hepatocyte cell membranes. Silymarin also stimulates nucleolar polymerase A, leading to increased ribosomal protein synthesis and accelerating liver tissue regeneration.

Citations:
1. Saller, R., et al. (2001). The use of silymarin in the treatment of liver diseases. Drugs, 61(14), 2035-2063.`
  },
  {
    id: 10,
    name: "NAC (N-Acetyl Cysteine)",
    slug: "nac",
    series: "Wellness Series",
    form: "Capsules",
    price: 649,
    servings: 30,
    tagline: "Cellular defense and respiratory support.",
    description: "High-purity N-Acetyl Cysteine, the direct precursor to Glutathione (the body's master antioxidant). Supports bronchial and respiratory health and deep cellular detoxification.",
    healthGoals: ["Detox", "Immunity", "Longevity", "Brain"],
    benefits: ["Rapidly elevates intracellular glutathione levels", "Breaks down mucosal congestion in airways", "Protects liver and kidneys from chemical stress"],
    image: "https://ik.imagekit.io/kenwell/products/nac.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "On an empty stomach, 30 minutes before a meal or 2 hours after.",
      stacking: "Perfect to combine with Vitamin C to maintain glutathione recycle loops.",
      warnings: "Has a characteristic sulfur smell, which is completely normal and proof of active thiol groups."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "N-Acetyl-L-Cysteine (NAC)", amount: "600 mg", dv: "**" },
        { name: "Selenium (as L-Selenomethionine)", amount: "50 mcg", dv: "91%" },
        { name: "Molybdenum (as Molybdenum Chelate)", amount: "50 mcg", dv: "111%" }
      ]
    },
    scienceText: `N-Acetyl Cysteine (NAC) supplies L-cysteine, the rate-limiting amino acid for the synthesis of intracellular glutathione (GSH). GSH neutralizes reactive oxygen species (ROS) and plays a vital role in hepatic Phase II detoxification by conjugating with electrophilic compounds to make them water-soluble for excretion.

Citations:
1. Dodd, S., et al. (2008). N-acetylcysteine for depressive symptoms: a clinical trial. Journal of Psychiatry and Neuroscience, 33(6), 542.`
  },
  {
    id: 11,
    name: "TUDCA",
    slug: "tudca",
    series: "Wellness Series",
    form: "Capsules",
    price: 1299,
    servings: 30,
    tagline: "Advanced liver bile acid support.",
    description: "Premium Tauroursodeoxycholic Acid (TUDCA), a naturally occurring hydrophilic bile acid. Supports optimal bile flow, liver enzyme balance, and mitochondrial function under stress.",
    healthGoals: ["Detox", "Gut Health", "Longevity"],
    benefits: ["Supports gallbladder and bile duct health", "Reduces endoplasmic reticulum (ER) cellular stress", "Highly recommended for liver health protection"],
    image: "https://ik.imagekit.io/kenwell/products/tudca.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "Take with water on an empty stomach in the morning or mid-day.",
      stacking: "Stack with Milk Thistle or NAC for total, premium liver defense.",
      warnings: "Do not consume with alcohol. Consult your doctor if you have active gallstones."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "TUDCA (Tauroursodeoxycholic Acid)", amount: "250 mg", dv: "**" }
      ]
    },
    scienceText: `TUDCA is a hydrophilic bile acid that works by counteracting the cytotoxic effects of hydrophobic bile acids which accumulate during liver cholestasis. TUDCA reduces endoplasmic reticulum (ER) stress by serving as a chemical chaperone, preventing protein misfolding and preventing hepatic cell death pathways.

Citations:
1. Crosignani, A., et al. (1996). Tauroursodeoxycholic acid for the treatment of primary biliary cirrhosis. Hepatology, 24(5), 1076-1083.`
  },
  {
    id: 12,
    name: "NAD+",
    slug: "nad",
    series: "Liposomal Series",
    form: "Tablets",
    price: 1499,
    servings: 30,
    tagline: "Advanced cellular rejuvenation and energy.",
    description: "High-dose Nicotinamide Adenine Dinucleotide (NAD+) precursor designed to boost intracellular NAD+ levels, stimulate sirtuin longevity proteins, and fuel mitochondria.",
    healthGoals: ["Energy", "Longevity", "Brain"],
    benefits: ["Elevates physical energy and cellular respiration", "Supports cognitive clarity, focus, and memory", "Activates cellular DNA repair and sirtuin pathways"],
    image: "https://ik.imagekit.io/kenwell/products/nad.jpg",
    accentColor: "#4A8B8C",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Take early in the morning on an empty stomach to match your circadian rhythm.",
      stacking: "Pairs synergistically with Resveratrol or CoQ10 for advanced cellular longevity.",
      warnings: "Do not take late in the evening as it may interfere with sleep due to energy surges."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "NAD+ Precursor Complex (Nicotinamide Riboside & NMN)", amount: "500 mg", dv: "**" },
        { name: "Trimethylglycine (TMG) (methyl donor)", amount: "100 mg", dv: "**" }
      ]
    },
    scienceText: `NAD+ is a critical coenzyme present in every living cell, functioning as a primary electron carrier in the mitochondrial electron transport chain for ATP production. As organisms age, systemic NAD+ levels decline by up to 50% by age 40, leading to mitochondrial decay and cellular senescence. Supplementing with precursors NR and NMN bypasses enzymatic bottlenecks.

This directly elevates NAD+ pools, which in turn acts as a substrate for PARP enzymes (governing DNA double-strand repair) and sirtuins (SIRT1-7), the histone deacetylase enzymes that regulate epigenetic silencing, mitochondrial biogenesis, and cell survival.

Citations:
1. Yoshino, J., et al. (2018). NAD+ intermediates: the biology and therapeutic potential of NMN and NR. Cell Metabolism, 27(3), 513-528.
2. Imai, S., & Guarente, L. (2014). NAD+ and sirtuins in aging and disease. Trends in Cell Biology, 24(8), 464-471.`
  },
  {
    id: 13,
    name: "Liver Support Blend",
    slug: "liver-support-blend",
    series: "Wellness Series",
    form: "Capsules",
    price: 849,
    servings: 30,
    tagline: "Total hepatoprotective matrix.",
    description: "An advanced multi-ingredient liver detox formula combining Milk Thistle, Artichoke extract, and vital micronutrients to protect hepatocytes and promote bile secretion.",
    healthGoals: ["Detox", "Gut Health"],
    benefits: ["Supports natural Phase I & II liver pathways", "Relieves bloating and supports dietary fat digestion", "Balances transaminase liver enzymes"],
    image: "https://ik.imagekit.io/kenwell/products/liver-support-blend.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 2 capsules daily",
      timing: "With dinner.",
      stacking: "Stack with TUDCA for advanced liver enzyme clearance.",
      warnings: "Consult a healthcare professional if you have gallbladder obstruction."
    },
    nutritionalFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Milk Thistle Extract (80% Silymarin)", amount: "250 mg", dv: "**" },
        { name: "Artichoke Leaf Extract", amount: "150 mg", dv: "**" },
        { name: "Choline (as Choline Bitartrate)", amount: "100 mg", dv: "18%" },
        { name: "Alpha Lipoic Acid", amount: "100 mg", dv: "**" }
      ]
    },
    scienceText: `This blend utilizes synergistic herbal extracts to support the liver's dual filtration pathways. Choline bitartrate assists in lipid transport out of the liver, helping prevent fat accumulation (fatty liver). Alpha Lipoic Acid acts as a universal antioxidant, regenerating Vitamin C and E to protect hepatic membranes.

Citations:
1. Zeisel, S. H., & da Costa, K. A. (2009). Choline: an essential nutrient for public health. Nutrition Reviews, 67(11), 615-623.`
  },
  {
    id: 14,
    name: "Vitamin C",
    slug: "vitamin-c",
    series: "Liposomal Series",
    form: "Tablets",
    price: 399,
    servings: 30,
    tagline: "Premium liposomal vitamin C.",
    description: "Premium Liposomal Vitamin C wrapped in lipid spheres for maximum intestinal absorption. Offers enhanced antioxidant cellular protection, collagen synthesis, and immune health.",
    healthGoals: ["Immunity", "Longevity", "Heart"],
    benefits: ["Superior bioavailability compared to ascorbic acid", "Gentle on stomach lining, zero acidity issues", "Supports natural collagen production for skin and joints"],
    image: "https://ik.imagekit.io/kenwell/products/vitamin-c.jpg",
    accentColor: "#4A8B8C",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Any time of day with water, with or without meals.",
      stacking: "Stack with Glutathione for a powerful synergistic skin and antioxidant stack.",
      warnings: "Consult your doctor if you have iron overload conditions (hemochromatosis)."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Liposomal Vitamin C (ascorbyl palmitate blend)", amount: "1000 mg", dv: "1111%" },
        { name: "Citrus Bioflavonoids Complex", amount: "100 mg", dv: "**" },
        { name: "Rose Hips Powder", amount: "25 mg", dv: "**" }
      ]
    },
    scienceText: `Liposomal Vitamin C utilizes phospholipids to encapsulate ascorbic acid within a lipid bilayer. This molecular structure mirrors cell membranes, allowing the molecule to bypass traditional sodium-dependent vitamin C transporters (SVCT-1) in the gut which saturate at doses above 200mg. Liposomes are absorbed via lymphatic pathways, avoiding bowel tolerance limits.

Citations:
1. Davis, J. L., et al. (2016). Liposomal-encapsulated Ascorbic Acid: Influence on Vitamin C Bioavailability and Protection against Ischemia-Reperfusion Injury. Nutrition and Metabolic Insights, 9, 25-30.`
  },
  {
    id: 15,
    name: "Glutathione Reduced",
    slug: "glutathione-reduced",
    series: "Liposomal Series",
    form: "Tablets",
    price: 1199,
    servings: 30,
    tagline: "The master antioxidant for cellular detox.",
    description: "Highly purified, stable reduced L-Glutathione designed to neutralize free radicals, support hepatic detoxification, and brighten skin cells by regulating melanin synthesis.",
    healthGoals: ["Detox", "Immunity", "Longevity"],
    benefits: ["Promotes bright, even skin tone and hyperpigmentation reduction", "Neutralizes oxidative free radicals in the cells", "Assists liver phase II excretion of toxins"],
    image: "https://ik.imagekit.io/kenwell/products/glutathione-reduced.jpg",
    accentColor: "#4A8B8C",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Take in the morning on an empty stomach for optimal absorption.",
      stacking: "Stack with Vitamin C to prevent glutathione oxidation and maintain its reduced form.",
      warnings: "Store in a dry, cool environment away from heat."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "L-Glutathione (Reduced Form)", amount: "500 mg", dv: "**" },
        { name: "Milk Thistle Extract (Seed)", amount: "100 mg", dv: "**" },
        { name: "Alpha Lipoic Acid", amount: "50 mg", dv: "**" }
      ]
    },
    scienceText: `Glutathione (GSH) is a tripeptide composed of glutamic acid, cysteine, and glycine, and represents the primary endogenous antioxidant system in eukaryotic cells. It serves as a cofactor for glutathione peroxidase enzymes, which neutralize hydrogen peroxide and lipid hydroperoxides. 

In the skin, glutathione regulates melanogenesis by inhibiting the enzyme tyrosinase, diverting melanin synthesis from dark eumelanin to lighter pheomelanin, resulting in clinical skin-tone brightening.

Citations:
1. Richie, J. P., et al. (2015). Randomized controlled trial of oral glutathione supplementation on body stores of glutathione. European Journal of Nutrition, 54(2), 251-263.
2. Handog, E. B., et al. (2016). An open-label, single-arm trial of oral glutathione for skin tone evening. International Journal of Dermatology, 55(2), e71-e75.`
  },
  {
    id: 16,
    name: "Vitamin B12 (Methylcobalamin)",
    slug: "vitamin-b12",
    series: "Wellness Series",
    form: "Tablets",
    price: 449,
    servings: 30,
    tagline: "Active coenzyme B12 for energy and nerves.",
    description: "Premium Methylcobalamin, the bioactive, naturally coenzyme form of Vitamin B12. Essential for red blood cell formation, DNA synthesis, and cognitive health.",
    healthGoals: ["Energy", "Brain", "Longevity"],
    benefits: ["Supports neural cell myelin sheath maintenance", "Improves daily physical and mental energy", "Highly recommended for vegetarians and vegans"],
    image: "https://ik.imagekit.io/kenwell/products/vitamin-b12.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Take in the morning with a glass of water.",
      stacking: "Stack with Multivitamin for a complete daily nutrient foundation.",
      warnings: "Store away from heat. No known toxic thresholds for B12 due to water solubility."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Vitamin B12 (as bioactive Methylcobalamin)", amount: "1500 mcg", dv: "62500%" },
        { name: "Folate (as L-Methylfolate)", amount: "400 mcg", dv: "100%" }
      ]
    },
    scienceText: `Methylcobalamin is the biologically active coenzyme form of B12, unlike synthetic cyanocobalamin which requires hepatic conversion. It acts as a methyl donor in the methionine synthase reaction, converting homocysteine to methionine. This reaction is vital for synthesis of S-adenosylmethionine (SAMe) which methylates DNA and myelin proteins.

Citations:
1. Watanabe, F. (2007). Vitamin B12 sources and bioavailability. Experimental Biology and Medicine, 232(10), 1266-1274.`
  },
  {
    id: 17,
    name: "CoQ10 Ubiquinone",
    slug: "coq10-ubiquinone",
    series: "Liposomal Series",
    form: "Capsules",
    price: 999,
    servings: 30,
    tagline: "Cellular energy and cardiovascular fuel.",
    description: "Highly purified Coenzyme Q10 (Ubiquinone) designed to fuel mitochondrial cellular energy (ATP) production, support heart muscle function, and fight age-related decay.",
    healthGoals: ["Energy", "Heart", "Longevity"],
    benefits: ["Provides antioxidant protection to LDL cholesterol", "Crucial for individuals taking statin drugs", "Powers mitochondria in high-energy cardiac tissues"],
    image: "https://ik.imagekit.io/kenwell/products/coq10-ubiquinone.jpg",
    accentColor: "#4A8B8C",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "With a meal that contains healthy dietary fats to optimize absorption.",
      stacking: "Stack with Triple Strength Fish Oil to optimize lipid solubility and cardiovascular synergy.",
      warnings: "Consult your doctor if you take blood pressure lowering or anticoagulant medications."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Coenzyme Q10 (Ubiquinone)", amount: "200 mg", dv: "**" },
        { name: "Piperine (Black Pepper Extract)", amount: "5 mg", dv: "**" }
      ]
    },
    scienceText: `Coenzyme Q10 (CoQ10) is a lipophilic molecule located in the inner mitochondrial membrane. It operates as an obligate electron shuttle, transferring electrons from complexes I and II to complex III in the respiratory chain, generating the proton gradient that drives ATP synthesis. CoQ10 is also a potent lipid-soluble antioxidant, preventing lipid peroxidation.

Citations:
1. Mortensen, S. A., et al. (2014). The effect of coenzyme Q10 on morbidity and mortality in chronic heart failure. JACC: Heart Failure, 2(6), 641-649.`
  },
  {
    id: 18,
    name: "Melatonin Sleep Support",
    slug: "melatonin-sleep-support",
    series: "Wellness Series",
    form: "Tablets",
    price: 449,
    servings: 30,
    tagline: "Natural circadian rhythm and deep sleep.",
    description: "Low-dose, fast-dissolving Melatonin formulated to restore natural sleep-wake cycles, alleviate jet lag, and promote restful REM sleep without grogginess.",
    healthGoals: ["Sleep", "Stress"],
    benefits: ["Shortens time to fall asleep (sleep latency)", "Supports natural sleep architecture (deep & REM stages)", "Non-habit forming botanical and hormone blend"],
    image: "https://ik.imagekit.io/kenwell/products/melatonin-sleep-support.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 tablet daily",
      timing: "Consume 30-45 minutes before sleep in a darkened room environment.",
      stacking: "Stack with Magnesium Glycinate for complete muscle and neural sleep prep.",
      warnings: "Do not operate machinery or drive vehicles within 5 hours of taking melatonin."
    },
    nutritionalFacts: {
      servingSize: "1 Tablet",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Melatonin", amount: "3 mg", dv: "**" },
        { name: "L-Theanine", amount: "100 mg", dv: "**" },
        { name: "Chamomile Flower Extract", amount: "50 mg", dv: "**" }
      ]
    },
    scienceText: `Melatonin is an indoleamine hormone synthesized in the pineal gland, regulated by light input through the retinohypothalamic tract. It acts on MT1 and MT2 receptors in the suprachiasmatic nucleus of the hypothalamus to synchronize the circadian clock, promoting peripheral vasodilation and sleep readiness.

Citations:
1. Ferracioli-Oda, E., et al. (2013). Meta-analysis: melatonin for the treatment of primary sleep disorders. PLoS One, 8(5), e63773.`
  },
  {
    id: 19,
    name: "KSM-66 Ashwagandha",
    slug: "ksm-66-ashwagandha",
    series: "Core Series",
    form: "Capsules",
    price: 799,
    servings: 30,
    tagline: "Clinically proven stress and hormone relief.",
    description: "Premium KSM-66 Ashwagandha extract, the most clinically-backed root-only adaptogen. Promotes healthy cortisol levels, reduces anxiety, and supports physical strength and focus.",
    healthGoals: ["Stress", "Sleep", "Performance", "Longevity"],
    benefits: ["Lowers stress-induced cortisol levels by up to 27%", "Improves muscle recovery and oxygen uptake (VO2 Max)", "Promotes calm focus and mitigates daily anxiety"],
    image: "https://ik.imagekit.io/kenwell/products/ksm-66-ashwagandha.jpg",
    accentColor: "#7A8C5A",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "Take after lunch or dinner to support evening wind-down and cortisol regulation.",
      stacking: "Stack with Zinc + Magnesium for advanced athletic recovery and hormone optimization.",
      warnings: "Do not use if taking immunosuppressants, as ashwagandha can stimulate immune markers."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "KSM-66 Ashwagandha Root Extract", amount: "600 mg", dv: "**" },
        { name: "  (Standardized to >5% Withanolides)", amount: "30 mg", dv: "**" },
        { name: "Black Pepper Extract (BioPerine)", amount: "5 mg", dv: "**" }
      ]
    },
    scienceText: `KSM-66 Ashwagandha is a proprietary, full-spectrum root extract standardized to contain a high concentration of active compounds called withanolides. As an adaptogen, it modulates the activity of the Hypothalamic-Pituitary-Adrenal (HPA) axis, which governs the biological response to stress. 

By down-regulating HPA axis hyper-activation, ashwagandha reduces serum cortisol levels. In double-blind clinical trials, it significantly reduced scores on stress-assessment scales, stabilized blood pressure, improved sleep quality index, and increased muscle hypertrophy and strength markers.

Citations:
1. Chandrasekhar, K., et al. (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of Ashwagandha root in reducing stress and anxiety. Indian Journal of Psychological Medicine, 34(3), 254-262.
2. Wankhede, S., et al. (2015). Examining the effect of Withania somnifera supplementation on muscle strength and recovery. Journal of the International Society of Sports Nutrition, 12(1), 43.`
  },
  {
    id: 20,
    name: "DHT Blocker",
    slug: "dht-blocker",
    series: "Wellness Series",
    form: "Capsules",
    price: 949,
    servings: 30,
    tagline: "Natural hair follicle preservation.",
    description: "A synergistic blend of Saw Palmetto, Pumpkin Seed, and Pygeum Extract formulated to inhibit the 5-alpha reductase enzyme, protecting hair follicles from hormone-induced thinning.",
    healthGoals: ["Longevity"],
    benefits: ["Blocks DHT, the primary hormone responsible for male pattern baldness", "Supports prostate health and urinary flow", "Nourishes hair roots with clean phytosterols"],
    image: "https://ik.imagekit.io/kenwell/products/dht-blocker.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 2 capsules daily",
      timing: "With food, preferably with dinner.",
      stacking: "Stack with Zinc and Omega-3 for full structural hair growth support.",
      warnings: "Intended for adults. Not recommended for pregnant women."
    },
    nutritionalFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Saw Palmetto Berry Extract (45% Fatty Acids)", amount: "320 mg", dv: "**" },
        { name: "Pumpkin Seed Extract", amount: "200 mg", dv: "**" },
        { name: "Stinging Nettle Root Extract", amount: "150 mg", dv: "**" },
        { name: "Biotin", amount: "5000 mcg", dv: "16667%" }
      ]
    },
    scienceText: `Dihydrotestosterone (DHT) binds to androgen receptors in genetically susceptible hair follicles, causing miniaturization. Phytosterols in Saw Palmetto inhibit 5-alpha-reductase (the enzyme converting testosterone to DHT), helping maintain follicular health.

Citations:
1. Prager, N., et al. (2002). Randomized, double-blind, placebo-controlled trial to determine the effectiveness of botanically derived inhibitors of 5-alpha-reductase. Journal of Alternative and Complementary Medicine, 8(2), 143-152.`
  },
  {
    id: 21,
    name: "Prebiotics + Probiotics",
    slug: "prebiotics-probiotics",
    series: "Wellness Series",
    form: "Capsules",
    price: 849,
    servings: 30,
    tagline: "Advanced synbiotic gut health complex.",
    description: "A premium synbiotic formulation combining 15 clinically documented probiotic strains (30 Billion CFU) with Organic Inulin prebiotic fibers to nurture and restore digestive balance.",
    healthGoals: ["Gut Health", "Immunity", "Stress"],
    benefits: ["Sustains healthy gut microbiome and regular digestion", "Reduces occasional gas, bloating, and indigestion", "Supports the gut-brain axis for cognitive wellness"],
    image: "https://ik.imagekit.io/kenwell/products/prebiotics-probiotics.jpg",
    accentColor: "#C9B99A",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "First thing in the morning with a glass of water, 20 minutes before breakfast.",
      stacking: "Stack with Milk Thistle to support total gut-liver metabolic clearing.",
      warnings: "Store in a cool, dry place. Refridgeration is recommended but not required."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Probiotic Blend (15 Strains, 30 Billion CFU)", amount: "250 mg", dv: "**" },
        { name: "  (L. acidophilus, B. infantis, L. rhamnosus, etc.)", amount: "CFUs", dv: "**" },
        { name: "Organic FOS Prebiotic (Fructooligosaccharides)", amount: "200 mg", dv: "**" }
      ]
    },
    scienceText: `A synbiotic combines probiotics (live beneficial microbes) with prebiotics (indigestible fibers that feed those microbes). This combination enhances probiotic survival during transit through the stomach acid and promotes colonization in the colon, boosting short-chain fatty acid (SCFA) production like butyrate, which supports gut barrier integrity.

Citations:
1. Gibson, G. R., et al. (2017). Expert consensus document: The International Scientific Association for Probiotics and Prebiotics (ISAPP) consensus statement on synbiotics. Nature Reviews Gastroenterology & Hepatology, 14(8), 491.`
  },
  {
    id: 22,
    name: "Fat Burner",
    slug: "fat-burner",
    series: "Performance Series",
    form: "Capsules",
    price: 799,
    servings: 30,
    tagline: "Thermogenic metabolic accelerator.",
    description: "Advanced thermogenic fat burner formulated with clean Caffeine, Yohimbine HCL, and Garcinia Cambogia. Accelerates lipolysis, increases calorie expenditure, and curbs cravings.",
    healthGoals: ["Weight", "Energy", "Performance"],
    benefits: ["Stimulates metabolic rate and daily calorie burning", "Targets fat cells for lipolysis during cardio", "Provides clean energy without crash or jitters"],
    image: "https://ik.imagekit.io/kenwell/products/fat-burner.jpg",
    accentColor: "#2C4A6E",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "Take 30 minutes before morning exercise or with breakfast. Avoid taking within 6 hours of sleep.",
      stacking: "Combine with L-Carnitine for advanced fat transport during workouts.",
      warnings: "Contains stimulants. Limit other caffeine sources. Avoid if you have high blood pressure."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Caffeine Anhydrous", amount: "150 mg", dv: "**" },
        { name: "Garcinia Cambogia Extract (60% HCA)", amount: "250 mg", dv: "**" },
        { name: "Green Tea Extract (50% EGCG)", amount: "200 mg", dv: "**" },
        { name: "Yohimbine HCl (from Pausinystalia johimbe)", amount: "2.5 mg", dv: "**" }
      ]
    },
    scienceText: `This formula works by activating thermogenesis and fat mobilization. Caffeine inhibits phosphodiesterase (PDE), maintaining cAMP levels to stimulate lipolysis. Yohimbine acts as an alpha-2 adrenergic receptor antagonist, blocking receptors that typically suppress fat release. This enables the release of fatty acids into the bloodstream to be oxidized for fuel.

Citations:
1. Astrup, A., et al. (1990). Caffeine: a double-blind, placebo-controlled study of its thermogenic, metabolic, and cardiovascular effects in humans. American Journal of Clinical Nutrition, 51(5), 759-767.
2. Ostojic, S. M. (2006). Yohimbine: the effects on body composition and exercise performance in resistance-trained athletes. Research in Sports Medicine, 14(4), 289-299.`
  },
  {
    id: 23,
    name: "Berberine HCL",
    slug: "berberine-hcl",
    series: "Liposomal Series",
    form: "Capsules",
    price: 1099,
    servings: 30,
    tagline: "Natural glucose and metabolic balance.",
    description: "Premium Berberine HCl standardized for maximum potency. Often described as nature's metformin, it activates the AMPK pathway to regulate insulin sensitivity, glucose levels, and cellular lipid metabolism.",
    healthGoals: ["Weight", "Heart", "Longevity", "Gut Health"],
    benefits: ["Promotes healthy insulin response and glucose metabolism", "Supports mitochondrial biogenesis and longevity pathways", "Optimizes cholesterol levels and arterial flow"],
    image: "https://ik.imagekit.io/kenwell/products/berberine-hcl.jpg",
    accentColor: "#4A8B8C",
    howToUse: {
      dosage: "Take 1 capsule daily",
      timing: "Take 15-20 minutes before your carbohydrate-heavy meal of the day.",
      stacking: "Stack with Milk Thistle to support liver glucose clearing, or with CoQ10 for cardiovascular support.",
      warnings: "Do not take if pregnant. May cause mild gastrointestinal adaptation in the first 3-5 days."
    },
    nutritionalFacts: {
      servingSize: "1 Capsule",
      servingsPerContainer: "30",
      headers: ["Amount Per Serving", "% Daily Value (RDA)"],
      ingredients: [
        { name: "Berberine HCl (from Berberis aristata root)", amount: "500 mg", dv: "**" },
        { name: "Chromium (as Chromium Picolinate)", amount: "100 mcg", dv: "286%" }
      ]
    },
    scienceText: `Berberine is a natural quaternary ammonium alkaloid with clinical actions that rival pharmaceutical agents. Once absorbed, berberine acts as a potent activator of Adenosine Monophosphate-Activated Protein Kinase (AMPK), the body's master metabolic switch. AMPK activation up-regulates glucose transporter 4 (GLUT4) translocation in skeletal muscle, promoting insulin-independent glucose uptake. 

Furthermore, berberine down-regulates hepatic gluconeogenesis (glucose production in the liver) and inhibits alpha-glucosidase enzymes in the brush border of the small intestine, slowing carbohydrate absorption. Studies show it also stimulates mitochondrial respiration and activates sirtuin longevity pathways.

Citations:
1. Zhang, Y., et al. (2008). Treatment of type 2 diabetes and dyslipidemia with the natural plant alkaloid berberine. Journal of Clinical Endocrinology & Metabolism, 93(7), 2559-2565.
2. Yin, J., et al. (2008). Efficacy of berberine in patients with type 2 diabetes mellitus. Metabolism, 57(5), 712-717.`
  }
];

// Map each product to its unique generated bottle photo
// Liposomal Series gets dark premium packaging; others get clean white bottles
const PRODUCT_IMAGE_MAP = {
  1:  '/bottle_multivitamin.png',        // Multivitamin with Probiotics
  2:  '/bottle_magnesium.png',           // Chelated Magnesium Glycinate
  3:  '/bottle_vitamin_d3.png',          // Vitamin D3 + K2 + Calcium
  4:  '/bottle_zinc_magnesium.png',      // Zinc Picolinate + Magnesium
  5:  '/bottle_fish_oil.png',            // Single Strength Fish Oil
  6:  '/bottle_fish_oil.png',            // Triple Strength Fish Oil
  7:  '/bottle_probiotics.png',          // Vegetarian Omega (reuse probiotics)
  8:  '/bottle_joint_support.png',       // Joint Support
  9:  '/bottle_milk_thistle.png',        // Milk Thistle
  10: '/bottle_nac.png',                 // NAC
  11: '/bottle_tudca.png',               // TUDCA
  12: '/bottle_nad.png',                 // NAD+ — Liposomal dark
  13: '/bottle_milk_thistle.png',        // Liver Support Blend
  14: '/bottle_vitamin_c.png',           // Vitamin C — Liposomal dark
  15: '/bottle_glutathione.png',         // Glutathione — Liposomal dark
  16: '/product bottles .jpeg',          // Vitamin B12 — uploaded reference
  17: '/bottle_coq10.png',               // CoQ10 — Liposomal dark
  18: '/bottle_melatonin.png',           // Melatonin Sleep Support
  19: '/bottle_ashwagandha.png',         // KSM-66 Ashwagandha
  20: '/product bottles .jpeg',          // DHT Blocker — uploaded reference
  21: '/bottle_probiotics.png',          // Prebiotics + Probiotics
  22: '/bottle_ashwagandha.png',         // Fat Burner — fallback
  23: '/bottle_berberine.png',           // Berberine HCL — Liposomal dark
};

// Fallback images for products without a unique generated image
const FALLBACK_IMAGES = [
  '/product bottles .jpeg',
  '/core series and performance series.jpeg',
  '/product images.jpeg',
];

PRODUCTS.forEach((product) => {
  const specificImage = PRODUCT_IMAGE_MAP[product.id];
  if (specificImage) {
    product.image = specificImage;
  } else {
    product.image = FALLBACK_IMAGES[product.id % FALLBACK_IMAGES.length];
  }
});

export const ARTICLES = [
  {
    id: 1,
    title: "Why Magnesium Glycinate is the Superior Form of Magnesium",
    slug: "why-magnesium-glycinate-is-superior",
    topic: "Vitamins",
    readTime: "5 min read",
    date: "May 15, 2026",
    summary: "Explore the biochemistry of magnesium absorption. Understand why glycine conjugation creates a highly bioavailable compound that supports sleep and relaxation without digestive distress.",
    content: `<p>Magnesium is an essential mineral required for over 300 biochemical reactions in the human body. Yet, a vast majority of the population is subclinically deficient. When looking to supplement, consumers are faced with a confusing array of magnesium types: oxide, citrate, malate, threonate, and glycinate. Science points directly to Magnesium Glycinate as the gold standard for general wellness, sleep, and muscle support.</p>
    
    <h3>The Bioavailability Bottleneck</h3>
    <p>Inorganic magnesium salts, such as Magnesium Oxide, are widely used in low-cost supplements. However, these forms have extremely poor bioavailability (around 4%). Because the magnesium ions remain unabsorbed, they draw water into the colon via osmosis, leading to gastrointestinal distress and a laxative effect. Citrate is slightly better but still frequently triggers stomach upset.</p>
    <p>Magnesium Glycinate (magnesium bound to the amino acid glycine) is fully chelated. Chelation shields the magnesium ion from binding to dietary antagonists like phytates. Instead of using standard mineral transport channels in the gut, magnesium glycinate is absorbed intact via dipeptide channels. This results in superior absorption and absolute comfort for the stomach.</p>
    
    <h3>The Synergistic Power of Glycine</h3>
    <p>Glycine is not just a carrier molecule—it is a functional amino acid. In the central nervous system, glycine acts as an inhibitory neurotransmitter. It binds to NMDA receptors in the brain, helping quiet overactive neural firing. By combining magnesium (which blocks calcium from entering NMDA channels) and glycine, this supplement acts as a natural neurological calming agent, promoting deep REM sleep and relieving chronic muscle tension.</p>`
  },
  {
    id: 2,
    title: "Liposomal Delivery: Why Absorption Matters More Than Dosage",
    slug: "liposomal-delivery-absorption-vs-dosage",
    topic: "Performance",
    readTime: "6 min read",
    date: "May 12, 2026",
    summary: "Learn how liposome encapsulation protects delicate nutrients like Vitamin C and Glutathione from stomach acid, ensuring direct delivery into the bloodstream.",
    content: `<p>For decades, the supplement industry has engaged in a 'dosage arms race', with brands offering 1000mg, 2000mg, or even 5000mg of standard active ingredients. But the human digestive tract isn't built to absorb raw chemical isolates in massive quantities. The reality is simple: <strong>absorption matters far more than dosage</strong>. This is where advanced Liposomal Delivery changes the game.</p>
    
    <h3>What is Liposomal Encapsulation?</h3>
    <p>A liposome is a microscopic spherical vesicle composed of a double layer of phospholipids—the exact same structural material that makes up our own cellular membranes. In a liposomal supplement, the active nutrient (such as Vitamin C or Glutathione) is encapsulated inside this protective lipid bubble.</p>
    
    <h3>Bypassing the Intestinal Gatekeepers</h3>
    <p>When you consume standard Vitamin C, it relies on Sodium-Dependent Vitamin C Transporters (SVCT-1) in the gut. These transporters have a strict threshold; once saturated, any excess vitamin C is excreted. Furthermore, harsh stomach acids and digestive enzymes destroy a significant percentage of standard nutrients before they ever reach the small intestine.</p>
    <p>Liposomes act as a cellular stealth coat. Because they are made of phospholipids, they protect the cargo from stomach acid and are absorbed directly through the intestinal wall, often entering the lymphatic system. This bypasses first-pass liver metabolism and SVCT-1 transporter bottlenecks, resulting in up to 5x higher plasma concentration levels than standard powders or capsules.</p>`
  },
  {
    id: 3,
    title: "The NAD+ Decline and What It Means for Your Energy at 30+",
    slug: "nad-decline-and-cellular-energy",
    topic: "Longevity",
    readTime: "7 min read",
    date: "May 08, 2026",
    summary: "As we age, our cellular fuel levels drop, leading to sluggishness and aging. Discover how raising NAD+ levels restarts mitochondrial energy production.",
    content: `<p>Have you ever wondered why young children seem to possess boundless energy, while adults past 30 feel chronically fatigued even after a full night's sleep? The answer lies at the sub-cellular level within a coenzyme called Nicotinamide Adenine Dinucleotide (NAD+).</p>
    
    <h3>The Cellular Fuel Gauges</h3>
    <p>NAD+ is present in every living cell. It plays a critical role in cellular respiration, acting as an electron shuttle in the mitochondria to produce Adenosine Triphosphate (ATP)—the currency of cellular energy. Without NAD+, your cells cannot extract energy from food, and biological processes grind to a halt.</p>
    
    <h3>The Steep Decline</h3>
    <p>Scientific research has revealed that NAD+ levels decline dramatically with age. By the time we reach 40, our NAD+ levels are roughly 50% of what they were in our youth. By age 60, they plummet to just 10%. This decline is caused by two factors: decreased cellular synthesis of NAD+ and increased destruction by NAD+-consuming enzymes like CD38 and PARP (which are activated by chronic low-grade inflammation and DNA damage).</p>
    <p>By supplying NAD+ precursors like NR (Nicotinamide Riboside) and NMN, we can bypass the enzymes that slow down production, replenishing cellular NAD+ pools. This helps restore mitochondrial efficiency, triggers sirtuin longevity pathways, and helps repair damaged DNA strands.</p>`
  },
  {
    id: 4,
    title: "Glutathione — The Master Antioxidant Your Body Actually Needs",
    slug: "glutathione-master-antioxidant",
    topic: "Longevity",
    readTime: "5 min read",
    date: "May 03, 2026",
    summary: "Explore why Glutathione is called the master antioxidant, how it recycles other vitamins, and why the liposomal format is key for oral intake.",
    content: `<p>Every second, your cells are bombarded by reactive oxygen species (ROS)—unstable free radicals that damage DNA, cause cellular senescence, and accelerate aging. While Vitamin C and Vitamin E help neutralize these radicals, they are quickly depleted. Enter Glutathione: the absolute master antioxidant that keeps the entire cellular cleanup system running.</p>
    
    <h3>The Master Defender</h3>
    <p>Glutathione is a simple tripeptide synthesized in our cells. What makes it unique is its ability to neutralize free radicals directly and then recycle other critical antioxidants, including Vitamin C and Vitamin E, returning them to their active forms. It is also the principal conjugation agent in Phase II liver detoxification, binding to heavy metals and toxins to ensure safe excretion.</p>
    
    <h3>The Absorption Problem</h3>
    <p>Unfortunately, supplementing with standard oral glutathione has traditionally been ineffective. The enzyme gamma-glutamyltransferase in the stomach rapidly breaks glutathione down into its constituent amino acids, rendering it useless. To overcome this, Kenwell utilizes a Reduced L-Glutathione formula, protecting the tripeptide bond and allowing it to reach cells intact where it can perform its vital antioxidant roles.</p>`
  },
  {
    id: 5,
    title: "Vitamin D3 + K2 + Calcium: Why They Only Work Together",
    slug: "vitamin-d3-k2-calcium-synergy",
    topic: "Vitamins",
    readTime: "5 min read",
    date: "April 28, 2026",
    summary: "Taking calcium alone can be dangerous. Read the scientific breakdown of how D3 absorbs calcium, and K2 guides it safely to your bones.",
    content: `<p>For decades, physicians recommended that aging adults take calcium supplements to protect their bone density. However, large clinical trials later revealed a worrying trend: high calcium supplementation was correlated with an increased risk of cardiovascular events, including arterial hardening. The solution to this paradox lies in the crucial synergy between Vitamin D3 and Vitamin K2.</p>
    
    <h3>The Calcium Traffic Controller</h3>
    <p>To understand why this happens, think of Calcium as a heavy package, Vitamin D3 as the delivery truck, and Vitamin K2 as the GPS navigation system. Without D3, calcium cannot be absorbed from the gut into the bloodstream. But once in the bloodstream, calcium does not automatically know where to go. Without guidance, it can deposit in soft tissues, leading to calcification of the arteries.</p>
    <p>Vitamin K2 activates two vital proteins: osteocalcin (which binds calcium to the bone matrix) and Matrix Gla Protein (which inhibits calcification of the arterial wall). By taking D3 and K2 together, you ensure that calcium is both absorbed and delivered directly to where it belongs: your bones and teeth, keeping your arteries flexible and clean.</p>`
  },
  {
    id: 6,
    title: "Ashwagandha KSM-66: The Adaptogen with Real Clinical Evidence",
    slug: "ashwagandha-ksm66-clinical-evidence",
    topic: "Stress",
    readTime: "6 min read",
    date: "April 22, 2026",
    summary: "Ashwagandha is a popular stress remedy, but not all extracts are equal. Learn why the KSM-66 standardization has become the clinical standard.",
    content: `<p>Ashwagandha (Withania somnifera) is one of the most revered herbs in traditional Ayurveda. In the modern supplement landscape, it is categorized as an adaptogen—a substance that helps the body adapt to physical, chemical, and psychological stressors. However, raw ashwagandha root powder varies wildly in potency. To get consistent clinical results, standard extraction is required. That's why science points to KSM-66.</p>
    
    <h3>What is KSM-66?</h3>
    <p>KSM-66 is a proprietary, full-spectrum extract produced using a unique processing technology that does not use alcohol or chemical solvents. It is standardized to contain a high concentration of active compounds called withanolides, using only the roots of the plant (traditional Ayurveda warns against using ashwagandha leaves due to high levels of the cytotoxic compound withanone).</p>
    
    <h3>Taming the Cortisol Spike</h3>
    <p>In clinical trials, daily supplementation with 600mg of KSM-66 was shown to reduce serum cortisol levels by up to 27%. Cortisol is the body's primary stress hormone; chronic elevation leads to anxiety, abdominal fat storage, muscle breakdown, and sleep disruption. By modulating the HPA axis, KSM-66 helps maintain physiological balance, leading to reduced stress, improved focus, and improved sleep quality.</p>`
  },
  {
    id: 7,
    title: "CoQ10 and Cellular Energy: Your Mitochondria's Best Friend",
    slug: "coq10-and-cellular-energy",
    topic: "Longevity",
    readTime: "5 min read",
    date: "April 15, 2026",
    summary: "Delve into the biology of the mitochondria and discover why Coenzyme Q10 is essential for ATP production, muscle health, and longevity.",
    content: `<p>Your body is powered by trillions of tiny cellular engines called mitochondria. Inside these mitochondria, oxygen and nutrients are converted into ATP (cellular energy). A key player in this energy conversion process is Coenzyme Q10 (CoQ10), a vital molecule that declines as we age and is depleted by certain cardiovascular medications.</p>
    
    <h3>The Electron Carrier</h3>
    <p>Within the mitochondrial membrane, CoQ10 functions as an electron shuttle. It transfers electrons between Complexes I/II and Complex III of the electron transport chain, driving the proton pump that generates ATP. Tissues with high metabolic demands—such as the heart, brain, and skeletal muscle—require high concentrations of CoQ10 to function efficiently. CoQ10 also serves as a potent antioxidant, protecting cellular membranes from lipid peroxidation.</p>`
  },
  {
    id: 8,
    title: "TUDCA: The Liver Protector Everyone Should Know About",
    slug: "tudca-liver-protector",
    topic: "Gut Health",
    readTime: "5 min read",
    date: "April 08, 2026",
    summary: "Discover TUDCA, a unique bile acid that helps relieve liver congestion, protects hepatic cells from toxicity, and supports gallbladder function.",
    content: `<p>While Milk Thistle is the most famous liver supplement, advanced wellness protocols often rely on a lesser-known but highly effective compound: Tauroursodeoxycholic Acid, or TUDCA. As a hydrophilic bile acid, TUDCA offers unique cellular protection that sets it apart from traditional herbs.</p>
    
    <h3>The Problem with Cholestasis</h3>
    <p>When the liver is stressed or exposed to toxins, the flow of bile can slow down or become congested, a condition known as cholestasis. When bile acids accumulate inside liver cells, they can cause cellular damage. TUDCA helps by diluting the pool of toxic bile acids, promoting healthy bile flow, and protecting liver cells from endoplasmic reticulum (ER) stress, which prevents cell damage.</p>`
  },
  {
    id: 9,
    title: "Why Berberine Is Being Called Nature's Metformin",
    slug: "why-berberine-is-natures-metformin",
    topic: "Longevity",
    readTime: "6 min read",
    date: "April 01, 2026",
    summary: "Examine the clinical research behind Berberine HCL. Learn how it activates AMPK, improves insulin sensitivity, and helps manage glucose levels.",
    content: `<p>In the health and wellness community, Berberine has emerged as one of the most talked-about supplements. Extracted from barberry roots, this yellow alkaloid is frequently referred to as 'nature's metformin' because of its ability to support metabolic health and blood sugar levels.</p>
    
    <h3>Activating the AMPK Pathway</h3>
    <p>Berberine's primary mechanism of action is the activation of AMP-Activated Protein Kinase (AMPK). Often called the 'metabolic master switch,' AMPK regulates energy balance inside cells. When activated, it promotes glucose uptake in muscle cells, increases insulin sensitivity, and helps regulate hepatic gluconeogenesis. Clinical trials show that berberine is highly effective at supporting healthy HbA1c levels and metabolic health.</p>`
  },
  {
    id: 10,
    title: "The Gut-Brain Axis: How Probiotics Affect Your Mood",
    slug: "gut-brain-axis-and-mood",
    topic: "Gut Health",
    readTime: "6 min read",
    date: "March 25, 2026",
    summary: "Your gut is your second brain. Discover the biochemistry behind the vagus nerve connection, and how gut microbes produce key neurotransmitters.",
    content: `<p>If you've ever felt 'butterflies' in your stomach when nervous, you've experienced the gut-brain axis. Your gastrointestinal tract and your brain are constantly communicating through a complex network of nerves, hormones, and immune signals. A key player in this communication is your gut microbiome.</p>
    
    <h3>The Second Brain</h3>
    <p>The gut contains its own nervous system, the enteric nervous system, which contains millions of neurons. Fascinatingly, about 90% of the body's serotonin (the 'happy neurotransmitter') is produced in the gut by enterochromaffin cells, influenced by gut bacteria. By supplementing with key probiotic strains, you can support this neurochemical pathway, helping promote a healthy stress response, stable mood, and overall cognitive wellness.</p>`
  },
  {
    id: 11,
    title: "Understanding Supplement Stacks: What to Combine and Avoid",
    slug: "understanding-supplement-stacks",
    topic: "Performance",
    readTime: "5 min read",
    date: "March 18, 2026",
    summary: "Gain a solid foundation on how to stack supplements safely. Find out which vitamins cooperate and which minerals block each other's absorption.",
    content: `<p>Stacking is the practice of combining different supplements to achieve a synergistic effect. However, more is not always better. Combining the wrong nutrients can reduce absorption or cause minor side effects. Understanding basic supplement interactions is key to building an effective, safe wellness routine.</p>
    
    <h3>Synergistic Combinations</h3>
    <p>Some supplements work best in pairs: Vitamin D3 and Vitamin K2 work together to support bone health; Vitamin C helps keep Glutathione in its active, reduced state; and Fish Oil helps with the absorption of fat-soluble vitamins (like D3 and CoQ10). Knowing these pairings allows you to get the most out of your wellness routine.</p>`
  },
  {
    id: 12,
    title: "Clean Label vs Proprietary Blends: What You Need to Know",
    slug: "clean-label-vs-proprietary-blends",
    topic: "Vitamins",
    readTime: "5 min read",
    date: "March 10, 2026",
    summary: "We believe in full transparency. Learn the difference between clean, open supplement labels and proprietary formulas that hide exact dosages.",
    content: `<p>When you read a supplement label, you should know exactly what you are putting into your body. Unfortunately, many brands hide their formulas behind 'proprietary blends,' grouping ingredients together and listing only a total weight. We believe in a different approach: 100% transparency.</p>
    
    <h3>The Issue with Proprietary Blends</h3>
    <p>Proprietary blends allow companies to list popular ingredients on the label without disclosing their actual amounts. This often means that expensive, clinically studied ingredients are included in tiny, ineffective dosages, while cheaper fillers make up the bulk of the blend. Choosing a clean, transparent label ensures you know the exact dosage of every ingredient, giving you complete peace of mind.</p>`
  }
];
