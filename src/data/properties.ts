import type { ImageMetadata } from 'astro';
import heroVilla from '../assets/images/hero-villa.jpg';
import coastalPavilion from '../assets/images/coastal-pavilion.jpg';
import penthouseLiving from '../assets/images/penthouse-living.jpg';
import courtyardTownhouse from '../assets/images/courtyard-townhouse.jpg';
import alpineChalet from '../assets/images/alpine-chalet.jpg';
import materialStaircase from '../assets/images/material-staircase.jpg';

export type PropertyCategory = 'Villas' | 'Penthouses' | 'Townhouses' | 'Estates';

export interface Property {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: PropertyCategory;
  location: string;
  region: string;
  price: string;
  priceNumericBillions: number;
  area: string;
  plot: string;
  bedrooms: number;
  bathrooms: number;
  year: string;
  architect: string;
  status: string;
  featuredLabel: string;
  image: ImageMetadata;
  imageAlt: string;
  secondaryImage: ImageMetadata;
  secondaryImageAlt: string;
  summary: string;
  narrative: string[];
  materials: string[];
  highlights: { label: string; value: string }[];
}

export const properties: Property[] = [
  {
    slug: 'villa-solis-kololo',
    index: '01',
    title: 'Villa Solis Kololo',
    subtitle: 'Private Limestone Residence with Reflection Pool',
    category: 'Villas',
    location: 'Kololo Hill',
    region: 'Kampala, Uganda',
    price: 'UGX 4,850,000,000',
    priceNumericBillions: 4.85,
    area: '520 sqm',
    plot: '0.65 Acres (Freehold)',
    bedrooms: 5,
    bathrooms: 6,
    year: '2025',
    architect: 'Kampala Urban Studio',
    status: 'Available Now',
    featuredLabel: 'Signature Listing',
    image: heroVilla,
    imageAlt: 'Villa Solis Kololo limestone facade and slate reflection pool at golden hour',
    secondaryImage: materialStaircase,
    secondaryImageAlt: 'Interior travertine stair gallery illuminated by overhead skylight',
    summary:
      'Set along a quiet diplomatic avenue in Upper Kololo, Villa Solis pairs warm honed stone facades with expansive bronze glazing, shaded veranda terraces, and a 20-meter reflection pool.',
    narrative: [
      'Positioned on an elevated 0.65-acre freehold plot in Upper Kololo, the residence separates formal entertaining pavilions from private bedroom wings around a lush landscaped garden court.',
      'Deep cantilevered eaves shield the living gallery from midday equatorial sun while drawing evening breezes across cool honed stone floors and custom Mvule hardwood joinery.',
      'The grounds include a detached 70 sqm guest cottage, staff quarters for three, solar battery backup, and a secure perimeter gatehouse.'
    ],
    materials: ['Honed Natural Limestone', 'Mvule Hardwood Joinery', 'Blackened Steel Glazing', 'Slate Reflection Basin'],
    highlights: [
      { label: 'Title Tenure', value: 'Private Mailo / Freehold' },
      { label: 'Ceiling Height', value: '3.9 meters' },
      { label: 'Power & Water', value: '15 kVA Hybrid Solar & Borehole' },
      { label: 'Guest Wing', value: 'Detached 1-Bed Cottage' }
    ]
  },
  {
    slug: 'peninsula-pavilion-entebbe',
    index: '02',
    title: 'Lakefront Pavilion',
    subtitle: 'Cantilevered Concrete & Timber Waterfront Estate',
    category: 'Estates',
    location: 'Bugonga Peninsula',
    region: 'Entebbe, Uganda',
    price: 'UGX 6,400,000,000',
    priceNumericBillions: 6.4,
    area: '610 sqm',
    plot: '1.2 Acres Waterfront',
    bedrooms: 5,
    bathrooms: 6,
    year: '2024',
    architect: 'Nile Craft Architects',
    status: 'Exclusive Mandate',
    featuredLabel: 'Waterfront Estate',
    image: coastalPavilion,
    imageAlt: 'Lakefront Pavilion cantilevered concrete and timber residence overlooking calm waters',
    secondaryImage: penthouseLiving,
    secondaryImageAlt: 'Expansive lake-facing living gallery with stone hearth',
    summary:
      'Anchored along the quiet Bugonga shoreline overlooking Lake Victoria, this cantilevered concrete and cedar residence delivers uninterrupted water horizons and private jetty access.',
    narrative: [
      'Engineered to embrace Lake Victoria views from every principal room, the primary living volume projects cleanly above sloping coastal lawns with wrap-around covered viewing decks.',
      'Sliding acoustic glass walls open the dining pavilion straight onto a granite terrace, outdoor fire pit, and shaded infinity edge overlooking the peninsula.',
      'Located ten minutes from Entebbe International Airport and private aviation terminals, the estate offers effortless regional connectivity.'
    ],
    materials: ['Architectural Board Concrete', 'Treated Cedar Soffits', 'Acoustic Triple Glazing', 'Local Granite Stone'],
    highlights: [
      { label: 'Shoreline', value: '85m Private Waterfront' },
      { label: 'Airport Access', value: '10 Mins to Entebbe Int.' },
      { label: 'Living Span', value: '12m Column-Free Lounge' },
      { label: 'Security', value: 'Gated Peninsula Drive' }
    ]
  },
  {
    slug: 'nakasero-sky-penthouse',
    index: '03',
    title: 'Nakasero Sky Loft',
    subtitle: 'Double-Height Full-Floor Diplomatic Penthouse',
    category: 'Penthouses',
    location: 'Nakasero',
    region: 'Kampala, Uganda',
    price: 'UGX 3,200,000,000',
    priceNumericBillions: 3.2,
    area: '380 sqm',
    plot: 'Private Roof Terrace',
    bedrooms: 3,
    bathrooms: 4,
    year: '2024',
    architect: 'Atelier Kivu',
    status: 'Available Now',
    featuredLabel: 'Skyline Residence',
    image: penthouseLiving,
    imageAlt: 'Nakasero Sky Loft double-height living gallery with floor-to-ceiling windows',
    secondaryImage: courtyardTownhouse,
    secondaryImageAlt: 'Landscaped private outdoor terrace lounge',
    summary:
      'Crowning an intimate eight-residence tower in Nakasero, this duplex penthouse combines five-meter windows, panoramic Kampala skyline views, and a landscaped rooftop terrace.',
    narrative: [
      'Keyed private elevator access opens straight into a double-height reception salon washed in morning daylight and framed by sleek steel-profile windows.',
      'A custom travertine hearth anchors the main entertaining area, complemented by an enclosed chef kitchen, wine wall, and quiet mezzanine study.',
      'Above, a 110 sqm private roof deck accommodates dining for sixteen with sweeping views over Nakasero greenbelt and Lake Victoria in the distance.'
    ],
    materials: ['Honed Travertine Hearth', 'Oiled Oak Flooring', 'Acoustic Steel Frames', 'Mineral Plaster Walls'],
    highlights: [
      { label: 'Ceiling Volume', value: '5.2m Double-Height Salon' },
      { label: 'Elevator', value: 'Direct Keyed Lift Entry' },
      { label: 'Roof Deck', value: '110 sqm Private Terrace' },
      { label: 'Parking', value: '3 Covered Bays + Storage' }
    ]
  },
  {
    slug: 'courtyard-house-munyonyo',
    index: '04',
    title: 'Munyonyo Courtyard House',
    subtitle: 'Sanctuary Residence Around a Private Garden Cloister',
    category: 'Townhouses',
    location: 'Munyonyo',
    region: 'Kampala, Uganda',
    price: 'UGX 2,450,000,000',
    priceNumericBillions: 2.45,
    area: '360 sqm',
    plot: '0.32 Acres',
    bedrooms: 4,
    bathrooms: 4,
    year: '2025',
    architect: 'Studio Savannah',
    status: 'Available Now',
    featuredLabel: 'Garden Courtyard',
    image: courtyardTownhouse,
    imageAlt: 'Munyonyo Courtyard House sunlit paved inner courtyard with olive tree and arched steel doors',
    secondaryImage: materialStaircase,
    secondaryImageAlt: 'Sculptural interior staircase leading to upper suites',
    summary:
      'Designed around an inward-facing landscaped courtyard with arched steel doors and warm limestone paving, this Munyonyo home balances urban proximity with complete garden privacy.',
    narrative: [
      'Every ground-floor living zone opens via full-height steel French doors onto a sheltered central garden shaded by mature specimen trees and gentle water features.',
      'Thick thermal masonry walls keep the interior naturally cool throughout the afternoon, while a private upper-level library terrace catches late-day lake breezes.',
      'Minutes from Munyonyo Commonwealth Resort, international schools, and the Southern Bypass expressway.'
    ],
    materials: ['Dressed Limestone Paving', 'Hand-Welded Steel Doors', 'Lime Plaster Masonry', 'Clay Roof Tiles'],
    highlights: [
      { label: 'Courtyard', value: '105 sqm Private Cloister' },
      { label: 'School Proximity', value: '8 Mins to Int. Schools' },
      { label: 'Garage', value: 'Covered 2-Car Carport' },
      { label: 'Backup Systems', value: '10 kVA Inverter & Rainwater' }
    ]
  },
  {
    slug: 'fort-portal-ridge-retreat',
    index: '05',
    title: 'Rwenzori Ridge Lodge',
    subtitle: 'Timber & Stacked Granite Mountain Retreat',
    category: 'Estates',
    location: 'Fort Portal',
    region: 'Western Uganda',
    price: 'UGX 3,900,000,000',
    priceNumericBillions: 3.9,
    area: '440 sqm',
    plot: '3.5 Acres Tea & Forest',
    bedrooms: 4,
    bathrooms: 5,
    year: '2025',
    architect: 'Highland Timber Works',
    status: 'Private Preview',
    featuredLabel: 'Highland Estate',
    image: alpineChalet,
    imageAlt: 'Rwenzori Ridge Lodge timber and stone residence glowing warmly against misty hills at dusk',
    secondaryImage: heroVilla,
    secondaryImageAlt: 'Evening architectural facade illumination against stone terrace',
    summary:
      'Elevated above misty tea hills outside Fort Portal, this charred timber and dry-stacked granite compound frames dramatic Rwenzori mountain sunrises from floor-to-ceiling glazing.',
    narrative: [
      'Set on 3.5 private acres bordering crater lake trails, the residence anchors into the hillside on a heavy stone plinth housing a tasting cellar, gear room, and cedar sauna.',
      'The upper timber pavilion cantilevers over wild mountain flora, offering crisp morning views across the foothills from a wrap-around fireplace lounge.',
      'Ideal as a private family highland sanctuary or boutique executive retreat with full off-grid solar autonomy.'
    ],
    materials: ['Charred Eucalyptus & Larch', 'Stacked Local Granite', 'Polished Concrete Slabs', 'Brushed Brass Hardware'],
    highlights: [
      { label: 'Elevation', value: '1,580m Cool Highland Air' },
      { label: 'Wellness', value: 'Cedar Sauna & Plunge Deck' },
      { label: 'Energy', value: '100% Solar Microgrid' },
      { label: 'Acreage', value: '3.5 Acres Titled Land' }
    ]
  },
  {
    slug: 'lubowa-gallery-residence',
    index: '06',
    title: 'Lubowa Gallery Residence',
    subtitle: 'Sculptural Skylit Duplex in Gated Enclave',
    category: 'Villas',
    location: 'Lubowa Hill',
    region: 'Kampala Metro, Uganda',
    price: 'UGX 2,150,000,000',
    priceNumericBillions: 2.15,
    area: '345 sqm',
    plot: '0.28 Acres',
    bedrooms: 4,
    bathrooms: 4,
    year: '2024',
    architect: 'Vogt & Kigozi',
    status: 'Available Now',
    featuredLabel: 'Gated Community',
    image: materialStaircase,
    imageAlt: 'Lubowa Gallery Residence monolithic travertine staircase beneath bright skylight',
    secondaryImage: penthouseLiving,
    secondaryImageAlt: 'Upper level reception salon with minimalist hearth',
    summary:
      'Situated inside a quiet 24-hour gated enclave on Lubowa Hill, this light-filled contemporary residence centers around a carved stone staircase beneath a continuous skylight.',
    narrative: [
      'Natural daylight streams down two stories of smooth hand-finished plaster walls, creating a serene gallery-like arrival that transitions seamlessly into open-plan family dining.',
      'The ground floor features a guest suite, home office, and custom island kitchen opening onto a covered barbecue terrace.',
      'Positioned along the Entebbe Express corridor for rapid twenty-minute access to both central Kampala and Entebbe.'
    ],
    materials: ['Carved Ivory Travertine', 'Smoked Hardwood Floors', 'Acoustic Glass Partitions', 'Matte Bronze Fixtures'],
    highlights: [
      { label: 'Community', value: '24/7 Gated Security Estate' },
      { label: 'Express Access', value: '5 Mins to Entebbe Express' },
      { label: 'Atrium', value: 'Full-Length Skylight Stair' },
      { label: 'Parking', value: 'Paved Forecourt for 4 Cars' }
    ]
  }
];
