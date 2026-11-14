export interface JournalEntry {
  slug: string;
  number: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  paragraphs: string[];
}

export const journalEntries: JournalEntry[] = [
  {
    slug: 'kampala-prime-residential-outlook',
    number: '01',
    title: 'Prime Residential Demand Across Kololo, Nakasero, and Entebbe',
    category: 'Market Outlook',
    date: 'October 2026',
    readTime: '4 min read',
    author: 'Sarah Namukasa, Managing Partner',
    excerpt:
      'Why turnkey architectural homes priced between UGX 2 billion and UGX 6.5 billion continue to outperform generic speculative builds across Greater Kampala.',
    paragraphs: [
      'Across Kampala and the Entebbe corridor, discerning buyers and diplomatic tenants are showing clear preference for thoughtfully engineered residences with reliable off-grid infrastructure, generous natural ventilation, and authentic local stone and timber finishes.',
      'In neighborhoods such as Kololo and Nakasero, land scarcity means well-designed properties on titled freehold or private mailo plots retain strong capital appreciation in both Ugandan Shillings and hard-currency equivalents.',
      'At Demo Real Estate, our advisory inspections look past surface staging to verify structural waterproofing, solar inverter capacity, borehole yields, and clean title lineage before any property is presented to clients.'
    ]
  },
  {
    slug: 'courtyard-living-tropical-architecture',
    number: '02',
    title: 'Designing Private Courtyard Homes for Tropical Comfort',
    category: 'Architecture',
    date: 'September 2026',
    readTime: '5 min read',
    author: 'David Okello, Head of Advisory',
    excerpt:
      'How shaded verandas, cross-ventilation courts, and deep roof overhangs keep contemporary Ugandan homes naturally cool year-round.',
    paragraphs: [
      'The finest contemporary residences in East Africa borrow timeless lessons from climate-responsive architecture: deep eaves that shield glazing from overhead rain and midday glare, paired with central planted courts that pull cool air through living spaces.',
      'An internal garden courtyard also solves urban privacy effortlessly. In vibrant districts such as Munyonyo and Bugolobi, inward-facing rooms allow families to enjoy open steel doors and outdoor dining without street noise.',
      'When guiding buyers through new developments, we consistently highlight properties that blend indoor lounges seamlessly with shaded outdoor entertaining decks.'
    ]
  },
  {
    slug: 'entebbe-express-waterfront-corridor',
    number: '03',
    title: 'How the Entebbe Corridor Reshaped Waterfront Living',
    category: 'Investment',
    date: 'August 2026',
    readTime: '3 min read',
    author: 'Grace Birungi, Senior Property Advisor',
    excerpt:
      'Why Lubowa, Munyonyo, and the Bugonga peninsula have become prime residential destinations for executives and returning diaspora buyers.',
    paragraphs: [
      'Improved expressway connectivity between central Kampala, Lubowa, and Entebbe has transformed weekend lakeside plots into practical primary residences for executives and families.',
      'Buyers seeking properties between UGX 2.1 billion and UGX 6.4 billion increasingly prioritize gated security, rapid airport commutes, and direct lake breezes over dense inner-city traffic.',
      'Our Entebbe and Kampala desks coordinate private viewings across both urban penthouses and waterfront estates in a single afternoon itinerary.'
    ]
  }
];
